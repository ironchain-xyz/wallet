require('dotenv').config();

const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken');

const db = require("../models");
const User = db.users;
const secret = process.env.TOKEN_SECRET;

function isValidUserName(username) {
  return validator.matches(username, "^[a-zA-Z0-9_\.\-]*$");
}

module.exports = async app => {
    var router = require("express").Router();

    router.use(asyncHandler(async (req, res, next) => {
        const accessToken = req.headers["x-access-token"];
        if (accessToken) {
            try {
                const {refreshToken} = await jwt.verify(accessToken, secret);
                const email = jwt.verify(refreshToken, secret)
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

    router.post('/setusername', asyncHandler(async (req, res) => {
        const username = req.body.user.username;
        if (!isValidUserName(username)) {
            res.status(400).send({
                message: "Invalid username!"
            });
        } else if (await User.findByOne(username)) {
            res.status(400).send({
                message: "Username already used!"
            });
        } else {
            const user = await User.findByPk(req.user.email);
            const userUpdate = user.status == 'initiated'
                ? {username}
                : {username, status: "initiated"}
            await user.update({username});
            res.send({ok: true});
        }
    }));


    router.post('/logout', asyncHandler(async (req,res) => {
        const user = await User.findByPk(req.body.user.email);
        await user.update({refreshToken: ""});
        res.send({ok: true});
    }));

    app.use('/api/user/', router);
};
