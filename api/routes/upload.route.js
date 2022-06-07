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

const fileSize = async (filePath) => {
    return new Promise((resolve, reject) => {
        fs.stats(filePath, (err, stats) => {
            if (err) {
                reject();
            }
            resolve(stats.size);
        })
    });
}

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

const createRawFile = async (tmpFile, hash, size) => {
    await rename(tmpFile, path.join(EVIDENCE_PATH, hash));
    return await RawFile.create({hash, size});
};

router.get('/raw', asyncHandler(async (req, res) => {
    let file = await RawFile.findByPk(req.query.hash);
    if (file) {
        res.send({ exists: true, file });
    }

    try {
        const filePath = path.join(EVIDENCE_PATH, req.query.hash);
        const size = await fileSize(filePath);
        file = await RawFile.create({hash: req.query.hash, size});
        res.send({exists: true, file})
    } catch (_err) {
        res.send({exists: false})
    }
}));

router.get('/raw/download', asyncHandler(async (req, res) => {
    var options = {
        root: EVIDENCE_PATH,
        dotfiles: 'deny',
        headers: {
          'x-timestamp': Date.now(),
          'x-sent': true,
        }
    };
    var fileName = req.query.hash;
    res.setHeader(
        "Content-Type", req.query.mimeType
    ).sendFile(req.query.hash, options, function (err) {
        if (err) {
          next(err)
        } else {
          console.log('Sent:', fileName)
        }
    });
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
            createRawFile(tmpFile, hash.digest('hex'), size).then((file) => {
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
