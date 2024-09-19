const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const orderItemSchema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    }
});

const addressSchema = new Schema({
    street: {
        type: String,
        required: [true, 'Street is required!'],
        trim: true,
    },
    city: {
        type: String,
        required: [true, 'City is required!'],
        trim: true,
    },
    state: {
        type: String,
        required: [true, 'State is required!'],
        trim: true,
    },
    country: {
        type: String,
        required: [true, 'Country is required!'],
        trim: true,
    },
    pincode: {
        type: String,
        required: [true, 'Pincode is required!'],
        trim: true,
    }
});

const orderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    items: [orderItemSchema],
    total: {
        type: Number,
        required: true,
    },
    shippingAddress: {
        type: addressSchema,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'shipped', 'delivered'],
        default: 'pending',
    },
    paymentMethod : {
        type: String,
        enum: ['COD','Prepaid'],
        required: true,
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed'],
        default: 'pending',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;