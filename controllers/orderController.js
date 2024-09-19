const Cart = require('../models/cart');
const Order = require('../models/order');

exports.getAllOrders = async (req, res) => {
    try{
        const UserId = req.userId;
        const orders = await Order.find({user: UserId});
        res.status(200).json(orders);
    }
    catch(error){
        res.status(500).json({error: error.message});
    }
}

exports.getOrderById = async (req, res) => {
    const {id} = req.params;
    try{
        const order = await Order.findById(id);
        if(!order){
            return res.status(404).json({error: 'Order not found'});
        }
        res.status(200).json(order);
    }
    catch(error){
        res.status(500).json({error: error.message});
    }
}

exports.createOrder = async (req, res) => {
    try{
        const userId = req.userId;
        const {cartId,shippingAddress} = req.body;
        const cart = await Cart.findById(cartId);
        if(!cart){
            return res.status(404).json({error: 'Cart not found'});
        }
        const order = new Order({user: userId, items: cart.items, total: cart.total, shippingAddress});
        await order.save();
        await Cart.findByIdAndDelete(cartId);
        res.status(201).json(order);
    }
    catch(error){
        res.status(500).json({error: error.message});
    }
};