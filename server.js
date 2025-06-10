// Сервер для BIZON Furniture Store
const express = require('express');
const cors = require('cors');
const path = require('path');

// Создание Express приложения
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Константы
const PORT = process.env.PORT || 10000;

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

// API маршруты для продуктов (заглушки)
app.get('/api/products', (req, res) => {
  res.json([
    { id: 1, name: "Кожаный диван", price: 999, category: "Диваны", inStock: true, image: "https://via.placeholder.com/300" },
    { id: 2, name: "Обеденный стол", price: 499, category: "Столы", inStock: true, image: "https://via.placeholder.com/300" },
    { id: 3, name: "Кресло-качалка", price: 349, category: "Кресла", inStock: false, image: "https://via.placeholder.com/300" },
    { id: 4, name: "Книжный шкаф", price: 699, category: "Шкафы", inStock: true, image: "https://via.placeholder.com/300" },
    { id: 5, name: "Прикроватная тумба", price: 149, category: "Спальня", inStock: true, image: "https://via.placeholder.com/300" }
  ]);
});

// API маршруты для категорий (заглушки)
app.get('/api/categories', (req, res) => {
  res.json([
    { id: 1, name: "Диваны", slug: "sofas" },
    { id: 2, name: "Столы", slug: "tables" },
    { id: 3, name: "Кресла", slug: "chairs" },
    { id: 4, name: "Шкафы", slug: "cabinets" },
    { id: 5, name: "Спальня", slug: "bedroom" }
  ]);
});

// Проверка наличия сборки клиентской части
const clientBuildPath = path.join(__dirname, 'client', 'build');

// Функция для проверки существования директории
const directoryExists = (path) => {
  try {
    return require('fs').statSync(path).isDirectory();
  } catch (err) {
    return false;
  }
};

// Отдача статических файлов, если они существуют
if (directoryExists(clientBuildPath)) {
  console.log('Serving static files from client/build');
  
  // Отдаем статические файлы из build директории
  app.use(express.static(clientBuildPath));
  
  // Для всех остальных запросов отправляем index.html
  app.get('*', (req, res) => {
    // Если запрос не начинается с /api, отдаем index.html
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(clientBuildPath, 'index.html'));
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
          <meta charset="UTF-8">
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
});
