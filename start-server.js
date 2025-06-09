const fs = require('fs');
const path = require('path');
const { spawn, execSync } = require('child_process');

// Пути к файлам
const baseDir = path.join(__dirname, 'server');
const controllerPath = path.join(baseDir, 'src', 'controllers', 'product.controller.js');
const orderControllerPath = path.join(baseDir, 'src', 'controllers', 'order.controller.js');
const orderRoutesPath = path.join(baseDir, 'src', 'routes', 'order.routes.js');
const envPath = path.join(baseDir, '.env');

console.log('Пути к файлам:');
console.log('baseDir:', baseDir);
console.log('controllerPath:', controllerPath);
console.log('orderControllerPath:', orderControllerPath);
console.log('orderRoutesPath:', orderRoutesPath);
console.log('envPath:', envPath);

// Содержимое файла product.controller.js
const controllerContent = `const Product = require('../models/Product');

// Получить все товары с возможностью фильтрации
exports.getProducts = async (req, res) => {
  try {
    const { 
      category, 
      minPrice, 
      maxPrice, 
      material, 
      inStock,
      search,
      sort = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 12
    } = req.query;

    // Построение фильтра
    const filter = {};
    
    if (category) {
      filter.category = category;
    }
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    
    if (material) {
      filter.material = material;
    }
    
    if (inStock) {
      filter.inStock = inStock === 'true';
    }
    
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }
    
    // Построение сортировки
    const sortOption = {};
    sortOption[sort] = order === 'asc' ? 1 : -1;
    
    // Пагинация
    const skip = (Number(page) - 1) * Number(limit);
    
    const products = await Product.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit))
      .populate('category');
      
    const total = await Product.countDocuments(filter);
    
    res.status(200).json({
      count: products.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      products,
    });
  } catch (error) {
    console.error('Ошибка при получении товаров:', error);
    res.status(500).json({
      message: 'Не удалось получить товары',
    });
  }
};

// Получить товар по ID или slug
exports.getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    let product;
    
    // Проверяем, является ли id ObjectId или slug
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id).populate('category');
    } else {
      product = await Product.findOne({ slug: id }).populate('category');
    }
    
    if (!product) {
      return res.status(404).json({
        message: 'Товар не найден',
      });
    }
    
    res.status(200).json(product);
  } catch (error) {
    console.error('Ошибка при получении товара:', error);
    res.status(500).json({
      message: 'Не удалось получить товар',
    });
  }
};

// Создать новый товар
exports.createProduct = async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Ошибка при создании товара:', error);
    res.status(400).json({
      message: 'Не удалось создать товар',
    });
  }
};

// Обновить товар
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({
        message: 'Товар не найден',
      });
    }
    
    res.status(200).json(product);
  } catch (error) {
    console.error('Ошибка при обновлении товара:', error);
    res.status(400).json({
      message: 'Не удалось обновить товар',
    });
  }
};

// Удалить товар
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({
        message: 'Товар не найден',
      });
    }
    
    await product.deleteOne();
    
    res.status(200).json({
      message: 'Товар успешно удален',
    });
  } catch (error) {
    console.error('Ошибка при удалении товара:', error);
    res.status(500).json({
      message: 'Не удалось удалить товар',
    });
  }
};

// Получить избранные товары
exports.getFeaturedProducts = async (req, res) => {
  try {
    const limit = req.query.limit || 8;
    
    const products = await Product.find({ featured: true })
      .limit(Number(limit))
      .populate('category');
    
    res.status(200).json({
      count: products.length,
      products,
    });
  } catch (error) {
    console.error('Ошибка при получении избранных товаров:', error);
    res.status(500).json({
      message: 'Не удалось получить избранные товары',
    });
  }
};

// Получить товары со скидкой
exports.getDiscountedProducts = async (req, res) => {
  try {
    const limit = req.query.limit || 8;
    
    const products = await Product.find({ discount: { $gt: 0 } })
      .limit(Number(limit))
      .populate('category');
    
    res.status(200).json({
      count: products.length,
      products,
    });
  } catch (error) {
    console.error('Ошибка при получении товаров со скидкой:', error);
    res.status(500).json({
      message: 'Не удалось получить товары со скидкой',
    });
  }
};`;

// Содержимое файла order.controller.js
const orderControllerContent = `const Order = require('../models/Order');

// @desc    Получить все заказы
// @route   GET /api/orders
// @access  Private/Admin
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'id name email');
    res.json(orders);
  } catch (error) {
    console.error('Ошибка при получении заказов:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// @desc    Получить мои заказы
// @route   GET /api/orders/myorders
// @access  Private
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    console.error('Ошибка при получении заказов пользователя:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// @desc    Получить заказ по ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    
    if (!order) {
      return res.status(404).json({ message: 'Заказ не найден' });
    }
    
    // Проверяем, что заказ принадлежит текущему пользователю или пользователь админ
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Нет доступа к этому заказу' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Ошибка при получении заказа:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// @desc    Создать новый заказ
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    const { 
      items, 
      totalAmount, 
      customerInfo,
      comment,
      paymentMethod
    } = req.body;
    
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Нет товаров в заказе' });
    }
    
    const order = new Order({
      user: req.user._id,
      items,
      totalAmount,
      customerInfo,
      comment,
      paymentMethod
    });
    
    const createdOrder = await order.save();
    
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error('Ошибка при создании заказа:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// @desc    Обновить статус заказа
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Заказ не найден' });
    }
    
    order.status = status;
    
    if (status === 'завершен') {
      order.isPaid = true;
      order.paidAt = Date.now();
    }
    
    const updatedOrder = await order.save();
    
    res.json(updatedOrder);
  } catch (error) {
    console.error('Ошибка при обновлении статуса заказа:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// @desc    Удалить заказ
// @route   DELETE /api/orders/:id
// @access  Private/Admin
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Заказ не найден' });
    }
    
    await order.deleteOne();
    
    res.json({ message: 'Заказ удален' });
  } catch (error) {
    console.error('Ошибка при удалении заказа:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};`;

// Содержимое файла order.routes.js
const orderRoutesContent = `const express = require('express');
const router = express.Router();
const { auth, admin } = require('../middleware/auth.middleware');
const orderController = require('../controllers/order.controller');

// Проверка, что все функции контроллера определены
const controllerFunctions = ['getAllOrders', 'getMyOrders', 'getOrderById', 'createOrder', 'updateOrderStatus', 'deleteOrder'];
for (const func of controllerFunctions) {
  if (typeof orderController[func] !== 'function') {
    console.error(\`Функция \${func} не определена в контроллере заказов\`);
    orderController[func] = (req, res) => {
      res.status(501).json({ message: \`Функция \${func} не реализована\` });
    };
  }
}

// Маршруты для заказов
router.get('/', auth, admin, orderController.getAllOrders);
router.get('/myorders', auth, orderController.getMyOrders);
router.get('/:id', auth, orderController.getOrderById);
router.post('/', auth, orderController.createOrder);
router.put('/:id/status', auth, admin, orderController.updateOrderStatus);
router.delete('/:id', auth, admin, orderController.deleteOrder);

module.exports = router;`;

// Содержимое файла .env
const envContent = `PORT=10000
MONGO_URI=mongodb+srv://drkhamzat:bizonpass123@cluster0.zcqnqmz.mongodb.net/bizon-furniture?retryWrites=true&w=majority
JWT_SECRET=bizon-furniture-jwt-secret
NODE_ENV=production`;

// Создаем директории, если они не существуют
const controllersDir = path.dirname(controllerPath);
if (!fs.existsSync(controllersDir)) {
  fs.mkdirSync(controllersDir, { recursive: true });
  console.log(`Создана директория: ${controllersDir}`);
}

const routesDir = path.dirname(orderRoutesPath);
if (!fs.existsSync(routesDir)) {
  fs.mkdirSync(routesDir, { recursive: true });
  console.log(`Создана директория: ${routesDir}`);
}

// Записываем содержимое файла product.controller.js
try {
  fs.writeFileSync(controllerPath, controllerContent, 'utf8');
  console.log('Файл product.controller.js успешно исправлен!');
} catch (error) {
  console.error('Ошибка при исправлении файла product.controller.js:', error);
  process.exit(1);
}

// Записываем содержимое файла order.controller.js
try {
  fs.writeFileSync(orderControllerPath, orderControllerContent, 'utf8');
  console.log('Файл order.controller.js успешно исправлен!');
} catch (error) {
  console.error('Ошибка при исправлении файла order.controller.js:', error);
  process.exit(1);
}

// Записываем содержимое файла order.routes.js
try {
  fs.writeFileSync(orderRoutesPath, orderRoutesContent, 'utf8');
  console.log('Файл order.routes.js успешно исправлен!');
} catch (error) {
  console.error('Ошибка при исправлении файла order.routes.js:', error);
  process.exit(1);
}

// Записываем содержимое файла .env
try {
  fs.writeFileSync(envPath, envContent, 'utf8');
  console.log('Файл .env успешно создан!');
} catch (error) {
  console.error('Ошибка при создании файла .env:', error);
  process.exit(1);
}

// Устанавливаем зависимости сервера
console.log('Устанавливаем зависимости сервера...');
try {
  execSync('cd server && npm install', { stdio: 'inherit' });
} catch (error) {
  console.error('Ошибка при установке зависимостей сервера:', error);
  process.exit(1);
}

// Запускаем сервер
console.log('Запускаем сервер...');
const serverProcess = spawn('node', ['src/index.js'], { cwd: path.join(__dirname, 'server'), stdio: 'inherit' });

serverProcess.on('error', (error) => {
  console.error('Ошибка при запуске сервера:', error);
  process.exit(1);
});

serverProcess.on('exit', (code) => {
  console.log(`Сервер завершил работу с кодом ${code}`);
  process.exit(code);
}); 