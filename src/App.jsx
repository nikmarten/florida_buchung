import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { de } from 'date-fns/locale';

// Pages
import Home from './pages/Home';
import Booking from './pages/Booking';
import BookingConfirmation from './pages/BookingConfirmation';
import AdminDashboard from './pages/admin/AdminDashboard';
import Navbar from './components/Navbar';
import Checkout from './pages/Checkout';

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={de}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/booking-confirmation/:bookingId" element={<BookingConfirmation />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
      </Routes>
    </LocalizationProvider>
  );
}

export default App;
