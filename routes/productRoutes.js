const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');

router.get('/', productController.getAllProducts);

router.get('/:id', productController.getProductById);

router.post('/', authenticate, authorize(['admin']), productController.createProduct);

router.put('/:id', authenticate, authorize(['admin']), productController.updateProduct);

router.delete('/:id', authenticate, authorize(['admin']), productController.deleteProduct);

module.exports = router;
