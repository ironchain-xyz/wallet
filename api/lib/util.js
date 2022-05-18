const CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

function randomCode(length) {
    let code = '';
    var len = CHARS.length;
    for (let i = 0; i < length; i++ ) {
        code += CHARS[Math.floor(Math.random() * len)];
    }
    return code;
}

module.exports = {
    randomCode
}
