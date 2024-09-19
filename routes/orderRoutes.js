const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authenticate = require('../middlewares/authenticate');

router.get('/', authenticate, orderController.getAllOrders);

router.get('/:id', authenticate, orderController.getOrderById);

router.post('/', authenticate, orderController.createOrder);

module.exports = router;