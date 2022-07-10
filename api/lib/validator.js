const validator = require('validator');

function isValidUsername(username) {
    return validator.matches(username, "^(?!\d)(?!.*-.*-)(?!.*-$)(?!-)[a-zA-Z0-9-]{3,20}$");
}

function isValidEmail(email) {
    return validator.isEmail(email);
}

const db = require("../models");
const User = db.users;

async function validateProfileUpdate(update) {
    if (update.username) {
        if (!isValidUsername(update.username)) {
            return {ok: false, msg: "invalid username"};
        } else if (await User.findOne({where: {username: update.username}})) {
            return {ok: false, msg: "username already been used"};
        }
    }
    return {
        ok: true,
        update: {username: update.username}
    }
}

module.exports = {
    isValidEmail,
    isValidUsername,
    validateProfileUpdate,
}
