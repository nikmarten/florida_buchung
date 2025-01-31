import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Pages
import Home from './pages/Home';
import Booking from './pages/Booking';
import BookingConfirmation from './pages/BookingConfirmation';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import Navbar from './components/Navbar';
import Checkout from './pages/Checkout';
import AdminRoute from './components/AdminRoute';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/booking-confirmation/:bookingId" element={<BookingConfirmation />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/*" element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } />
      </Routes>
    </>
  );
}

export default App;
