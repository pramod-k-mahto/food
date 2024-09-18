
// File: routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { User, ActivityFeed } = require('../Model/model');

router.post('/register', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send({ user });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post('/login', async (req, res) => {
  // Implement login logic here
});

router.get('/:userId/activity', async (req, res) => {
  try {
    const activities = await ActivityFeed.find({ user: req.params.userId })
      .sort({ timestamp: -1 })
      .populate('item')
      .limit(20);
    res.send(activities);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post('/:userId/follow/:followedId', async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.userId, { $addToSet: { following: req.params.followedId } });
    await User.findByIdAndUpdate(req.params.followedId, { $addToSet: { followers: req.params.userId } });
    res.send({ message: 'Successfully followed user' });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
