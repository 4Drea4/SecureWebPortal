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
router.get('/:id',  authMiddleware, async (req,res) => {
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
//update
router.put('/:id', authMiddleware, async (req,res) => {
    try {
        const updated = await Bookmark.findOneAndUpdate(
            {
                _id: req.params.id, user: req.user._id
            },
            req.body,
            { new:true}
        );
        if (!updated) {
            return res.status(404).json({message: 'Boomark can not be found'});
        }
        res.json(updated);
    } catch (error) {
        res.status(400).json({message: 'Uh-oh Could not update this bookmark'});
    }
});
//delete
    router.delete('/:id' , authMiddleware, async (req, res) => {
        try{
            const deleted = await Bookmark.findOneAndDelete({
                _id: req.params.id,
                user: req.user._id
            });
            if (!deleted){
                return res.status(404).json({message: 'Can not find Bookmark'});
            }
            res.json({message: 'This bookmark has been deleted'});
        } catch (error) {
            res.status(400).json({message: 'Could not delete the bookmark'});
        }
    });


module.exports = router;