'use strict';

const express = require('express');
const router = express.Router();
const { User } = require('../config/objection');
const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');

const bcrypt = require('bcryptjs');
const saltRounds = 10;

const schema = Joi.object({
    uuid: Joi.string().guid({version:['uuidv4']}),
    firstname: Joi.string().min(3).max(24).required(),
    lastname: Joi.string().min(3).max(24).required(),
    password: Joi.string().min(6).max(60)
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    email: Joi.string()
        .email({ minDomainSegments: 2 })
});

router.get('/', async (req, res, next) => {

    let users;

    try {
        users = await User.query();

        for (const user of users) {
            user.password="********";
        }

        return res.json({ users });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: `Can't get users` });
    }

});

router.get('/:uuid', async (req, res, next) => {

    if(!req.params.uuid) return res.json({error:`Can't get user, UUID param is missing in URL`});

    let the_user;

    try {
        the_user = await User.query().findOne({uuid:req.params.uuid.toLowerCase()});
        the_user.password="********";
        return res.json({ user:the_user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: `Can't get user` });
    }

});

router.put('/:uuid', async (req, res, next) => {

    if(!req.params.uuid) return res.json({error:`Can't get user, UUID param is missing in URL`});

    let the_user;
    const values = req.body;

    try {
        the_user = await User.query().findOne({uuid:req.params.uuid.toLowerCase()});
        the_user.password = "********";
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: `Can't get user` });
    }

    try {
        await User.query().update(values).where({uuid:req.params.uuid.toLowerCase()});
        const merged_data = Object.assign(the_user,req.body);
        return res.json({ message:`User with uuid ${req.params.uuid} has been updated`, user: merged_data });
    } catch (error) {
        console.error(error);
        if (error.constraint === "email_unique") return res.status(409).json({ error: `Can't update user. User with email ${req.body.email} already exist` });
        else return res.status(500).json({ error: `Can't update user with uuid ${req.params.uuid}` });
    }

});

router.delete('/:uuid', async (req, res, next) => {

    if(!req.params.uuid) return res.json({error:`Can't delete user, UUID param is missing in URL`});

    let the_user;

    try {
        await User.delete().where({uuid:req.params.uuid.toLowerCase()});
        return res.status(204).json({ message:`User with uuid ${req.params.uuid} has been deleted` });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: `Can't delete user with uuid ${req.params.uuid}` });
    }

});

router.post('/', async (req, res, next) => {
    const data = req.body;

    /*generate hash from password*/
    const password = req.body.password.trim();

    let salt, hash;

    try {
        salt = await bcrypt.genSalt(saltRounds);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: `Can't add user` });
    }

    try {
        await schema.validateAsync(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: `Can't add user` });
    }

    try {
        hash = await bcrypt.hash(password, salt);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: `Can't add user` });
    }

    data.password = hash;
    /*end generate hash*/

    data.uuid = uuidv4();

    let new_user;

    try {
        new_user = await User.query().insert(data);
        return res.status(201).json({ user:new_user });
    } catch (error) {
        if (error.constraint === "email_unique") return res.status(409).json({ error: `Can't add user. User with email ${data.email} already exist` });
        else return res.status(500).json({ error: `Can't add user` });
    }

});

module.exports = router;
