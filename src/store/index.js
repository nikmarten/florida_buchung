import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import bookingReducer from './bookingSlice';
import productReducer from './productSlice';
import categoryReducer from './categorySlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    booking: bookingReducer,
    products: productReducer,
    categories: categoryReducer
  }
}); 