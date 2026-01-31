const express = require('express');
const User = require('../models/User');
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

// Get User Profile
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        const posts = await Post.find({ user: req.params.id }).sort({ createdAt: -1 });
        res.json({ user, posts });
    } catch (err) {
        res.status(500).json(err);
    }
});

// Follow/Unfollow User
router.put('/:id/follow', verifyToken, async (req, res) => {
    if (req.user.id !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.user.id);

            if (!user.followers.includes(req.user.id)) {
                await user.updateOne({ $push: { followers: req.user.id } });
                await currentUser.updateOne({ $push: { following: req.params.id } });
                res.status(200).json("User has been followed");
            } else {
                await user.updateOne({ $pull: { followers: req.user.id } });
                await currentUser.updateOne({ $pull: { following: req.params.id } });
                res.status(200).json("User has been unfollowed");
            }
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("You cannot follow yourself");
    }
});

module.exports = router;
