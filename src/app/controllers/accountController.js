const express = require('express');
const authMiddleware = require('../middlewares/auth')
const bcrypt = require('bcryptjs');

const User = require('../models/user');

const router = express.Router();

router.use(authMiddleware);

router.get('/:id', async (req, res) => {
    
    const user = await User.findById(req.params.id);

    if(!user)
        return res.status(400).send({ error: 'User not found'}); 

    user.email = undefined;
    user.password = undefined;
    user.createdAt = undefined;
    

    res.send({ 
        user 
    });    
});
module.exports = app => app.use('/users', router);