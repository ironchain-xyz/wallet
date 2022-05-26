require('dotenv').config();

const CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const { ethers } = require("ethers");

function randomCode(length) {
    let code = '';
    var len = CHARS.length;
    for (let i = 0; i < length; i++ ) {
        code += CHARS[Math.floor(Math.random() * len)];
    }
    return code;
}

function genAddress(email) {
    const normalized = email.trim().toLowerCase();
    const node = utils.keccak256(utils.toUtf8Bytes(normalized));
    const nsAddr = ethers.utils.getAddress(process.env.NS_ADDRESS);
    const FUNC_HASH = utils.keccak256(utils.toUtf8Bytes("eip4972.addressOfName"));
    return ethers.utils.defaultAbiCoder.encode(
        ['uint8', 'uint8[]', 'address', 'uint8[]'],
        [
            0xff,
            ethers.utils.arrayify(FUNC_HASH),
            nsAddr,
            ethers.utils.arrayify(node),
        ]
    );
}

module.exports = {
    randomCode,
    genAddress
}
