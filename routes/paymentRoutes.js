const express = require('express');
const router = express.Router();
const paypalService = require('../utils/paypalService');
const Order = require('../models/order');
const User = require('../models/user');
const { createInvoicePDF } = require('../utils/pdfServices'); 
const { sendEmailWithInvoice } = require('../utils/emailServices'); 

router.post('/create-order', async (req, res) => {
  const { totalAmount } = req.body;

  try {
    const order = await paypalService.createOrder(totalAmount);
    res.json({ id: order.id });
  } catch (error) {
    console.error(error);
    res.status(500).send('Something went wrong');
  }
});

router.post('/complete-payment', async (req, res) => {
  try {
    const { data, orderId } = req.body;
    const order = await Order.findById(orderId).populate('items.productId', 'name price');
    if (!order) {
      return res.status(404).send('Order not found');
    }

    order.paymentStatus = 'completed';
    order.status = 'delivered';
    order.paymentMethod = 'paypal';
    await order.save();

    const userId = order.user;
    const user = await User.findById(userId);
    const userEmail = user.email;
    const pdfPath = createInvoicePDF(order, userEmail);

    await sendEmailWithInvoice(userEmail, pdfPath);

    res.json({ message: 'Payment completed and invoice sent' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Something went wrong');
  }
});

module.exports = router;
