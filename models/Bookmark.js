const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema(
    {
        title: {type:String, required: true},
        url: {type: String},
        note: { type: String},

        user: {type:mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    },
    {timestamps: true}
);

const Bookmark = mongoose.model('Bookmark', bookmarkSchema);
module.exports = Bookmark;
