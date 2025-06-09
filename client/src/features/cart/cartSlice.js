import { createSlice } from '@reduxjs/toolkit';

// Получение корзины из localStorage
const cartItemsFromStorage = localStorage.getItem('cartItems')
  ? JSON.parse(localStorage.getItem('cartItems'))
  : [];

const shippingAddressFromStorage = localStorage.getItem('shippingAddress')
  ? JSON.parse(localStorage.getItem('shippingAddress'))
  : {};

const initialState = {
  cartItems: cartItemsFromStorage,
  shippingAddress: shippingAddressFromStorage,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Добавление товара в корзину
    addToCart: (state, action) => {
      const item = action.payload;
      
      const existItem = state.cartItems.find(
        (x) => x._id === item._id
      );
      
      if (existItem) {
        // Если товар уже в корзине, увеличиваем количество
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id ? { ...x, quantity: x.quantity + item.quantity } : x
        );
      } else {
        // Если товара нет в корзине, добавляем его
        state.cartItems = [...state.cartItems, item];
      }
      
      // Сохраняем в localStorage
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    
    // Обновление количества товара в корзине
    updateCartQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      
      state.cartItems = state.cartItems.map((item) =>
        item._id === id ? { ...item, quantity } : item
      );
      
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    
    // Удаление товара из корзины
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (item) => item._id !== action.payload
      );
      
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    
    // Очистка корзины
    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem('cartItems');
    },
    
    // Сохранение адреса доставки
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem('shippingAddress', JSON.stringify(action.payload));
    },
  },
});

export const {
  addToCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
  saveShippingAddress,
} = cartSlice.actions;

export default cartSlice.reducer; 