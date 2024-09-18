
// File: routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const { Chat } = require('../Model/model');


router.post('/', async (req, res) => {
  try {
    const chat = new Chat(req.body);
    await chat.save();
    res.status(201).send({ chat });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get('/:userId/:restaurantId', async (req, res) => {
  try {
    const chats = await Chat.find({
      user: req.params.userId,
      restaurant: req.params.restaurantId
    }).sort({ timestamp: 1 });
    res.send(chats);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
