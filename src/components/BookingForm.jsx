import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  Alert,
  Typography,
  Card,
  CardContent,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export default function BookingForm({ product, onBookingComplete }) {
  const [formData, setFormData] = useState({
    startDate: null,
    endDate: null,
    quantity: 1,
    customerName: '',
    customerEmail: '',
    phone: '',
    notes: ''
  });

  const [availability, setAvailability] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (formData.startDate && formData.endDate && formData.quantity) {
      checkAvailability();
    } else {
      setAvailability(null);
    }
  }, [formData.startDate, formData.endDate, formData.quantity]);

  const checkAvailability = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/products/${product._id}/availability`, {
        params: {
          startDate: format(formData.startDate, 'yyyy-MM-dd'),
          endDate: format(formData.endDate, 'yyyy-MM-dd'),
          quantity: formData.quantity
        }
      });
      setAvailability(response.data);
      setError(null);
    } catch (err) {
      console.error('Error checking availability:', err);
      setError('Verfügbarkeit konnte nicht geprüft werden');
      setAvailability(null);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'quantity') {
      const numValue = parseInt(value);
      if (numValue > 0 && numValue <= product.quantity) {
        setFormData(prev => ({
          ...prev,
          [name]: numValue
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleDateChange = (name) => (date) => {
    setFormData(prev => ({
      ...prev,
      [name]: date
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!availability?.available) {
      setError('Produkt ist im gewählten Zeitraum nicht verfügbar');
      return;
    }

    setLoading(true);
    try {
      const bookingData = {
        ...formData,
        startDate: format(formData.startDate, 'yyyy-MM-dd'),
        endDate: format(formData.endDate, 'yyyy-MM-dd'),
        productId: product._id
      };

      const response = await axios.post(`${API_URL}/bookings`, bookingData);
      if (onBookingComplete) {
        onBookingComplete(response.data);
      }
    } catch (err) {
      console.error('Error creating booking:', err);
      setError('Buchung konnte nicht erstellt werden');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Zeitraum & Menge
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <DatePicker
                label="Von"
                value={formData.startDate}
                onChange={handleDateChange('startDate')}
                format="dd.MM.yyyy"
                disablePast
                slotProps={{
                  textField: { fullWidth: true, required: true }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <DatePicker
                label="Bis"
                value={formData.endDate}
                onChange={handleDateChange('endDate')}
                format="dd.MM.yyyy"
                disablePast
                minDate={formData.startDate}
                slotProps={{
                  textField: { fullWidth: true, required: true }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Menge"
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={handleChange}
                required
                disabled={loading}
                InputProps={{
                  inputProps: { 
                    min: 1, 
                    max: product.quantity 
                  },
                  endAdornment: loading && (
                    <InputAdornment position="end">
                      <CircularProgress size={20} />
                    </InputAdornment>
                  )
                }}
                helperText={`Maximal verfügbar: ${product.quantity} Stück`}
              />
            </Grid>
          </Grid>

          {availability && (
            <Box sx={{ mt: 2 }}>
              <Alert 
                severity={availability.available ? "success" : "error"}
                sx={{ mb: availability.available ? 0 : 2 }}
              >
                {availability.available
                  ? `${availability.remainingQuantity} von ${product.quantity} Stück verfügbar im gewählten Zeitraum`
                  : `Nicht genügend Stück verfügbar im gewählten Zeitraum (nur noch ${availability.remainingQuantity} verfügbar)`
                }
              </Alert>
              {product.lockPeriodDays > 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Hinweis: Nach der Rückgabe wird das Produkt für {product.lockPeriodDays} Tage gesperrt
                </Typography>
              )}
            </Box>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Kontaktdaten
          </Typography>
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
            <Grid item xs={12} sm={6}>
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
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Telefon"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Anmerkungen"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading || !availability?.available}
        >
          Jetzt buchen
        </Button>
      </Box>
    </Box>
  );
} 