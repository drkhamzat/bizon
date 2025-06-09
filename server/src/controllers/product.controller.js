const Product = require('../models/Product');

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
      success: true,
      count: products.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      products,
    });
  } catch (error) {
    console.error('Ошибка при получении товаров:', error);
    res.status(500).json({
      success: false,
      message: 'Не удалось получить товары',
      error: error.message,
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
        success: false,
        message: 'Товар не найден',
      });
    }
    
    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error('Ошибка при получении товара:', error);
    res.status(500).json({
      success: false,
      message: 'Не удалось получить товар',
      error: error.message,
    });
  }
};

// Создать новый товар
exports.createProduct = async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    
    res.status(201).json({
      success: true,
      product: newProduct,
    });
  } catch (error) {
    console.error('Ошибка при создании товара:', error);
    res.status(400).json({
      success: false,
      message: 'Не удалось создать товар',
      error: error.message,
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
        success: false,
        message: 'Товар не найден',
      });
    }
    
    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error('Ошибка при обновлении товара:', error);
    res.status(400).json({
      success: false,
      message: 'Не удалось обновить товар',
      error: error.message,
    });
  }
};

// Удалить товар
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findByIdAndDelete(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Товар не найден',
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Товар успешно удален',
    });
  } catch (error) {
    console.error('Ошибка при удалении товара:', error);
    res.status(500).json({
      success: false,
      message: 'Не удалось удалить товар',
      error: error.message,
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
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error('Ошибка при получении избранных товаров:', error);
    res.status(500).json({
      success: false,
      message: 'Не удалось получить избранные товары',
      error: error.message,
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
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error('Ошибка при получении товаров со скидкой:', error);
    res.status(500).json({
      success: false,
      message: 'Не удалось получить товары со скидкой',
      error: error.message,
    });
  }
};