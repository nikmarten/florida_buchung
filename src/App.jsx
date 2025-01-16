import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Booking from './pages/Booking';
import Checkout from './pages/Checkout';
import BookingConfirmation from './pages/BookingConfirmation';
import Login from './pages/Login';
import AdminLayout from './components/admin/AdminLayout';
import AdminProducts from './components/admin/AdminProducts';
import AdminCategories from './components/admin/AdminCategories';
import AdminBookings from './components/admin/AdminBookings';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Booking />} />
        <Route path="booking" element={<Booking />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="confirmation/:bookingId" element={<BookingConfirmation />} />
        <Route path="login" element={<Login />} />
        <Route
          path="admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminProducts />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="bookings" element={<AdminBookings />} />
        </Route>
      </Route>
    </Routes>
  );
}
