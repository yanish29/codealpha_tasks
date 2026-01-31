const express = require('express');
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const jwt = require('jsonwebtoken');

const router = express.Router();

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).send('A token is required for authentication');
    try {
        const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
        req.user = decoded;
    } catch (err) {
        return res.status(401).send('Invalid Token');
    }
    return next();
};

// Add Comment
router.post('/:postId', verifyToken, async (req, res) => {
    try {
        const newComment = new Comment({
            user: req.user.id,
            post: req.params.postId,
            content: req.body.content
        });
        await newComment.save();

        // Optionally Populate user to return fully formed comment for frontend
        await newComment.populate('user', 'username');

        res.status(201).json(newComment);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Get Comments for a Post
router.get('/:postId', async (req, res) => {
    try {
        const comments = await Comment.find({ post: req.params.postId }).populate('user', 'username').sort({ createdAt: -1 });
        res.json(comments);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
