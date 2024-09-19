const mongoose = require('mongoose');
const validator = require('validator');
const Schema = mongoose.Schema;


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
        validate: {
            validator: (value) => {
                return validator.isPostalCode(value, 'IN');
            },
            message: 'Invalid pincode!'
        }
    }
});

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required!'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required!'],
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: (value) => {
                return validator.isEmail(value);
            }
        }
    },
    googleId: {
        type: String,
        default: null
    },
    address: {
        type: addressSchema,
        default: null
    },
    password: {
        type: String,
        required: false,
        trim: true,
        minlength: [6, 'Password must be at least 6 characters long!']
    },
    role : {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    reset_token: {
        type: String,
        default: null
    },
    reset_token_expiration : {
        type: Date,
        default: null
    }
    });

const User = mongoose.model('User', userSchema);

module.exports = User;