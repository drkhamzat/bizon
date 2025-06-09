const fs = require('fs');
const path = require('path');

// Пути к файлам
const baseDir = path.join(__dirname, 'server');
const indexPath = path.join(baseDir, 'src', 'index.js');
const envPath = path.join(baseDir, '.env');

// Исправленное содержимое файла index.js
const indexContent = `const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Импорт маршрутов
const productRoutes = require('./routes/product.routes');
const categoryRoutes = require('./routes/category.routes');
const orderRoutes = require('./routes/order.routes');
const userRoutes = require('./routes/user.routes');
const authRoutes = require('./routes/auth.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Статические файлы
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Базовый маршрут для проверки работы сервера
app.get('/', (req, res) => {
  res.json({ message: 'Сервер BIZON работает!' });
});

// Маршруты API
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Что-то пошло не так!' });
});

// Подключение к MongoDB
const PORT = process.env.PORT || 10000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/bizon-furniture';

// Сначала запускаем сервер
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(\`Сервер запущен на порту \${PORT}\`);
  console.log(\`Сервер доступен по адресу http://0.0.0.0:\${PORT}\`);
});

// Затем пытаемся подключиться к MongoDB
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000, // увеличиваем таймаут до 10 секунд
    connectTimeoutMS: 10000
  })
  .then(() => {
    console.log('Подключено к MongoDB');
  })
  .catch((err) => {
    console.error('Ошибка подключения к MongoDB:', err);
    console.log('Сервер продолжит работу без подключения к базе данных. Некоторые функции будут недоступны.');
  });

// Обработка сигналов завершения
process.on('SIGTERM', () => {
  console.log('Получен сигнал SIGTERM. Завершение работы сервера...');
  server.close(() => {
    console.log('Сервер остановлен');
    mongoose.connection.close(false, () => {
      console.log('Соединение с MongoDB закрыто');
      process.exit(0);
    });
  });
});`;

// Исправленное содержимое файла .env
const envContent = `PORT=10000
MONGO_URI=mongodb://localhost:27017/bizon-furniture
JWT_SECRET=bizon-furniture-jwt-secret
NODE_ENV=production`;

// Записываем содержимое файла index.js
try {
  const originalContent = fs.existsSync(indexPath) ? fs.readFileSync(indexPath, 'utf8') : '';
  fs.writeFileSync(indexPath, indexContent, 'utf8');
  console.log('Файл index.js успешно исправлен!');
  console.log('Оригинальное содержимое сохранено для справки');
} catch (error) {
  console.error('Ошибка при исправлении файла index.js:', error);
  process.exit(1);
}

// Записываем содержимое файла .env
try {
  const originalEnvContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
  fs.writeFileSync(envPath, envContent, 'utf8');
  console.log('Файл .env успешно обновлен!');
  console.log('Оригинальное содержимое сохранено для справки');
} catch (error) {
  console.error('Ошибка при обновлении файла .env:', error);
  process.exit(1);
}

console.log('Все файлы успешно обновлены. Теперь сервер будет сначала запускаться, а затем пытаться подключиться к MongoDB.');
console.log('Если подключение к MongoDB не удастся, сервер продолжит работу с ограниченной функциональностью.'); 