require('dotenv').config();

const router = require("express").Router();

const asyncHandler = require('express-async-handler')
const { ethers } = require("ethers");

const db = require("../models");
const User = db.users;
const Fact = db.facts;
const File = db.files;

function genFactHash(description, evidences, references) {
    const hash = ethers.utils.sha256(ethers.utils.defaultAbiCoder.encode(
        ["string", "string[]", "string[]"],
        [description, evidences, references]
    ));
    return hash.substring(2);
}

router.post('/new', asyncHandler(async (req, res) => {
    const description = req.body.description;
    const evidences = req.body.evidences.map(e => e.hash);
    const references = req.body.references.map(r => r.hash);
    evidences.sort();
    references.sort();
    const hash = genFactHash(description, evidences, references);
    let fact = await Fact.findByPk(hash);
    if (!fact) {
        fact = await Fact.create({
            hash,
            description,
            evidences,
            references,
            createdBy: req.user.email,
        }, {
            includes: [
                { model: User, as: "creator" },
            ]
        });
    }
    res.send(fact);
}));

router.get('/', asyncHandler(async (req, res) => {
    const facts = await Fact.findAll({
        where: {hash: req.query.hashes.split(',')},
        include: [
            { model: User, as: "creator", attributes: ['username'] },
        ]
    });
    res.send({
        result: facts.map(fact => ({
            hash: fact.hash,
            description: fact.description,
            createdAt: fact.createdAt,
            evidences: fact.evidences,
            references: fact.references,
            creator: fact.creator,
        })),
    });
}));

router.get('/owned', asyncHandler(async (req, res) => {
    const facts = await Fact.findAll({
        where: {createdBy: req.query.owner}
    });
    res.send({
        result: facts.map(fact => ({
            hash: fact.hash,
            description: fact.description,
            createdAt: fact.createdAt,
            evidences: fact.evidences,
            references: fact.references
        })),
    });
}));

module.exports = router
