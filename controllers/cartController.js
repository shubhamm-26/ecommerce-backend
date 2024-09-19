const Cart = require('../models/cart');
const Product = require('../models/product');

exports.getCart = async (req, res) => {
    const userId = req.userId;
    try {
        const cart = await Cart.findOne({user: userId }).populate('items.productId');
        res.status(200).json(cart);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.addToCart = async (req, res) => {
    const userId = req.userId;
    const { productId, quantity } = req.body;
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            cart = new Cart({ user: userId, items: [], total: 0 });
        }
        let cartItem = cart.items.find(item => item.productId.toString() === productId);
        if (cartItem) {
            cartItem.quantity += quantity;
        } else {
            cart.items.push({ productId, quantity });
        }
        cart.total += product.price * quantity;
        await cart.save();
        res.status(201).json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.removeFromCart = async (req, res) => {
    const userId = req.userId;
    const { id } = req.params;
    try {
        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }
        const cartItem = cart.items.find(item => item.productId.toString() === id);
        if (!cartItem) {
            return res.status(404).json({ error: 'Item not found' });
        }
        const product = await Product.findById(cartItem.productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        cart.total -= product.price * cartItem.quantity;
        cart.items = cart.items.filter(item => item.productId.toString() !== id);
        await cart.save();
        res.status(204).json("Product deleted successfully");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


exports.updateCartItem = async (req, res) => {
    const userId = req.userId;
    const { productId, quantity } = req.body;

    try {
        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }
        const cartItem = cart.items.find(item => item.productId.toString() === productId);
        if (!cartItem) {
            return res.status(404).json({ error: 'Item not found' });
        }

        const product = await Product.findById(cartItem.productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        cart.total -= product.price * cartItem.quantity;
        if (quantity <= 0) {
            cart.items = cart.items.filter(item => item.productId.toString() !== productId);
        } else {
            cartItem.quantity = quantity;
            cart.total += product.price * quantity;
        }
        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};






