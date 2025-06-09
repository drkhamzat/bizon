const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Генерация JWT токена
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Регистрация нового пользователя
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Проверка, существует ли пользователь с таким email
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
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
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({
        message: 'Неверные данные пользователя',
      });
    }
  } catch (error) {
    console.error('Ошибка при регистрации:', error);
    res.status(500).json({
      message: 'Ошибка сервера',
    });
  }
};

// @desc    Аутентификация пользователя и получение токена
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Поиск пользователя по email
    const user = await User.findOne({ email });

    // Проверка пользователя и пароля
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({
        message: 'Неверный email или пароль',
      });
    }
  } catch (error) {
    console.error('Ошибка при входе:', error);
    res.status(500).json({
      message: 'Ошибка сервера',
    });
  }
};

// @desc    Получить профиль пользователя
// @route   GET /api/auth/profile
// @access  Private
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({
        message: 'Пользователь не найден',
      });
    }
  } catch (error) {
    console.error('Ошибка при получении профиля:', error);
    res.status(500).json({
      message: 'Ошибка сервера',
    });
  }
};

// @desc    Обновить профиль пользователя
// @route   PUT /api/auth/profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      
      if (req.body.password) {
        user.password = req.body.password;
      }

      if (req.body.phone) {
        user.phone = req.body.phone;
      }

      if (req.body.address) {
        user.address = {
          city: req.body.address.city || user.address?.city,
          street: req.body.address.street || user.address?.street,
          house: req.body.address.house || user.address?.house,
          apartment: req.body.address.apartment || user.address?.apartment,
        };
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        address: updatedUser.address,
        role: updatedUser.role,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({
        message: 'Пользователь не найден',
      });
    }
  } catch (error) {
    console.error('Ошибка при обновлении профиля:', error);
    res.status(500).json({
      message: 'Ошибка сервера',
    });
  }
}; 