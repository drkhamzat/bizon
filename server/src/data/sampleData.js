const sampleCategories = [
  {
    name: 'Гостиная',
    slug: 'living-room',
    description: 'Мебель для гостиной комнаты',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc',
    featured: true,
  },
  {
    name: 'Спальня',
    slug: 'bedroom',
    description: 'Мебель для спальни',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85',
    featured: true,
  },
  {
    name: 'Кухня',
    slug: 'kitchen',
    description: 'Мебель для кухни',
    image: 'https://images.unsplash.com/photo-1556911220-bda9f7f6b6b2',
    featured: true,
  },
  {
    name: 'Офис',
    slug: 'office',
    description: 'Мебель для офиса',
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36',
    featured: true,
  },
  {
    name: 'Детская',
    slug: 'children',
    description: 'Мебель для детской комнаты',
    image: 'https://images.unsplash.com/photo-1558442074-3c19857bc1dc',
    featured: false,
  },
];

const sampleProducts = [
  {
    name: 'Диван "Комфорт"',
    slug: 'divan-komfort',
    description: 'Удобный диван с мягкими подушками и современным дизайном. Идеально подходит для гостиной.',
    price: 35000,
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc',
      'https://images.unsplash.com/photo-1540574163026-643ea20ade25',
    ],
    category: null, // Будет заполнено после создания категорий
    inStock: true,
    dimensions: {
      width: 220,
      height: 85,
      depth: 95,
    },
    material: 'Экокожа, дерево',
    color: 'Серый',
    weight: 80,
    featured: true,
    discount: 0,
  },
  {
    name: 'Кровать "Сон"',
    slug: 'krovat-son',
    description: 'Комфортная двуспальная кровать с ортопедическим основанием. Стильный дизайн и качественные материалы.',
    price: 42000,
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85',
      'https://images.unsplash.com/photo-1505693314053-e3e09d8e6ca0',
    ],
    category: null, // Будет заполнено после создания категорий
    inStock: true,
    dimensions: {
      width: 160,
      height: 50,
      depth: 200,
    },
    material: 'Дерево, текстиль',
    color: 'Белый',
    weight: 70,
    featured: false,
    discount: 10,
  },
  {
    name: 'Шкаф "Хранитель"',
    slug: 'shkaf-khranitel',
    description: 'Вместительный шкаф для одежды с зеркалом. Современный дизайн и функциональность.',
    price: 28000,
    images: [
      'https://images.unsplash.com/photo-1556228578-8c89e6adf883',
      'https://images.unsplash.com/photo-1595428774223-ef52624120d2',
    ],
    category: null, // Будет заполнено после создания категорий
    inStock: true,
    dimensions: {
      width: 180,
      height: 220,
      depth: 60,
    },
    material: 'ЛДСП, зеркало',
    color: 'Венге',
    weight: 120,
    featured: true,
    discount: 0,
  },
  {
    name: 'Стол "Рабочий"',
    slug: 'stol-rabochiy',
    description: 'Удобный рабочий стол для офиса или домашнего кабинета. Эргономичный дизайн и прочная конструкция.',
    price: 15000,
    images: [
      'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd',
      'https://images.unsplash.com/photo-1526887593587-a307ea5d46b4',
    ],
    category: null, // Будет заполнено после создания категорий
    inStock: true,
    dimensions: {
      width: 140,
      height: 75,
      depth: 70,
    },
    material: 'ЛДСП, металл',
    color: 'Дуб сонома',
    weight: 40,
    featured: false,
    discount: 15,
  },
];

// Функция для импорта данных в базу
const importData = async () => {
  try {
    const mongoose = require('mongoose');
    const Category = require('../models/Category');
    const Product = require('../models/Product');
    const User = require('../models/User');
    require('dotenv').config();
    
    // Подключение к базе данных
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bizon-furniture');
    
    // Очистка базы данных
    await Category.deleteMany();
    await Product.deleteMany();
    
    // Импорт категорий
    const createdCategories = await Category.insertMany(sampleCategories);
    
    // Связывание продуктов с категориями
    const productsWithCategories = sampleProducts.map((product, index) => {
      return {
        ...product,
        category: createdCategories[index % createdCategories.length]._id,
      };
    });
    
    // Импорт продуктов
    await Product.insertMany(productsWithCategories);
    
    // Создание администратора
    await User.findOneAndUpdate(
      { email: 'admin@example.com' },
      {
        name: 'Администратор',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin',
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    
    console.log('Данные успешно импортированы');
    process.exit();
  } catch (error) {
    console.error('Ошибка при импорте данных:', error);
    process.exit(1);
  }
};

// Экспорт данных и функции импорта
module.exports = {
  sampleCategories,
  sampleProducts,
  importData,
};