require('dotenv').config();

const nodemailer = require("nodemailer");

const sender = process.env.MAILGUN_USER;
const transport = nodemailer.createTransport({
    service: 'Mailgun',
    auth: {
        user: sender,
        pass: process.env.MAILGUN_PASS,
    }
});

module.exports.sendPasscode = async (receipt, passcode) => {
    return new Promise((resolve, reject)=>{
        transport.sendMail({
            from: sender,
            to: receipt,
            subject: "B23 Login",
            html: `<div>
                <p>
                    Your B23 authentication code is ${passcode}.
                    The code will expire in 10 mins after the code is sent.
                </p>
                </div>`,
        }, function(error, info){
            if (error) {
                reject(error);
            } else {
                resolve(true);
            }
        });
    });
};
