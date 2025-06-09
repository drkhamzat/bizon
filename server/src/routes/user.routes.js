const express = require('express');
const router = express.Router();
const { auth, admin } = require('../middleware/auth.middleware');
const userController = require('../controllers/user.controller');

// Маршруты для пользователей
router.get('/', auth, admin, userController.getAllUsers);
router.get('/profile', auth, userController.getUserProfile);
router.put('/profile', auth, userController.updateUserProfile);
router.get('/:id', auth, admin, userController.getUserById);
router.put('/:id', auth, admin, userController.updateUser);
router.delete('/:id', auth, admin, userController.deleteUser);

module.exports = router; 