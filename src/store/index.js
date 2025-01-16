import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import productReducer from './productSlice';
import categoryReducer from './categorySlice';
import bookingReducer from './bookingSlice';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    products: productReducer,
    categories: categoryReducer,
    booking: bookingReducer,
    auth: authReducer,
  },
});

export default store; 