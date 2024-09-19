const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const productSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required!'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Description is required!'],
        trim: true,
    },
    price: {
        type: Number,
        required: [true, 'Price is required!'],
    },
    category: {
        type: String,
        required: false,
        trim: true,
    },
    image: {
        type: String,
        required: false,
        default: null,
        trim: true,
    }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;