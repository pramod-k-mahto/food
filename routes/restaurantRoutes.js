
// File: routes/restaurantRoutes.js
const express = require('express');
const router = express.Router();
const { Restaurant, MenuItem } = require('../Model/model');

router.post('/', async (req, res) => {
  try {
    const restaurant = new Restaurant(req.body);
    await restaurant.save();
    res.status(201).send({ restaurant });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get('/', async (req, res) => {
  try {
    const restaurants = await Restaurant.find({});
    res.send(restaurants);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post('/:restaurantId/menu-items', async (req, res) => {
  try {
    const menuItem = new MenuItem({
      ...req.body,
      restaurant: req.params.restaurantId
    });
    await menuItem.save();
    await Restaurant.findByIdAndUpdate(req.params.restaurantId, { $push: { menu_items: menuItem._id } });
    res.status(201).send({ menuItem });
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
