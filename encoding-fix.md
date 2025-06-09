# Исправление проблемы кодировки файла package.json

Ошибка при деплое на Render.com указывает на проблему с кодировкой файла package.json. В файле присутствуют некорректные символы или BOM (Byte Order Mark), что приводит к ошибке `JSON.parse Unexpected token "�" (0xFFFD)`.

## Шаги для исправления:

1. Удалите текущий файл package.json

2. Создайте новый файл package.json с правильной кодировкой UTF-8 без BOM, используя один из следующих способов:

### Вариант 1: Используйте онлайн-редактор в GitHub

1. Перейдите в репозиторий на GitHub
2. Нажмите на кнопку "Add file" → "Create new file"
3. Введите имя файла "package.json"
4. Скопируйте и вставьте следующее содержимое:

```json
{
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
    "dev": "concurrently \"npm run server\" \"npm run client\""
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
}
```

5. Нажмите "Commit changes"

### Вариант 2: Используйте текстовый редактор с поддержкой кодировки

1. Откройте любой текстовый редактор с поддержкой выбора кодировки (VS Code, Notepad++, и т.д.)
2. Создайте новый файл
3. Скопируйте и вставьте содержимое из варианта 1
4. Сохраните файл как "package.json" с кодировкой UTF-8 без BOM

## Также создайте файл emergency-server.js:

Создайте файл emergency-server.js с следующим содержимым:

```javascript
const express = require('express');
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
  console.log(`Сервер запущен на порту ${PORT}`);
});
```

## После исправления:

1. Закоммитьте изменения
2. Запустите новый деплой на Render.com

Это должно решить проблему с кодировкой файла package.json.