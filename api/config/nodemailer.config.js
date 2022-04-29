const nodemailer = require("nodemailer");
const config = require("../email.config");

const sender = process.env.EMAIL_SENDER;
const pass = process.env.EMAIL_PASS;

const transport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: sender,
        pass: pass,
    },
});

async function sendMail(receipt, passcode) {
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
    };
};

module.exports.sendPassCode = async (email, passcode) => {
    return await sendMail(email, passcode);
};
