// routers/Cart.router.js
const express = require('express');
const cartController = require('../public/cartController');

const router = express.Router();

// GET current cart
router.get('/', cartController.getCart);

// Add item to cart
router.post('/', cartController.addToCart);

// Checkout (apply discount + clear)
router.post('/checkout', cartController.checkout);

module.exports = router;
