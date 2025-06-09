const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Генерация JWT токена
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Регистрация пользователя
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Проверка, существует ли пользователь с таким email
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'Пользователь с таким email уже существует',
      });
    }

    // Создание нового пользователя
    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Неверные данные пользователя',
      });
    }
  } catch (error) {
    console.error('Ошибка при регистрации:', error);
    res.status(500).json({
      success: false,
      message: 'Не удалось зарегистрировать пользователя',
      error: error.message,
    });
  }
};

// Авторизация пользователя
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Поиск пользователя по email
    const user = await User.findOne({ email });

    // Проверка пароля
    if (user && (await user.matchPassword(password))) {
      res.json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Неверный email или пароль',
      });
    }
  } catch (error) {
    console.error('Ошибка при авторизации:', error);
    res.status(500).json({
      success: false,
      message: 'Не удалось авторизоваться',
      error: error.message,
    });
  }
};

// Получение профиля пользователя
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    if (user) {
      res.json({
        success: true,
        user,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Пользователь не найден',
      });
    }
  } catch (error) {
    console.error('Ошибка при получении профиля:', error);
    res.status(500).json({
      success: false,
      message: 'Не удалось получить профиль пользователя',
      error: error.message,
    });
  }
};

// Обновление профиля пользователя
exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.phone = req.body.phone || user.phone;
      
      if (req.body.address) {
        user.address = {
          ...user.address,
          ...req.body.address,
        };
      }

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        success: true,
        user: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          phone: updatedUser.phone,
          address: updatedUser.address,
        },
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Пользователь не найден',
      });
    }
  } catch (error) {
    console.error('Ошибка при обновлении профиля:', error);
    res.status(500).json({
      success: false,
      message: 'Не удалось обновить профиль пользователя',
      error: error.message,
    });
  }
}; 