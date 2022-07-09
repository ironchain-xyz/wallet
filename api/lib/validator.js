function isValidUsername(username) {
    return validator.matches(username, "^(?!\d)(?!.*-.*-)(?!.*-$)(?!-)[a-zA-Z0-9-]{3,20}$");
}
function validateProfileUpdate(update) {
    if (update.username && !isValidUsername(update.username)) {
        return {ok: false, msg: "invalid username"};
    }
    return {
        ok: true,
        update: {username: update.username}
    }
}

module.exports = {
    isValidUsername,
    validateProfileUpdate,
}
