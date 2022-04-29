const time = require("../lib/time.js");
const nodemailer = require("../config/nodemailer.config.js");
const validator = require('validator');

const CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const OTP_LEN = 6;
const db = require("../models");
const User = db.users;

function generateOTP() {
    let OTP = '';
    var len = string.length;
    for (let i = 0; i < OTP_LEN; i++ ) {
        OTP += CHARS[Math.floor(Math.random() * len)];
    }
    return OTP;
}

module.exports = async app => {
    var router = require("express").Router();

    // generate and send one time passcode
    router.post("/passcode", (req, res) => {
        const email = req.body.email.trim().toLowerCase();
        if (!email || !validator.isEmail(email)) {
            return res.status(400).send({
                message: "Invalid email!"
            });
        }

        const emailObj = await User.findByPk(email);
        if (emailObj && emailObj.emailOtpExpiredAt > time.epoch()) {
            return res.status(400).send({
                message: "Passcode already sent, retry later!"
            });
        }

        const emailOtp = generateOTP();
        await nodemailer.sendPasscode(email, emailOtp);
        if (emailObj) {
            await emailObj.update({
                emailOtp,
                emailOtpExpiredAt: time.epoch() + 60
            });
        } else {
            await User.create({
                email,
                emailOtp,
                emailOtpExpiredAt: time.epoch() + 60
            });
        }
        res.send({success: true});
    });

    // verify passcode and login
    router.post("/verify", (req, res) => {
        const email = req.body.email.trim().toLowerCase();
        if (!email || !validator.isEmail(email)) {
            return res.status(400).send({
                message: "Invalid email!"
            });
        }

        const emailObj = await User.findByPk(email);
        if (emailObj) {
            if (emailObj.emailOtp != emailOtp) {
                res.status(400).send({message: "Wrong passcode"});
            } else if (emailObj.emailOtpExpiredAt < time.epoch()) {
                res.status(400).send({message: "Expired passcode"});
            } else {
                session = req.session;
                session.email = req.body.email;
                res.redirect('/');
            }
        } else {
            res.status(400).send({message: "email not found"});
        }
    });

    // logout
    router.get('/logout',(req,res) => {
        req.session.destroy();
        res.redirect('/');
    });

    app.use('/api/', router);
};
