# Инструкция по деплою BIZON Furniture Store на Render.com

## Шаг 1: Обновите файлы на GitHub

1. Добавьте и закоммитьте созданный файл `server.js` на GitHub
2. Убедитесь, что файлы `package.json` и `server.js` находятся в корне репозитория

## Шаг 2: Создайте новый Web Service на Render.com

1. Войдите в свой аккаунт на [Render.com](https://render.com)
2. Нажмите на кнопку "New" и выберите "Web Service"
3. Подключите свой GitHub репозиторий
4. Настройте сервис:
   - **Name**: `bizon-furniture`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Node version**: `14.0.0` или выше

## Шаг 3: Настройте переменные окружения (Environment Variables)

Добавьте следующие переменные окружения:
- `PORT`: `10000`
- `NODE_ENV`: `production`

## Шаг 4: Дополнительные настройки

- Если у вас есть база данных MongoDB, добавьте переменную `MONGODB_URI` с вашей строкой подключения
- Убедитесь, что у вас нет `.env` файла с конфиденциальными данными в репозитории

## Шаг 5: Деплой и проверка

1. Нажмите "Create Web Service" для деплоя
2. Дождитесь завершения сборки и деплоя
3. Проверьте работу сайта, открыв URL, предоставленный Render

## Диагностика проблем

Если сайт не отображается корректно:
1. Проверьте логи в разделе "Logs" на Render.com
2. Убедитесь, что в репозитории есть все необходимые файлы
3. Проверьте, что в файле `server.js` нет ошибок

## Структура файлов на сервере

```
bizon/
├── server.js           # Основной файл сервера
├── package.json        # Конфигурация Node.js
├── client/             # Клиентская часть (если есть)
│   ├── build/          # Собранная клиентская часть
│   │   ├── index.html
│   │   ├── static/
│   │   │   ├── css/
│   │   │   ├── js/
│   │   │   └── media/
```

## Ссылка на пример `server.js`

Используйте следующий код для `server.js`:

```javascript
// Комплексный сервер для BIZON Furniture Store
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Создание Express приложения
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Константы
const PORT = process.env.PORT || 10000;
const CLIENT_BUILD_PATH = path.join(__dirname, 'client', 'build');
const CLIENT_PUBLIC_PATH = path.join(__dirname, 'client', 'public');

// API маршруты
app.get('/api', (req, res) => {
  res.json({ 
    message: "BIZON Server is running!", 
    time: new Date().toISOString() 
  });
});

app.get('/api/status', (req, res) => {
  res.json({
    status: "online",
    mode: "production",
    time: new Date().toISOString()
  });
});

// API маршруты для заказов (заглушки)
app.get('/api/orders', (req, res) => {
  res.json([
    { id: 1, customer: "John Doe", products: ["Sofa", "Chair"], total: 1200 },
    { id: 2, customer: "Jane Smith", products: ["Table", "Lamp"], total: 800 }
  ]);
});

// API маршруты для продуктов (заглушки)
app.get('/api/products', (req, res) => {
  res.json([
    { id: 1, name: "Кожаный диван", price: 999, category: "Диваны", inStock: true },
    { id: 2, name: "Обеденный стол", price: 499, category: "Столы", inStock: true },
    { id: 3, name: "Кресло-качалка", price: 349, category: "Кресла", inStock: false },
    { id: 4, name: "Книжный шкаф", price: 699, category: "Шкафы", inStock: true },
    { id: 5, name: "Прикроватная тумба", price: 149, category: "Спальня", inStock: true }
  ]);
});

// Функция для проверки наличия директории
function directoryExists(path) {
  try {
    return fs.statSync(path).isDirectory();
  } catch (err) {
    return false;
  }
}

// Отдача статических файлов, если они существуют
if (directoryExists(CLIENT_BUILD_PATH)) {
  console.log('Serving static files from client/build');
  app.use(express.static(CLIENT_BUILD_PATH));
  
  // Любые неизвестные маршруты отправляют на index.html
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(CLIENT_BUILD_PATH, 'index.html'));
    }
  });
} else if (directoryExists(CLIENT_PUBLIC_PATH)) {
  console.log('Serving static files from client/public');
  app.use(express.static(CLIENT_PUBLIC_PATH));
  
  // Любые неизвестные маршруты отправляют на index.html
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(CLIENT_PUBLIC_PATH, 'index.html'));
    }
  });
} else {
  // Если нет клиентских файлов, отдаем базовую HTML-страницу
  app.get('/', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>BIZON Furniture Store</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 0; 
              padding: 0; 
              color: #333;
              background-color: #f8f8f8;
            }
            .container { 
              max-width: 1200px; 
              margin: 0 auto; 
              padding: 20px;
            }
            header {
              background-color: #333;
              color: white;
              padding: 20px 0;
              text-align: center;
            }
            h1 { 
              margin: 0;
              font-size: 2.5em;
            }
            .status { 
              padding: 20px; 
              background: #fff; 
              border-radius: 5px; 
              margin: 20px 0; 
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .message { 
              font-weight: bold; 
              font-size: 1.2em;
            }
            .time { 
              color: #666; 
              font-size: 0.9em; 
            }
            .products {
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
              gap: 20px;
              margin-top: 30px;
            }
            .product {
              background: white;
              border-radius: 5px;
              padding: 20px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .product h3 {
              margin-top: 0;
              color: #333;
            }
            .price {
              font-weight: bold;
              color: #e63946;
              font-size: 1.2em;
            }
            .category {
              color: #666;
              font-size: 0.9em;
            }
            .stock {
              display: inline-block;
              padding: 5px 10px;
              border-radius: 3px;
              font-size: 0.8em;
              margin-top: 10px;
            }
            .in-stock {
              background-color: #a8dadc;
              color: #1d3557;
            }
            .out-of-stock {
              background-color: #e63946;
              color: white;
            }
            footer {
              text-align: center;
              margin-top: 50px;
              padding: 20px;
              color: #666;
              border-top: 1px solid #ddd;
            }
          </style>
        </head>
        <body>
          <header>
            <h1>BIZON Furniture Store</h1>
          </header>
          
          <div class="container">
            <div class="status">
              <p class="message">Сервер работает в режиме демонстрации</p>
              <p class="time">Время сервера: ${new Date().toLocaleString()}</p>
            </div>
            
            <h2>Наши товары</h2>
            <div class="products">
              <div class="product">
                <h3>Кожаный диван</h3>
                <p class="price">999 €</p>
                <p class="category">Категория: Диваны</p>
                <span class="stock in-stock">В наличии</span>
              </div>
              
              <div class="product">
                <h3>Обеденный стол</h3>
                <p class="price">499 €</p>
                <p class="category">Категория: Столы</p>
                <span class="stock in-stock">В наличии</span>
              </div>
              
              <div class="product">
                <h3>Кресло-качалка</h3>
                <p class="price">349 €</p>
                <p class="category">Категория: Кресла</p>
                <span class="stock out-of-stock">Нет в наличии</span>
              </div>
              
              <div class="product">
                <h3>Книжный шкаф</h3>
                <p class="price">699 €</p>
                <p class="category">Категория: Шкафы</p>
                <span class="stock in-stock">В наличии</span>
              </div>
              
              <div class="product">
                <h3>Прикроватная тумба</h3>
                <p class="price">149 €</p>
                <p class="category">Категория: Спальня</p>
                <span class="stock in-stock">В наличии</span>
              </div>
            </div>
            
            <p>API доступен по адресу: <a href="/api/status">/api/status</a></p>
            <p>Список товаров API: <a href="/api/products">/api/products</a></p>
            
            <footer>
              <p>© 2024 BIZON Furniture Store. Все права защищены.</p>
            </footer>
          </div>
        </body>
      </html>
    `);
  });
}

// Запуск сервера
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Сервер запущен на порту ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});
```

## Пример package.json

```json
{
  "name": "bizon-furniture-store",
  "version": "1.0.0",
  "description": "BIZON Furniture Store",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.18.2"
  },
  "engines": {
    "node": ">=14.0.0"
  }
}
``` 