const express = require('express');
const router = express.Router();

const Bookmark = require('../models/Bookmark');
const authMiddleware = require('../middleware/auth');

//users create a bookmark and this way is protected by making it for the user thats logged in
router.post ('/', authMiddleware, async (req, res) =>{
    try {
        const {title, url, note } = req.body;
        if (!title) {
            return res.status(400).json({message : 'Title is required'});
        }
        //from the jwt 
        const newBookmark = await Bookmark.create({
            title,
            url,
            note,
            user:req.user._id, 
        });
        res.status(201).json(newBookmark);
    } catch (error) {
        res.status(400).json({message: "Uh Oh your bookmark could not be created", error : error.message})
    }
});
