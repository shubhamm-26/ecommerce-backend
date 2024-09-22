const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const createInvoicePDF = (order, userEmail) => {
  const invoicesDir = path.join(__dirname, '../invoices');

  if (!fs.existsSync(invoicesDir)) {
    fs.mkdirSync(invoicesDir, { recursive: true });
  }

  const pdfPath = path.join(invoicesDir, `${order._id}.pdf`);
  const doc = new PDFDocument({ margin: 50 });
  const invoiceStream = fs.createWriteStream(pdfPath);

  doc.pipe(invoiceStream);

  doc.image('./utils/logo.jpg', 50, 45, { width: 100 })
    .fontSize(20)
    .text('Invoice', 200, 50, { align: 'right' })
    .moveDown();

  doc.fontSize(10).text(`Order ID: ${order._id}`, { align: 'right' });
  doc.text(`Date: ${new Date().toLocaleString()}`, { align: 'right' });
  doc.moveDown();

  doc.fontSize(12)
    .text(`Customer: ${userEmail}`, 50, 150)
    .text(`Shipping Address:`, 50, 170)
    .text(`${order.shippingAddress.street}, ${order.shippingAddress.city},`, 50, 185)
    .text(`${order.shippingAddress.state}, ${order.shippingAddress.country} - ${order.shippingAddress.pincode}`, 50, 200);

  doc.moveDown().moveDown();

  const tableTop = 250;
  doc.fontSize(12).text('Product', 50, tableTop);
  doc.text('Quantity', 300, tableTop, { width: 90, align: 'right' });
  doc.text('Price', 400, tableTop, { width: 90, align: 'right' });

  doc.moveTo(50, tableTop + 20)
    .lineTo(550, tableTop + 20)
    .stroke();

  let itemPosition = tableTop + 30;
  order.items.forEach((item) => {
    const price = item.productId.price || 0;
    doc.fontSize(10)
      .text(item.productId.name || 'Unknown Product', 50, itemPosition)
      .text(item.quantity || '1', 300, itemPosition, { width: 90, align: 'right' })
      .text(`$${price.toFixed(2)}`, 400, itemPosition, { width: 90, align: 'right' });

    itemPosition += 20;
  });

  const subtotalPosition = itemPosition + 20;
  doc.moveTo(50, subtotalPosition)
    .lineTo(550, subtotalPosition)
    .stroke();

  const total = order.total || 0;

  doc.text('Total', 300, subtotalPosition + 50, { width: 90, align: 'right' })
    .text(`$${total.toFixed(2)}`, 400, subtotalPosition + 50, { width: 90, align: 'right' });

  doc.moveDown().moveDown();
  doc.fontSize(10).text('Thank you for shopping with us!', 50, subtotalPosition + 100, { align: 'center' });

  doc.end();

  return pdfPath;
};

module.exports = { createInvoicePDF };
