require('dotenv').config();
const router = require("express").Router();

const validator = require('validator');
const asyncHandler = require('express-async-handler')

const { validateProfileUpdate } = require("../lib/validator.js");
const { nanoid } = require('nanoid');
const db = require("../models");
const User = db.users;
const Invitations = db.invitations;
const INVITATION_CODE_PER_USER = 3;

async function genInvitationCode(createdBy) {
    const code = await nanoid();
    const invitation = await Invitations.findByPk(code);
    if (invitation) {
        return genInvitationCode(createdBy);
    } else {
        await Invitations.create({
            code,
            createdBy
        }, {
            include: {
                model: User,
                as: "beneficiary"
            }
        });
        return code;
    }
}

router.post('/update', asyncHandler(async (req, res) => {
    const validate = await validateProfileUpdate(req.body);
    if (validate.ok) {
        const user = await User.findByPk(req.user.id);
        await user.update(validate.update);
        return res.send({ok: true});
    } else {
        return res.status(400).send({message: validate.msg});
    }
}));

router.post('/invitationCode', asyncHandler(async (req,res) => {
    const createdBy = req.user.id;
    const invitations = await Invitations.findAll(
        {where: {createdBy}}
    );
    if (invitations.length == 0) {
        const promises = [];
        for (let i = 0; i < INVITATION_CODE_PER_USER; i++) {
            promises.push(genInvitationCode(createdBy));
        }
        const codes = await Promise.all(promises);
        res.send({codes: codes.map(c => ({code: c}))});
    } else {
        const codes = invitations.map(i => ({
            code: i.code, used: !!i.usedBy
        }));
        res.send({codes: codes});
    }
}));

router.post('/logout', asyncHandler(async (req,res) => {
    const user = await User.findByPk(req.user.id);
    await user.update({refreshToken: ""});
    res.send({ok: true});
}));

module.exports = router
