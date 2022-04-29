const express = require('express');
const authMiddleware = require('../middlewares/auth')

const User = require('../models/user');

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
    try{
        const users = await User.find();

        return res.send({ users });


    } catch (err) {
        return res.status(400).send({ error: 'Error loading users'})
    }
});

router.get('/:userId', async (req, res) => {
    try{
        const user = await User.findById(req.params.userId);

        return res.send({ user });


    } catch (err) {
        return res.status(400).send({ error: 'Error loading user'})
    }
});

router.get('/myInfo', async (req, res) => {
    try{
        const user = await User.findById(req.params.userId);

        return res.send({ user });


    } catch (err) {
        return res.status(400).send({ error: 'Error loading user'})
    }
});

module.exports = app => app.use('/users', router);