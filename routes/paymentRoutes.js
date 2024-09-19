const express = require('express');
const router = express.Router();
const paypalService = require('../utils/paypalService');
const Order = require('../models/order');
const User = require('../models/user');
const PDFDocument = require('pdfkit');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const EMAIL = process.env.EMAIL;
const PASSWORD = process.env.PASSWORD;

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
  
      // Find the order by ID
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).send('Order not found');
      }
  
      // Update order status and payment details
      order.paymentStatus = 'completed';
      order.status = 'delivered';
      order.paymentMethod = 'paypal';
  
      // Save the updated order
      await order.save();
      
      const userId = order.user;
      const user = await User.findById(userId);
      const userEmail = user.email;
      const pdfPath = createInvoicePDF(order, userEmail);
  
      // Send email with PDF invoice
      await sendEmailWithInvoice(userEmail, pdfPath);
  
      res.json({ message: 'Payment completed and invoice sent' });
    } catch (error) {
      console.error(error);
      res.status(500).send('Something went wrong');
    }
  });

const createInvoicePDF = (order, userEmail) => {
    const pdfPath = path.join(__dirname, `../invoices/${order._id}.pdf`);
    const doc = new PDFDocument();
    const invoiceStream = fs.createWriteStream(pdfPath);
  
    doc.pipe(invoiceStream);
  
    // Add PDF content
    doc.fontSize(20).text('Invoice', { align: 'center' });
    doc.text(`Order ID: ${order._id}`);
    doc.text(`User Email: ${userEmail}`);
    doc.text(`Total Amount: ₹${order.total}`);
    doc.text(`Payment Status: ${order.paymentStatus}`);
    doc.text(`Shipping Address: ${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state}, ${order.shippingAddress.country}, Pincode: ${order.shippingAddress.pincode}`);
  
    // List items in the order
    doc.text('Items:', { underline: true });
    order.items.forEach((item, index) => {
      doc.text(`Product ID: ${item.productId}, Quantity: ${item.quantity}`);
    });
  
    doc.text(`Payment Method: ${order.paymentMethod}`);
    doc.text(`Order Status: ${order.status}`);
    doc.text(`Created At: ${order.createdAt}`);
    doc.text(`Updated At: ${order.updatedAt}`);
  
    // Finalize PDF
    doc.end();
  
    return pdfPath;
  };
  
  // Function to send email with PDF invoice
  const sendEmailWithInvoice = async (email, pdfPath) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL,  // Use your email
        pass: PASSWORD,   // Use your email password
      },
    });
  
    const mailOptions = {
      from: EMAIL,
      to: email,
      subject: 'Your Order Invoice',
      text: 'Thank you for your purchase. Please find attached the invoice for your order.',
      attachments: [
        {
          filename: 'invoice.pdf',
          path: pdfPath,
          contentType: 'application/pdf',
        },
      ],
    };
  
    await transporter.sendMail(mailOptions);
  };

module.exports = router;
