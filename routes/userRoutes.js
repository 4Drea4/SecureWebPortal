const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

//api users register
router.post('/register', async (req, res) =>{
    try{
        const {username, email,password} = req.body;

        //validate
        if(!username || !email || !password) {
            return res.status(400).json({message: 'Missing some login credentials, take a second look'});
        }

        //does email exist
        const userExists = await User.findThem({email});
        if (userExists) {
            return res.status(400).json({message: 'Looks like that username has already been taken' });
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

module.exports= router;