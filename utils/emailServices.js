const nodemailer = require('nodemailer');
const EMAIL = process.env.EMAIL;
const PASSWORD = process.env.PASSWORD;
const fs = require('fs');

const sendEmailWithInvoice = async (email, pdfPath) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: EMAIL,
      pass: PASSWORD,
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

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully to', email);
  } catch (error) {
    console.error('Error sending email:', error);
  } finally {
    fs.unlink(pdfPath, (err) => {
      if (err) {
        console.error('Error deleting invoice PDF:', err);
      } else {
        console.log('Invoice PDF deleted:', pdfPath);
      }
    });
  }
};

module.exports = { sendEmailWithInvoice };
