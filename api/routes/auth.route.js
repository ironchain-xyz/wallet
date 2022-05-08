require('dotenv').config();

const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken');
const validator = require('validator');
const nodemailer = require("../config/nodemailer.config.js");
const time = require("../lib/time.js");

const CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const OTP_LEN = 6;
const db = require("../models");
const User = db.users;

const secret = process.env.TOKEN_SECRET;
const ACCESS_TOKEN_LIFETIME = parseInt(process.env.ACCESS_TOKEN_LIFETIME);

async function genOTP(email, mocked=true) {
    if (mocked) {
        OTP = "12345";
    } else {
        let OTP = '';
        var len = CHARS.length;
        for (let i = 0; i < OTP_LEN; i++ ) {
            OTP += CHARS[Math.floor(Math.random() * len)];
        }
        await nodemailer.sendPasscode(email, OTP);
    }
    return JSON.stringify({
        expiryTime: time.epoch() + 600,
        value: OTP
    });
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
    const user = req.body.user;
    if (!user) {
        return res.status(400).send({message: "User not set!"});
    }
    if (!validator.isEmail(user.email)) {
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

    // register new account
    router.post("/register", validateEmail, asyncHandler(async (req, res) => {
        const email = req.body.user.email;
        const user = await User.findByPk(email);
        if (user) {
            if (user.status != "verifying") {
                return res.status(400).send({
                    message: "Email already verified!"
                });
            }
            const existingOTP = parseOTP(user);
            if (existingOTP.expiryTime > time.epoch()) {
                return res.status(400).send({
                    message: "Passcode already sent, retry later!"
                });
            }
        }
        await User.create({email, emailOtp: await genOTP(email)});
        res.send({ok: true});
    }));

    // generate and send one time passcode
    router.post("/passcode", validateEmail, asyncHandler(async (req, res) => {
        const email = req.body.user.email;
        const user = await User.findByPk(email);
        if (!user || user.status == "verifying") {
            return res.status(400).send({
                message: "Email not verified!"
            });
        }

        const existingOTP = parseOTP(user);
        if (existingOTP.expiryTime > time.epoch()) {
            return res.status(400).send({
                message: "Passcode already sent, retry later!"
            });
        }

        await user.update({emailOtp: await genOTP(email)});
        res.send({ok: true});
    }));

    // verify passcode and login
    router.post("/login", validateEmail, asyncHandler(async (req, res) => {
        const user = await User.findByPk(req.body.user.email);
        if (!user) {
            return res.status(400).send({message: "email not found"});
        }

        const otp = parseOTP(user);
        if (otp.value != req.body.user.passcode) {
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
                ok: true,
                refreshToken,
                accessToken,
                user: {email: user.email, username: user.username}
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
