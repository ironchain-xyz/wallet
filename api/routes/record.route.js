require('dotenv').config();

const router = require("express").Router();

const asyncHandler = require('express-async-handler')

const db = require("../models");
const User = db.users;
const Evidence = db.evidences;
const Record = db.records;

const Reference = db.refereces;
const Collection = db.collections;

const { ethers } = require("ethers");
function genEvidenceHash(filename, mimeType, contentHash) {
    const hash = ethers.utils.sha256(ethers.utils.defaultAbiCoder.encode(
        ["string", "string", "string"],
        [filename, mimeType, contentHash]
    ));
    return hash.substring(2);
}

function genRecordHash(data) {
    const evidences = data.evidences.map(e => e.hash);
    evidences.sort();
    const references = data.references.map(r => r.hash);
    references.sort();

    const hash = ethers.utils.sha256(ethers.utils.defaultAbiCoder.encode(
        ["string", "string[]", "string[]"],
        [data.description, evidences, references]
    ));
    return hash.substring(2);
}

router.get('/', asyncHandler(async (req, res) => {
    const record = await Record.findByPk(
        req.body.hash,
        {
            includes: [
                {
                    model: Collection,
                    required: false,
                    where: {collected: true},
                    include: {
                        model: User,
                        attributes: ["username"]
                    }
                },
                {
                    model: Reference,
                    required: false,
                    include: {
                        model: User,
                        as: "creator",
                        attributes: ["username"]
                    }
                },
                {
                    model: Evidence,
                    required: false,
                },
                {
                    model: User,
                    as: "creator",
                    attributes: ["username"]
                }
            ],
        }
    );
    res.send({record});
}));

router.post('/new', asyncHandler(async (req, res) => {
    for (const evidence of req.body.evidences) {
        evidence.hash = genEvidenceHash(evidence);
    }
    const hash = genRecordHash(req.body);
    let record = await Record.findByPk(hash);
    if (record) {
        res.status(400).send({error: `record already exists at ${hash}`});
    }

    record = await Record.create({
        hash,
        description: req.body.description,
        evidenceHashes: req.body.evidences.map(e => e.hash),
        referenceHashes: req.body.references.map(r => r.hash),
        evidences: req.body.evidences,
        records: req.body.references,
        createdBy: req.user.id,
    }, {
        includes: [
            { model: User, as: "creator" },
            {
                model: Evidence,
                includes: {
                    model: RawFile
                }
            },
            {
                model: Record
            }
        ]
    });
    res.send({record});
}));

const { Op } = require('sequelize');
router.get('/created', asyncHandler(async (req, res) => {
    const query = req.query.startAt ? {
        createdBy: req.user.id,
        createdAt: {[Op.gte]: req.query.startAt}
    } : {createdBy: req.user.id};
    const records = await Record.findAll({
        where: query,
        orderBy: [["createdAt", DESC]],
        limit: req.query.limit,
        offset: req.query.offset,
        include: [
            {
                model: Collection,
                required: false,
                where: {collected: true},
                include: {
                    model: User,
                    attributes: ["username"]
                }
            },
            {
                model: Reference,
                required: false,
                include: {
                    model: User,
                    as: "creator",
                    attributes: ["username"]
                }
            },
            {
                model: Evidence,
                required: false,
                include: {
                    model: RawFile
                }
            },
            {
                model: User,
                as: "creator",
                attributes: ["username"]
            }
        ],
    });
    res.send({records});
}));

router.get('/collections', asyncHandler(async (req, res) => {
    const query = req.query.startAt ? {
        userId: req.user.id,
        collected: true,
        updatedAt: {[Op.gte]: req.query.startAt}
    } : {userId: req.user.id, collected: true};
    const collections = await Collection.findAll({
        where: query,
        orderBy: [["updatedAt", DESC]],
        limit: req.query.limit,
        offset: req.query.offset,
        include: {
            model: Record,
            include: [
                {
                    model: Collection,
                    required: false,
                    where: {collected: true},
                    include: [
                        {
                            model: User,
                            attributes: ["username"]
                        },
                    ]
                },
                {
                    model: Reference,
                    required: false,
                    include: {
                        model: User,
                        as: "creator",
                        attributes: ["username"]
                    }
                },
                {
                    model: Evidence,
                    required: false,
                },
                {
                    model: User,
                    as: "creator",
                    attributes: ["username"]
                }
            ]
        },
    });
    res.send({collections});
}));

router.post('/addToCollection', asyncHandler(async (req, res) => {
    const collect = await Collection.findOne({
        where: {
            userId: req.user.id,
            recordHash: req.body.hash,
        },
        attributes: ["userId", "recordHash", "collected"]
    });
    if (!collect) {
        await Collection.create({
            userId: req.user.id,
            recordHash: req.body.hash,
            collected: true
        });
        res.send({ok: true});
    } else if (collect.collected) {
        res.send({ok: true, message: "Already collected"});
    } else {
        await collect.update({collected: true});
        res.send({ok: true});
    }
}));

router.post('/removeFromCollection', asyncHandler(async (req, res) => {
    const collect = await Collection.findOne({
        where: {
            userId: req.user.id,
            recordHash: req.body.hash,
        },
        attributes: ["userId", "recordHash", "collected"]
    });
    if (!collect || !collect.collected) {
        return res.send({error: "Not collected"});
    }
    await collect.update({collected: false});
    res.send({ok: true});
}));

module.exports = router
