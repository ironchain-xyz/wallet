require('dotenv').config();

const validator = require('validator');
const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken');

const { nanoid } = require('nanoid');

const db = require("../models");
const User = db.users;
const Invitations = db.invitations;

const secret = process.env.TOKEN_SECRET;
const INVITATION_CODE_PER_USER = 3;

function isValidUserName(username) {
    return validator.matches(username, "^(?!\d)(?!.*-.*-)(?!.*-$)(?!-)[a-zA-Z0-9-]{3,20}$");
}

async function genInvitationCode(referredBy) {
    const code = await nanoid();
    const invitation = await Invitations.findByPk(code);
    if (invitation) {
        return genInvitationCode(referredBy);
    } else {
        await Invitations.create({code, referredBy});
        return code;
    }
}

module.exports = async app => {
    var router = require("express").Router();

    router.use(asyncHandler(async (req, res, next) => {
        const accessToken = req.headers["x-access-token"];
        if (accessToken) {
            try {
                const {refreshToken} = await jwt.verify(accessToken, secret);
                const {email} = jwt.verify(refreshToken, secret)
                req.user = {email};
                next();
            } catch (err) {
                res.status(401).send({
                    message: "Invalid access Token"
                });
            }
        } else {
            res.status(403).send({
                message: "Access token is required"
            });
        }
    }));

    router.post('/profile/init', asyncHandler(async (req, res) => {
        const username = req.body.username;
        if (!isValidUserName(username)) {
            console.log(username);
            res.status(400).send({
                message: "Invalid username!"
            });
        } else if (await User.findOne({where: {username}})) {
            res.status(400).send({
                message: "Username already used!"
            });
        } else {
            const user = await User.findByPk(req.user.email);
            await user.update({username});
            res.send({ok: true});
        }
    }));

    router.post('/invitationCode', asyncHandler(async (req,res) => {
        const email = req.body.user.email;
        const invitations = await Invitations.findAll(
            {where: {referredBy: req.body.user.email}}
        );
        if (invitations.length == 0) {
            const promises = [];
            for (let i = 0; i < INVITATION_CODE_PER_USER; i++) {
                promises.push(genInvitationCode(email));
            }
            const codes = await Promise.all(promises);
            res.send({codes: codes.map(c => {code: c})});
        } else {
            const codes = invitations.map(i => ({
                code: i.code, used: !!i.usedBy
            }));
            res.send({codes: codes});
        }
    }));

    router.post('/logout', asyncHandler(async (req,res) => {
        const user = await User.findByPk(req.body.user.email);
        await user.update({refreshToken: ""});
        res.send({ok: true});
    }));

    app.use('/api/', router);
};
