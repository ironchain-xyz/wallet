require('dotenv').config();

const router = require("express").Router();

const asyncHandler = require('express-async-handler')
const { ethers } = require("ethers");

const db = require("../models");
const Collection = db.collections;
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
        results: facts.map(fact => ({
            hash: fact.hash,
            description: fact.description,
            createdAt: fact.createdAt,
            evidences: fact.evidences,
            references: fact.references,
            creator: fact.creator,
        })),
    });
}));

async function extractEvidences(facts) {
    var hashes = new Set();
    for (const fact of facts) {
        for (const hash of fact.evidences) {
            hashes.add(hash);
        }
    }
    return await File.findAll({
        where: {hash: Array.from(hashes)},
        include: [{
            model: User,
            as: "creator",
            attributes: ["username"]
        }]
    })
}

async function extractReferences(facts) {
    var hashes = new Set();
    for (const fact of facts) {
        for (const hash of fact.references) {
            hashes.add(hash);
        }
    }
    return await Fact.findAll({
        where: {hash: Array.from(hashes)},
        include: [{
            model: User,
            as: "creator",
            attributes: ["username"]
        }]
    })
}

router.get('/created', asyncHandler(async (req, res) => {
    const facts = await Fact.findAll({
        where: {createdBy: req.user.email},
        include: {
            model: Collection,
            required: false,
            where: {collected: true},
            include: {
                model: User,
                attributes: ["username"]
            }
        }
    });
    const evidences = await extractEvidences(facts);
    const references = await extractReferences(facts);
    res.send({
        evidences,
        references,
        facts: facts.map(fact => ({
            hash: fact.hash,
            description: fact.description,
            createdAt: fact.createdAt,
            evidences: fact.evidences,
            references: fact.references,
            collectors: fact.Collections.map(c => c.user.username)
        })),
    });
}));

router.get('/collections', asyncHandler(async (req, res) => {
    const collections = Collection.findAll({
        where: {userEmail: req.user.email, factHash: true},
        include: Fact
    })
    res.send({facts: []});
}));

router.post('/addToCollection', asyncHandler(async (req, res) => {
    const collect = await Collection.findOne({
        where: {
            userEmail: req.user.email,
            factHash: req.body.hash,
        },
        attributes: ["userEmail", "factHash", "collected"]
    });
    if (!collect) {
        await Collection.create({
            userEmail: req.user.email,
            factHash: req.body.hash,
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
    console.log("remove collection");
    const collect = await Collection.findOne({
        where: {
            userEmail: req.user.email,
            factHash: req.body.hash,
        },
        attributes: ["userEmail", "factHash", "collected"]
    });
    if (!collect || !collect.collected) {
        return res.send({error: "Not collected"});
    }
    await collect.update({collected: false});
    res.send({ok: true});
}));

module.exports = router
