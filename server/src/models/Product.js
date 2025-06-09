const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Название товара обязательно'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Описание товара обязательно'],
    },
    price: {
      type: Number,
      required: [true, 'Цена товара обязательна'],
      default: 0,
    },
    images: [
      {
        type: String,
        required: [true, 'Фото товара обязательно'],
      },
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Категория товара обязательна'],
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    dimensions: {
      width: {
        type: Number,
        required: true,
      },
      height: {
        type: Number,
        required: true,
      },
      depth: {
        type: Number,
        required: true,
      },
    },
    material: {
      type: String,
      required: true,
    },
    color: {
      type: String,
    },
    weight: {
      type: Number,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    discount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Создание slug из названия товара
ProductSchema.pre('save', function(next) {
  if (!this.isModified('name')) {
    return next();
  }
  
  this.slug = this.name
    .toLowerCase()
    .replace(/[^а-яёa-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  
  next();
});

module.exports = mongoose.model('Product', ProductSchema); 