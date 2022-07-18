require('dotenv').config();

const router = require("express").Router();

const crypto = require('crypto')
const path = require('path');
const fs = require('fs');
const asyncHandler = require('express-async-handler')

const busboy = require('busboy');
const TMP_PATH = path.join(__dirname, "../upload/tmp");
const FILE_PATH = path.join(__dirname, "../upload/files");

const db = require("../models");
const File = db.File;

const { ethers } = require("ethers");
function getFilesHash(filename, mimeType, contentHash) {
    const hash = ethers.utils.sha256(ethers.utils.defaultAbiCoder.encode(
        ["string", "string", "string"],
        [filename, mimeType, contentHash]
    ));
    return hash.substring(2);
}

const tryToRename = (oldFile, newFile) => {
    return new Promise((resolve, reject) => {
        fs.stat('foo.txt', function(err, stat) {
            if (err == null) {
                return resolve();
            } else if (err.code === 'ENOENT') {
                fs.rename(oldFile, newFile, (err) => {
                    if (err) {
                        fs.unlink(oldFile, (err) => {
                            console.log(`Failed to remove ${oldFile} with error ${err}`);
                        });
                        return reject(err);
                    }
                    return resolve();
                });
            } else {
                return reject("Failed to get file info");
            }
        });
    });
};

const createFile = async (tmpFile, contentHash, info) => {
    await tryToRename(tmpFile, path.join(FILE_PATH, contentHash));
    return await File.create({
        hash: getFilesHash(info.filename, info.mimeType, contentHash),
        mimeType: info.mimeType,
        encoding: info.encoding,
        name: info.filename,
        size: info.filesize,
        contentHash
    })
};

router.get('/exist', asyncHandler(async (req, res) => {
    if (await File.findOne({where: {contentHash: req.query.contentHash}})) {
        res.send({ exist: true });
    } else {
        res.send({ exist: false });
    }
}));

router.get('/:hash', asyncHandler(async (req, res) => {
    var options = {
        root: FILE_PATH,
        dotfiles: 'deny',
        headers: {
          'x-timestamp': Date.now(),
          'x-sent': true,
        }
    };
    const file = await File.findByPk(req.params.hash);
    res.setHeader(
        "Content-Type", file.mimeType
    ).sendFile(file.raw.hash, options, function (err) {
        if (err) {
          next(err)
        } else {
          console.log('Sent:', FILE_PATH + file.raw.hash)
        }
    });
}));

router.post('/upload', asyncHandler(async (req, res) => {
    var files = 0, finished = false, uploaded = [];
    const bb = busboy({ headers: req.headers, limits: { files: 9 } });
    bb.on('file', (name, file, info) => {
        var hash = crypto.createHash('sha256');
        files++;
        var filesize = 0;

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
            filesize += chunk.length;
        });

        outStream.on('finish', () => {
            createFile(tmpFile, hash.digest('hex'), {...info, filesize}).then((file) => {
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
