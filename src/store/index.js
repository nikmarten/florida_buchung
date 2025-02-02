import { configureStore } from '@reduxjs/toolkit';
import productReducer from './productSlice';
import categoryReducer from './categorySlice';
import bookingReducer from './bookingSlice';
import cartReducer from './cartSlice';

const store = configureStore({
  reducer: {
    products: productReducer,
    categories: categoryReducer,
    bookings: bookingReducer,
    cart: cartReducer,
  },
});

export default store; 