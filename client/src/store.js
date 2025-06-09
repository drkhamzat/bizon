import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import cartReducer from './features/cart/cartSlice';
import productReducer from './features/products/productSlice';
import categoryReducer from './features/categories/categorySlice';
import orderReducer from './features/orders/orderSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    products: productReducer,
    categories: categoryReducer,
    orders: orderReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
}); 