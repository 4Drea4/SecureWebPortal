const express = require('express');
const router = express.Router();

const Bookmark = require('../models/Bookmark');
const authMiddleware = require('../middleware/auth');

//test cause i had broke something
// router.get('/ping', (req, res) => {
//     res.json({ message: 'bookmark routes alive' });
//   });
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

//bookmarks for the user that is logged in
router.get('/', authMiddleware, async (req,res) => {
    try{
        const bookmarks = await Bookmark.find({user: req.user._id}).sort({createdAt: -1});
        res.json(bookmarks);
    } catch (error) {
        res.status(500).json({message: 'Coult not get your bookmarks', error:error.message});
    }
    
});

//boomark that belongs to the user
router.get('/id',  authMiddleware, async (req,res) => {
    try{
        const bookmark = await Bookmark.findOne({
            _id: req.params.id,
            user: req.user._id
        });
            if (!bookmark) {
                return res.status(400).json({message:"Can't find bookmark"})
            }
            res.json(bookmark);
        } catch (error) {
            res.status(400).json({message: 'This bookmark ID isnt right!'});
        }

});
module.exports = router;