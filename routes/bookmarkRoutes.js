const express = require('express');
const router = express.Router();

const Bookmark = require('../models/Bookmark');
const authMiddleware = require('../middleware/auth');

//users create a bookmark and this way is protected by making it for the user thats logged in
