const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authenticate = require('../middlewares/authenticate');

router.get('/', authenticate, cartController.getCart);

router.post('/', authenticate, cartController.addToCart);

router.delete('/:id', authenticate, cartController.removeFromCart);

router.put('/', authenticate, cartController.updateCartItem);

module.exports = router;