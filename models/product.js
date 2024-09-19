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
    stock: {
        type: Number,
        required: [true, 'Stock is required!'],
    },
    category: {
        type: String,
        required: [true, 'Category is required!'],
        trim: true,
    },
    image: {
        type: String,
        required: false,
        default: 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg',
        trim: true,
    }
});

module.exports = mongoose.model('Product', productSchema);