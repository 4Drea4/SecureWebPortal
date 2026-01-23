require ('dotenv').config();
const passport = require('passport');
const express = require('express');
const connectDB = require('./config/connection');
require('./config/passport'); 
const bookmarkRoutes = require('./routes/bookmarkRoutes');
const userRoutes = require('./routes/userRoutes');
const app = express();
const PORT = process.env.PORT || 3001;


//middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//middleware for passport
app.use(passport.initialize());

connectDB();

app.get('/', (req,res)=>{
    res.send('<h1>Secure Portal </h1>');
});

//my routes
app.use('/api/users', userRoutes);
app.use('/api/bookmarks', bookmarkRoutes);

app.listen(PORT, ()=> {
    console.log(`Server is running on ${PORT}`);
});

