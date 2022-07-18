require('dotenv').config();

const router = require("express").Router();
const asyncHandler = require('express-async-handler');

const db = require("../models");
const User = db.users;
const Material = db.materials;
const Space = db.spaces;
const Subscription = db.subscriptions;
const QUERY_LIMIT = 20;

const sequelize = require('sequelize');
router.get('/all', asyncHandler(async (req, res) => {
    const query = {
        order: [["id", "ASC"]],
        limit: QUERY_LIMIT,
    }
    if (req.query.startId) {
        query["where"] = { id: { [sequelize.Op.gt]: req.query.startId } }
    }
    const spaces = await Space.findAll(query, {
        include: [
            {
                model: User,
                as: "spaceCreator"
            },
            {
                model: Material,
                required: false,
            },
        ]
    });
    res.send({spaces, limit: QUERY_LIMIT});
}));

router.get('/:id/materials', asyncHandler(async (req, res) => {
    const query = {spaceId: req.params.id};
    if (req.query.startId) {
        query["id"] = { [sequelize.Op.lt]: req.query.startId };
    }
    const materials = await Material.findAll({
        where: query,
        order: [["id", "DESC"]],
        limit: QUERY_LIMIT,
    }, {
        include: [
            {
                model: User,
                as: "materialCreator",
                attributes: ["username"]
            },
        ]
    });
    res.send({materials, limit: QUERY_LIMIT});
}));

router.get('/:id', asyncHandler(async (req, res) => {
    const space = await Space.findByPk(
        req.params.id,
        {
            attributes: {
                include: [
                    [
                        sequelize.fn('COUNT', sequelize.col('subscriptions.userId')),
                        'totalSubscribers'
                    ]
                ]
            },
            include: [
                {
                    model: Subscription,
                    where: {subscribed: true, spaceId: req.params.id},
                    attributes: [],
                    required: false
                },
                {
                    model: User,
                    as: "spaceCreator",
                    attributes: ["username"]
                }
            ],
            group: ["spaces.id", "spaceCreator.id"]
        }
    );
    res.send({space});
}));

router.post('/new', asyncHandler(async (req, res) => {
    let space = await Space.findOne({
        where: {name: req.body.name}
    });
    if (space) {
        res.status(400).send({error: `space already exists`});
    }

    space = await Space.create({
        name: req.body.name,
        description: req.body.description,
        createdBy: req.user.id,
        include: [
            { model: User, as: "spaceCreator", }
        ],
    });
    res.send({space});
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
