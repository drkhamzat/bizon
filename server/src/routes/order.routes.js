const express = require('express');
const router = express.Router();
const { auth, admin } = require('../middleware/auth.middleware');
const orderController = require('../controllers/order.controller');

// Маршруты для заказов
router.get('/', auth, admin, orderController.getAllOrders);
router.get('/myorders', auth, orderController.getMyOrders);
router.get('/:id', auth, orderController.getOrderById);
router.post('/', auth, orderController.createOrder);
router.put('/:id/status', auth, admin, orderController.updateOrderStatus);
router.delete('/:id', auth, admin, orderController.deleteOrder);

module.exports = router; 