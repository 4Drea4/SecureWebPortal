const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const passport = require('passport');

//api users register
router.post('/register', async (req, 
    res) =>{
        console.log('HEADERS:', req.headers['content-type']);
        console.log('Login', req.body);
    try{
        const {username, email,password} = req.body;

        //validate
        if(!username || !email || !password) {
            return res.status(400).json({message: 'Missing some login credentials, take a second look'});
        }

        //does email exist
        const userExists = await User.findOne({email});
        if (userExists) {
            return res.status(400).json({message: 'Looks like that email has already been taken' });
        }
        const newUser = await User.create({username, email, password});

        res.status(201).json(newUser);
        } catch (error) {
            res.status(400).json({
                message: "Uh oh Something went wrong creating this user. ",
                error: error.message,
            });
        }
});



// testing route
// router.get('/ping', (req,res) =>{
//     res.json({message: 'user routes are running'});
// });

//post api users login

router.post('/login', async (req,res) => {
   
    try{
        console.log('LOGIN BODY:', req.body);
        const {email, password} = req.body ;

        if(!email || !password) {
            return res.status(400).json({message: 'Looks like something is missing double check'});
        }
        const user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({message: 'This email or password is incorrect'});
        }

        const correctPw = await user.isCorrectPassword(password);
        if (!correctPw) {
            return res.status(400).json({message: 'The email or password is incorrect'});
        }
        //payload
        const payload = {
            _id: user._id,
            username: user.username,
            email: user.email,
        };
         
        const token = jwt.sign(
            {data:payload},
            process.env.JWT_SECRET,
            {expiresIn: '3h'}
        );

        res.json({token, user});
    }catch (error) {
        res.status(500).json({
            message: 'Login failed',
            error: error.message,
        });
    }
});

//middleware
const authMiddleware = require('../utils/auth');
router.get('/me',  authMiddleware, (req, res) => {
    res.json({
        message: 'malcom in the middlerware',
        user: req.user
    });
});

//Github oauth

    router.get(
        '/auth/github',
        passport.authenticate('github', {scope: ['user:email']})
    );

    //Sharpay evans says callbacks
    router.get(
        '/auth/github/callback',
        passport.authenticate('github', {session:false}),
        (req,res) => {
            res.json({
                message:'github login successful',
                user: req.user,
            });
        }
    );
module.exports= router;