const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['новый', 'обработка', 'доставка', 'завершен', 'отменен'],
      default: 'новый',
    },
    customerInfo: {
      fullName: {
        type: String,
        required: [true, 'ФИО обязательно'],
      },
      phone: {
        type: String,
        required: [true, 'Телефон обязателен'],
      },
      email: {
        type: String,
      },
      address: {
        type: String,
        required: [true, 'Адрес обязателен'],
      },
      city: {
        type: String,
        required: [true, 'Город обязателен'],
      },
    },
    comment: {
      type: String,
    },
    paymentMethod: {
      type: String,
      enum: ['наличные', 'карта при получении', 'онлайн оплата'],
      default: 'наличные',
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    deliveryDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Order', OrderSchema); 