const fs = require('fs');
const path = require('path');

// Правильное содержимое файла package.json (в UTF-8 без BOM)
const packageJsonContent = `{
  "name": "bizon-furniture-store",
  "version": "1.0.0",
  "description": "Bizon Furniture Store",
  "main": "emergency-server.js",
  "engines": {
    "node": ">=14.0.0"
  },
  "scripts": {
    "start": "node emergency-server.js",
    "server": "cd server && npm start",
    "client": "cd client && npm install && npm start",
    "dev": "concurrently \\"npm run server\\" \\"npm run client\\""
  },
  "keywords": [
    "furniture",
    "store",
    "ecommerce"
  ],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "concurrently": "^8.2.2",
    "cors": "^2.8.5",
    "express": "^4.18.2"
  }
}`;

// Содержимое аварийного сервера
const emergencyServerContent = `const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;

app.get('/', (req, res) => {
  res.json({ 
    message: 'Сервер BIZON работает!',
    time: new Date().toISOString()
  });
});

app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    mode: 'emergency',
    time: new Date().toISOString()
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(\`Сервер запущен на порту \${PORT}\`);
});`;

// Запись файлов с правильной кодировкой
try {
  // Запись package.json
  fs.writeFileSync(path.join(__dirname, 'package.json'), packageJsonContent, { encoding: 'utf8' });
  console.log('Файл package.json успешно создан с кодировкой UTF-8 без BOM');

  // Запись emergency-server.js
  fs.writeFileSync(path.join(__dirname, 'emergency-server.js'), emergencyServerContent, { encoding: 'utf8' });
  console.log('Файл emergency-server.js успешно создан с кодировкой UTF-8 без BOM');

  console.log('Все файлы успешно созданы!');
  console.log('Теперь можно выполнить коммит и деплой на Render.com');
} catch (error) {
  console.error('Произошла ошибка при создании файлов:', error);
}