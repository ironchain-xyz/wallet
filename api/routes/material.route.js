require('dotenv').config();

const router = require("express").Router();
const asyncHandler = require('express-async-handler')

const db = require("../models");
const User = db.users;
const Evidence = db.evidences;
const RawFile = db.rawFiles;
const Material = db.materials;

const { ethers } = require("ethers");
function genEvidenceHash(filename, mimeType, contentHash) {
    const hash = ethers.utils.sha256(ethers.utils.defaultAbiCoder.encode(
        ["string", "string", "string"],
        [filename, mimeType, contentHash]
    ));
    return hash.substring(2);
}

function genMaterialHash(data) {
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
    const material = await Material.findByPk(
        req.query.hash,
        {
            include: [
                {
                    model: Evidence,
                    as: "evidences",
                    required: false,
                    include: {
                        model: RawFile,
                    }
                },
                {
                    model: User,
                    as: "creator",
                    attributes: ["username"]
                }
            ],
        }
    );
    res.send(material);
}));

router.post('/new', asyncHandler(async (req, res) => {
    for (const e of req.body.evidences) {
        e.hash = genEvidenceHash(e.name, e.mimeType, e.raw);
    }
    const hash = genMaterialHash(req.body);
    let material = await Material.findByPk(hash);
    if (material) {
        res.status(400).send({error: `material already exists at ${hash}`});
    }

    material = await Material.create({
        hash,
        spaceId: req.body.spaceId,
        description: req.body.description,
        evidences: req.body.evidences,
        createdBy: req.user.id,
    }, {
        include: [
            { model: User, as: "creator" },
            { model: Space },
            {
                model: Evidence,
                as: "evidences",
            },
            {
                model: Reference,
                as: "references"
            }
        ]
    });
    res.send({hash});
}));

const { Op } = require('sequelize');
router.get('/created', asyncHandler(async (req, res) => {
    const query = req.query.startAt ? {
        createdBy: req.user.id,
        createdAt: {[Op.lte]: req.query.startAt}
    } : {
        createdBy: req.user.id
    };
    const materials = await Material.findAll({
        where: query,
        order: [["createdAt", "DESC"]],
        limit: req.query.limit,
        offset: req.query.offset,
        include: [
            {
                model: File,
                as: "files",
                required: false,
                include: {
                    model: RawFile,
                }
            },
            {
                model: User,
                as: "creator",
                attributes: ["username"]
            }
        ],
    });
    res.send({materials});
}));

module.exports = router
