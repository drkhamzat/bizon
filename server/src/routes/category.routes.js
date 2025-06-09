const express = require('express');
const router = express.Router();
const { auth, admin } = require('../middleware/auth.middleware');
const categoryController = require('../controllers/category.controller');

// Маршруты для категорий
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);
router.post('/', auth, admin, categoryController.createCategory);
router.put('/:id', auth, admin, categoryController.updateCategory);
router.delete('/:id', auth, admin, categoryController.deleteCategory);

module.exports = router;