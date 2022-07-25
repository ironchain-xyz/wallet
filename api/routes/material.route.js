require('dotenv').config();

const router = require("express").Router();
const asyncHandler = require('express-async-handler')

const db = require("../models");
const User = db.users;
const Material = db.materials;

function genMaterialHash(data) {
    data.content.sort();
    const hash = ethers.utils.sha256(ethers.utils.defaultAbiCoder.encode(
        ["string", "string[]"],
        [data.description, data.content]
    ));
    return hash.substring(2);
}

router.get('/:hash', asyncHandler(async (req, res) => {
    const material = await Material.findByPk(
        req.params.hash,
        {
            include: [
                {
                    model: User,
                    as: "materialCreator",
                    attributes: ["username"]
                }
            ],
        }
    );
    res.send(material);
}));

router.post('/new', asyncHandler(async (req, res) => {
    const hash = genMaterialHash(req.body);
    let material = await Material.findByPk(hash);
    if (material) {
        res.status(400).send({error: `material already exists at ${hash}`});
    }

    material = await Material.create({
        hash,
        spaceId: req.body.spaceId,
        description: req.body.description,
        type: req.body.type,
        links: req.body.links,
        createdBy: req.user.id,
    }, {
        include: [
            { model: User, as: "materialCreator" },
            { model: Space },
        ]
    });
    res.send({hash});
}));

module.exports = router
