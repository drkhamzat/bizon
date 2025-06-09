const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { auth, admin } = require('../middleware/auth.middleware');

// Публичные маршруты
router.get('/', productController.getProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/discounted', productController.getDiscountedProducts);
router.get('/:id', productController.getProduct);

// Защищенные маршруты (только для админов)
router.post('/', auth, admin, productController.createProduct);
router.put('/:id', auth, admin, productController.updateProduct);
router.delete('/:id', auth, admin, productController.deleteProduct);

module.exports = router; 