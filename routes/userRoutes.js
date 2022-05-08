const router = require('express').Router()
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User')
const authMiddleware = require('../middlewares/auth')

const authConfig = require('../config/auth')

function generateToken(params = {}){
    return jwt.sign(params, authConfig.secret, {
    expiresIn: 315360000,
});
}



router.post('/authenticate', async (req, res) => {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email }).select('+password');

    if(!user)
        return res.status(400).send({ error: 'User not found'});

    if(!await bcrypt.compare(password, user.password))
        return res.status(400).send({ error: 'Invalid password'}); 
    
    user.password = undefined;

    res.send({ 
        user, 
        token: generateToken({ id: user.id })
    });    
});

router.use('/authenticated', authMiddleware);

router.patch('/authenticated/start_session', async (req, res) => {

    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');

    if(!user)
    return res.status(400).send({ error: 'User not found'});

    if(!await bcrypt.compare(password, user.password))
    return res.status(400).send({ error: 'Invalid password'}); 

    const authHeader = req.headers.authorization;
    const parts = authHeader.split(' ');
    const [ scheme, token ] = parts;

    const user_update = { 
        token
    }

    user.password = undefined;

    try {
        const updateUser = await User.updateOne({_id: user.id}, user_update)
        if (updateUser.matchedCount === 0){
            res.status(422).json({message: 'User not found'})
            return
        }
        
        res.status(200).json(user)
    } catch (error) {
        return res.status(500).send({ error: error });
    }    
}) 

router.post('/authenticated/register', async (req, res) => {
    const { email } = req.body


    try {
        if (await User.findOne({ email }))
            return res.status(400).send({ error: 'User already exists' })

        const authHeader = req.headers.authorization;
        const parts = authHeader.split(' ');
        const [ scheme, token ] = parts;

        admin = await User.findOne({ token })

        if (!(admin.name === 'zedsousa'))
            return res.status(401).send({ error: 'You are not allowed to create users'}); 

        const user = await User.create(req.body);
        user.password = undefined;

        return res.send({ 
            user, 
        });
    } catch (err){
        return res.status(400).send({ error: 'Registration failed'});
    }
})

router.post('/authenticated/get_info', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');

    if(!user)
        return res.status(400).send({ error: 'User not found'});

    if(!await bcrypt.compare(password, user.password))
        return res.status(400).send({ error: 'Invalid password'}); 

    const authHeader = req.headers.authorization;
    const parts = authHeader.split(' ');
    const [ scheme, token ] = parts;

    if (!(token === user.token))
        return res.status(401).send({ error: 'Session expired'}); 
    
    
    user.password = undefined;

    try {
        const user2 = await User.findOne({_id: user.id})
        res.status(200).json(user2)
     
            
    } catch (error) {
        return res.status(400).send({ error: 'User not found'});
    }    
}) 



module.exports = router