require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function run(){
    try{
        await mongoose.connect (process.env.MONGO_URI);
        console.log('connected');

        const user = await User.create({
            username:'Mike Jones',
            email: 'thisismyemail@yada.com',
            password: 'strongpw'
        });
        console.log('savaed user:' ,user);
        const pwTest = await user.isCorrectPassword('strongpw');

        const pwTest2 = await user.isCorrectPassword('notmypassword');

        console.log('correct password',pwTest );

        console.log('wrong password,' , pwTest2);
        
        await mongoose.connection.close();
    
    } catch (error) {
        console.log('testing error', error.message);
    }
}

run();