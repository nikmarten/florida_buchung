import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress
} from '@mui/material';
import { createBooking } from '../store/bookingSlice';
import { clearCart } from '../store/cartSlice';

export default function CheckoutForm({ cartItems }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    phone: '',
    notes: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Erstelle die Buchungsdaten
      const bookingData = {
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        phone: formData.phone,
        notes: formData.notes,
        items: cartItems.map(item => {
          // Stelle sicher, dass die productId ein String ist und entferne eventuelle Leerzeichen
          const productId = item.productId?.toString().trim();
          
          if (!productId) {
            throw new Error('Produkt-ID fehlt');
          }

          return {
            product: productId,
            startDate: new Date(item.startDate).toISOString(),
            endDate: new Date(item.endDate).toISOString(),
            quantity: item.quantity || 1
          };
        })
      };

      console.log('Cart Items (detailed):', JSON.stringify(cartItems, null, 2));
      console.log('Mapped Items (detailed):', JSON.stringify(bookingData.items, null, 2));
      console.log('Full Booking Data (detailed):', JSON.stringify(bookingData, null, 2));
      
      // Sende die Buchung
      const result = await dispatch(createBooking(bookingData)).unwrap();
      console.log('Booking result:', result);
      
      // Leere den Warenkorb
      dispatch(clearCart());
      
      // Navigiere zur Bestätigungsseite
      navigate(`/booking-confirmation/${result._id}`);
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.message || 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Name"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="E-Mail"
            name="customerEmail"
            type="email"
            value={formData.customerEmail}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Telefon"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Anmerkungen"
            name="notes"
            multiline
            rows={4}
            value={formData.notes}
            onChange={handleChange}
          />
        </Grid>
      </Grid>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={loading}
        sx={{ mt: 3 }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CircularProgress size={20} color="inherit" />
            Wird gebucht...
          </Box>
        ) : (
          'Jetzt buchen'
        )}
      </Button>
    </Box>
  );
} 