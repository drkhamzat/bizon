const express = require('express');
const cors = require('cors');
const path = require('path');

// Создаем Express приложение
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Базовый маршрут для проверки работы сервера
app.get('/', (req, res) => {
  res.json({ 
    message: 'Сервер BIZON работает в аварийном режиме!',
    status: 'ok'
  });
});

// Простой API маршрут для проверки
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    mode: 'emergency',
    message: 'Сервер работает в аварийном режиме без подключения к базе данных',
    time: new Date().toISOString()
  });
});

// Настройка порта
const PORT = process.env.PORT || 10000;

// Запуск сервера
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Аварийный сервер запущен на порту ${PORT}`);
  console.log(`Сервер доступен по адресу http://0.0.0.0:${PORT}`);
});

// Обработка сигналов завершения
process.on('SIGTERM', () => {
  console.log('Получен сигнал SIGTERM. Завершение работы сервера...');
  server.close(() => {
    console.log('Сервер остановлен');
    process.exit(0);
  });
}); 