require('dotenv').config();

const router = require("express").Router();

const { query } = require('express');
const asyncHandler = require('express-async-handler')

const db = require("../models");
const User = db.users;
const File = db.evidences;
const RawFile = db.rawFiles;
const Material = db.materials;
const Space = db.spaces;
const Subscription = db.subscriptions;

router.get('/', asyncHandler(async (req, res) => {
    const space = await Space.findByPk(
        req.query.id,
        {
            include: [
                {
                    model: Material,
                    required: false,
                    include: {
                        model: File,
                        include: {
                            model: RawFile
                        }
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
    res.send({space});
}));

router.post('/new', asyncHandler(async (req, res) => {
    const space = await Space.create({
        name: req.body.name,
        description: req.body.description,
        createdBy: req.user.id,
    }, {
        include: [
            { model: User, as: "creator" },
        ]
    });
    res.send({space});
}));

router.get('/all', asyncHandler(async (req, res) => {
    const spaces = await Space.findAll({
        limit: req.query.limit,
        offset: req.query.offset,
    }, {
        include: [
            {
                model: User, as: "creator"
            },
            {
                model: Material,
                required: false,
                include: {
                    model: File,
                    include: {
                        model: RawFile
                    }
                }
            },
        ]
    });
    res.send({spaces});
}));

router.post('/subscribe', asyncHandler(async (req, res) => {
    const subscription = await Subscription.findOne({
        where: {
            spaceId: req.body.spaceId,
            userId: req.body.userId,
        }
    });
    if (!subscription) {
        await Subscription.create({
            spaceId: req.body.spaceId,
            userId: req.body.userId,
            subscribed: true
        });
        res.send({success: true});
    } else if (subscription.subscribed) {
        res.send({success: true, message: "Already subscribed"});
    } else {
        await Subscription.update({subscription: true});
        res.send({success: true});
    }
}));

router.post('/unsubscribe', asyncHandler(async (req, res) => {
    const subscription = await Subscription.findOne({
        where: {
            spaceId: req.body.spaceId,
            userId: req.body.userId,
        }
    });
    if (!subscription || !subscription.subscribed) {
        res.send({success: true, message: "not subscribed"});
    } else {
        await Subscription.update({subscription: false});
        res.send({success: true});
    }
}));

module.exports = router
