require('dotenv').config();

const router = require("express").Router();

const crypto = require('crypto')
const path = require('path');
const fs = require('fs');
const asyncHandler = require('express-async-handler')

const busboy = require('busboy');
const TMP_PATH = path.join(__dirname, "../files/tmp");
const EVIDENCE_PATH = path.join(__dirname, "../files/evidences");

const db = require("../models");
const RawFile = db.rawFiles;
const File = db.files;
const User = db.users;

const { ethers } = require("ethers");
function genFileHash(filename, mimeType, contentHash) {
    const hash = ethers.utils.sha256(ethers.utils.defaultAbiCoder.encode(
        ["string", "string", "string"],
        [filename, mimeType, contentHash]
    ));
    return hash.substring(2);
}

const CreatorSelector = {
    model: User,
    as: "creator",
    attributes: ["username"]
};

const fileExists = async (filePath) => {
    return new Promise((resolve, reject) => {
        fs.access(filePath, fs.F_OK, (err) => {
            if (err) {
                resolve(false);
            }
            resolve(true);
        })
    });
};

const fileSize = async (filePath) => {
    return new Promise((resolve, reject) => {
        fs.stat(filePath, (err, stat) => {
            if (err) {
                reject(false);
            }
            resolve(stat.size);
        })
    });
};

const rename = (oldFile, newFile) => {
    return new Promise((resolve, reject) => {
        fs.rename(oldFile, newFile, (err) => {
            if (err) {
                fs.unlink(oldFile, (err) => {
                    console.log(`Failed to remove ${oldFile} with error ${err}`);
                });
                return reject(err);
            }
            return resolve();
        });
    });
};

const createNewEvidence = async (info) => {
    const hash = genFileHash(
        info.filename,
        info.mimeType,
        info.contentHash
    );
    let file = await File.findOne(
        { where: { hash } },
        { includes: [CreatorSelector] }
    );
    if (!file) {
        try {
            file = await File.create({
                hash,
                name: info.filename,
                mimeType: info.mimeType,
                size: info.size,
                contentHash: info.contentHash,
                createdBy: info.createdBy
            }, {
                includes: [{
                    model: User,
                    as: "creator"
                }]
            });
        } catch(err) {
            console.log(err);
        }
    }
    return file;
}

const saveFileAndCreateNewEvidence = async (tmpFile, info) => {
    await rename(tmpFile, path.join(EVIDENCE_PATH, info.contentHash));
    return createNewEvidence(info);
};

router.get('/checkRaw', asyncHandler(async (req, res) => {
    const filePath = path.join(EVIDENCE_PATH, req.query.contentHash);
    const exists = await fileExists(filePath);
    res.send({ exists });
}));

router.get('/raw', asyncHandler(async (req, res) => {
    var options = {
        root: EVIDENCE_PATH,
        dotfiles: 'deny',
        headers: {
          'x-timestamp': Date.now(),
          'x-sent': true,
        }
    };
    var fileName = req.query.contentHash;
    res.setHeader(
        "Content-Type", req.query.mimeType
    ).sendFile(req.query.contentHash, options, function (err) {
        if (err) {
          next(err)
        } else {
          console.log('Sent:', fileName)
        }
    });
}));

router.get('/', asyncHandler(async (req, res) => {
    const files = await File.findAll({
        where: { hash: req.query.hashes.split(",") },
        include: [CreatorSelector],
    });
    res.send({ result: files });
}));

router.post('/new', asyncHandler(async (req, res) => {
    const filePath = path.join(EVIDENCE_PATH, req.body.contentHash);
    const file = await createNewEvidence({
        ...req.body,
        createdBy: req.user.email,
        size: await fileSize(filePath),
    });
    res.send(file);
}));

router.post('/upload', asyncHandler(async (req, res) => {
    var files = 0, finished = false, uploaded = [];
    const bb = busboy({ headers: req.headers, limits: { files: 5 } });
    bb.on('file', (name, file, info) => {
        var hash = crypto.createHash('sha256');
        files++;
        var size = 0;

        const tmpFile = path.join(TMP_PATH, Date.now() + '-' + info.filename);
        var outStream = fs.createWriteStream(tmpFile)
        outStream.on('err', function (err) {
            console.log(`file upload err ${err}`);
            uploaded.push({ error: "server failed to receive file" });
            if (uploaded.length == files && finished) {
                res.send({ uploaded });
            }
        });

        file.on('data', function (chunk) {
            hash.update(chunk);
            size += chunk.length;
        });

        outStream.on('finish', () => {
            const contentHash = hash.digest('hex');
            saveFileAndCreateNewEvidence(
                tmpFile,
                {
                    ...info,
                    contentHash,
                    createdBy: req.user.email,
                    size,
                }
            ).then((file) => {
                uploaded.push(file);
                if (uploaded.length == files && finished) {
                    res.send({ uploaded });
                }
            }).catch(err => {
                console.log(`Failed to save file with error ${err}`);
                uploaded.push({ error: "server failed to save file" });
                if (uploaded.length == files && finished) {
                    res.send({ uploaded });
                }
            });
        });
        file.pipe(outStream);
    });

    bb.on('close', () => {
        finished = true;
    });
    return req.pipe(bb);
}));

module.exports = router
