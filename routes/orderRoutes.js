
// File: routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const { Order, ActivityFeed } = require('../Model/model');

router.post('/', async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    await ActivityFeed.create({
      user: order.user,
      activity_type: "order",
      item: order._id,
      item_type: "Order"
    });

    res.status(201).send({ order });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post('/:orderId/schedule', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    await order.schedulePreOrder(new Date(req.body.scheduledTime));
    res.send({ order });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get('/upcoming-preorders/:restaurantId', async (req, res) => {
  try {
    const preOrders = await Order.findUpcomingPreOrders(req.params.restaurantId);
    res.send(preOrders);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
