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

const rename = (oldFile, newFile) => {
    return new Promise((resolve, reject) => {
        fs.rename(oldFile, newFile, (err) => {
            if (err) { return reject(err); }
            return resolve();
        });
    });
};

const saveFile = async (tmpFile, hash, size, info) => {
    const fileObj = await RawFile.findByPk(hash);
    if (!fileObj) {
        await rename(tmpFile, path.join(EVIDENCE_PATH, hash));
        await RawFile.create({hash: hash, size: size});
    }
    const file = await File.create({
        raw: hash,
        mimetype: info.mimeType,
        encoding: info.encoding,
        originalName: info.filename
    });
    return file;
};

router.post('/evidence', asyncHandler(async (req, res) => {
    var files = 0, finished = false, uploaded = [];
    const bb = busboy({ headers: req.headers });
    bb.on('file', (name, file, info) => {
        var hash = crypto.createHash('sha256');
        var size = 0;
        files++;

        const tmpFile = path.join(TMP_PATH, Date.now() + '-' + info.filename);
        var outStream = fs.createWriteStream(tmpFile)
        outStream.on('err', function (err) {
            console.log(`file upload err ${err}`);
            uploaded.push({
                ok: false,
                message: "server failed to receive file"
            });
        });

        file.on('data', function (chunk) {
            hash.update(chunk);
            size += chunk.length;
        });

        outStream.on('finish', () => {
            const hexHash = hash.digest('hex');
            saveFile(tmpFile, hexHash, size, info).then((file) => {
                uploaded.push({
                    id: file.id,
                    hash: hexHash,
                    size,
                    filename: info.filename,
                    mimeType: info.mimeType,
                });
                if (uploaded.length == files && finished) {
                    res.send({ok: true, uploaded});
                }
            }).catch(err => {
                console.log(`Failed to save file with error ${err}`);
                uploaded.push({
                    ok: false,
                    message: "server failed to save file"
                });
                if (uploaded.length == files && finished) {
                    res.send({ok: true, uploaded});
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
