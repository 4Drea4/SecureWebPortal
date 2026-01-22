require ('dotenv').config();
const passport = require('passport');
const express = require('express');
const connectDB = require('./config/connection');
require('./config/passport'); 
const bookmarkRoutes = require('./routes/bookmarkRoutes');
const userRoutes = require('./routes/userRoutes');
const app = express();
const PORT = process.env.PORT || 3001;
