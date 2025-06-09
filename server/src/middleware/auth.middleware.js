const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware для защиты маршрутов
exports.protect = async (req, res, next) => {
  let token;

  // Проверяем наличие токена в заголовке Authorization
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Получаем токен из заголовка
      token = req.headers.authorization.split(' ')[1];

      // Проверяем токен
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Получаем пользователя из базы данных
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error('Ошибка аутентификации:', error);
      res.status(401).json({
        success: false,
        message: 'Не авторизован, токен недействителен',
      });
    }
  }

  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Не авторизован, токен отсутствует',
    });
  }
};

// Middleware для проверки роли администратора
exports.admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Доступ запрещен, требуются права администратора',
    });
  }
}; 