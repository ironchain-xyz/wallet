require('dotenv').config();

const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken');
const validator = require('validator');
const nodemailer = require("../config/nodemailer.config.js");
const time = require("../lib/time.js");
const { randomCode } = require("../lib/util.js");

const OTP_LEN = 6;
const db = require("../models");
const User = db.users;
const Invitations = db.invitations;

const secret = process.env.TOKEN_SECRET;
const ACCESS_TOKEN_LIFETIME = parseInt(process.env.ACCESS_TOKEN_LIFETIME);

const USER_WHITELIST = ['dongs2011@gmail.com', 'ironchaindao@gmail.com'];

async function genOTP(email, mocked=true) {
    if (mocked) {
        OTP = "123456";
    } else {
        await nodemailer.sendPasscode(email, randomCode(OTP_LEN));
    }
    return {value: OTP, sentAt: time.epoch()};
}

function genRefreshToken(email) {
    return jwt.sign({email, createdAt: time.epoch()}, secret);
}

function genAccessToken(refreshToken) {
    return jwt.sign({refreshToken, createdAt: time.epoch()}, secret);
}

function parseOTP(user) {
    return user.emailOtp ? JSON.parse(user.emailOtp) : {};
}

function validateEmail(req, res, next) {
    const email = req.body.email;
    if (!email || !validator.isEmail(email)) {
        return res.status(400).send({message: "Invalid email!"});
    }
    next();
}

function validateAccessToken(req, res, next) {
    const accessToken = req.headers["x-access-token"];
    if (!accessToken) {
        return res.status(400).send({
            message: "access or refresh token missing"
        });
    }
    try {
        const {refreshToken, createdAt} = jwt.verify(accessToken, secret);
        if(time.epoch() - createdAt < ACCESS_TOKEN_LIFETIME) {
            res.status(400).send({message: "no need to refresh"});
        } else {
            const {email} = jwt.verify(refreshToken, secret);
            req.email = email;
            req.refreshToken = refreshToken;
            next();
        }
    } catch (err) {
        res.status(400).send({message: "invalid access token"});
    };
}

module.exports = async app => {
    var router = require("express").Router();

    router.post("/register", validateEmail, asyncHandler(async (req, res) => {
        const email = req.body.email;
        const user = await User.findByPk(email);
        if (user) {
            return res.status(400).send({message: 'user already registerd'});
        }

        const invitationCode = req.body.invitationCode;
        const invitation = await Invitations.findByPk(invitationCode);
        if (!invitation) {
            return res.status(400).send({message: 'invalid invitation code'});
        } else if (invitation.usedBy) {
            return res.status(400).send({message: 'invitation code has been used'});
        }

        await User.create({email});
        await invitation.update({usedBy: email});
        return res.send({ok: true});
    }));

    // generate and send one time passcode
    router.post("/passcode", validateEmail, asyncHandler(async (req, res) => {
        const email = req.body.email;
        let user = await User.findByPk(email);
        if (!user) {
            if (USER_WHITELIST.includes(email)) {
                await User.create({email});
                user = await User.findByPk(email);
            } else {
                return res.status(400).send({message: 'user not registerd'});
            }
        }

        const existingOTP = parseOTP(user);
        if (existingOTP.sentAt) {
            const sentAfter = time.epoch() - existingOTP.sentAt;
            if (sentAfter < 60) {
                return res.send({
                    ok: true,
                    sentAt: existingOTP.sentAt,
                    existingOTP: true
                });
            }
        }

        const newOTP = await genOTP(email);
        await user.update({emailOtp: JSON.stringify(newOTP)});
        res.send({ok: true, sentAt: newOTP.sentAt});
    }));

    // verify passcode
    router.post("/verify", validateEmail, asyncHandler(async (req, res) => {
        const user = await User.findByPk(req.body.email);
        if (!user) {
            return res.status(400).send({message: "email not found"});
        }

        const otp = parseOTP(user);
        if (otp.value != req.body.passcode) {
            res.status(400).send({message: "Wrong passcode"});
        } else if (otp.expiryTime < time.epoch()) {
            res.status(400).send({message: "Expired passcode"});
        } else {
            const refreshToken = genRefreshToken(user.email);
            const userUpdate = user.status == "verified"
                ? {refreshToken, emailOtp: ""}
                : {refreshToken, emailOtp: "", status: "verified"};
            await user.update(userUpdate);
            const accessToken = genAccessToken(refreshToken);
            res.json({
                email: user.email,
                username: user.username,
                jwt: {
                    refreshToken,
                    accessToken
                },
            });
        }
    }));

    router.post("/refresh", validateAccessToken, asyncHandler(async (req, res) => {
        const user = await User.findByPk(
            req.email,
            {attributes: ["refreshToken"]}
        );
        if (!user || user.refreshToken != req.refreshToken) {
            return res.status(400).send({message: "invalid refresh token"});
        }
        res.send({ok: true, accessToken: genAccessToken(req.refreshToken)});
    }));

    app.use('/api/auth/', router);
};
