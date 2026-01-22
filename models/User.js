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

//if password exists
userSchema.pre('save' ,async function () {
    
        //okay so if theres no pw skip the hash
        if(!this.password) return ;

        //this will hash if it is a new user or the password is new
        if (this.isNew || this.isModified('password')) {
            const saltRounds = 10;
            this.password = await bcrypt.hash(this.password, saltRounds);
        }
       
        });

        // compare the passwords with an instance
        userSchema.methods.isCorrectPassword = async function (regularpassword) {
            if(!this.password) return false;
            return bcrypt.compare(regularpassword, this.password);
        }

        const User = mongoose.model('User', userSchema);
        module.exports = User;
