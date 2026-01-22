const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({

    username:{
        type: String,
        required: true,
        trim:true
    },

    email:{
        type: String,
        required:true,
        unique: true,
        match: [/.+@.+\..+/, 'Uh oh this is not a valid email']
    },

    //password optional
    password:{
        type:String,
        minlength: 8
    },

    //github oauth folks
    githubId:{
        type:String
    }
});