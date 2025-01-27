import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Paper, 
  Typography, 
  Grid, 
  Button,
  TextField,
  Alert,
  Snackbar
} from '@mui/material';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { clearCart } from '../store/cartSlice';
import { createBooking } from '../store/bookingSlice';

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return format(date, 'dd.MM.yyyy', { locale: de });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name ist erforderlich';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'E-Mail ist erforderlich';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Bitte geben Sie eine gültige E-Mail-Adresse ein';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const bookingData = {
      customerName: formData.name,
      customerEmail: formData.email,
      notes: formData.notes,
      items: cartItems.map(item => ({
        productId: item._id,
        startDate: item.startDate,
        endDate: item.endDate
      }))
    };

    console.log('Sende Buchungsdaten:', bookingData);
    
    try {
      const result = await dispatch(createBooking(bookingData)).unwrap();
      console.log('Buchung erfolgreich:', result);
      if (result && result._id) {
        navigate(`/confirmation/${result._id}`);
        dispatch(clearCart());
      } else {
        setErrors({ submit: 'Unerwarteter Fehler: Keine Buchungs-ID erhalten' });
      }
    } catch (error) {
      console.error('Fehler bei der Buchung:', error);
      setErrors({ 
        submit: error.message || 'Fehler beim Speichern der Buchung. Bitte versuchen Sie es später erneut.' 
      });
    }
  };

  if (cartItems.length === 0) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, mb: 8 }}>
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography>Ihr Warenkorb ist leer.</Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/booking')}
              sx={{ mt: 2 }}
            >
              Zurück zur Buchung
            </Button>
          </Paper>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Buchung abschließen
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Ausgewählte Produkte
              </Typography>
              {cartItems.map((item) => (
                <Box
                  key={item.id}
                  sx={{
                    py: 2,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    '&:last-child': { borderBottom: 0 }
                  }}
                >
                  <Typography variant="subtitle1" gutterBottom>
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Zeitraum: {formatDate(item.startDate)} - {formatDate(item.endDate)}
                  </Typography>
                </Box>
              ))}
            </Paper>

            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Ihre Daten
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    error={!!errors.name}
                    helperText={errors.name}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="E-Mail"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    error={!!errors.email}
                    helperText={errors.email}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Notizen"
                    multiline
                    rows={4}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, position: 'sticky', top: 24 }}>
              <Typography variant="h6" gutterBottom>
                Zusammenfassung
              </Typography>
              <Typography gutterBottom>
                Anzahl Produkte: {cartItems.length}
              </Typography>
              {errors.submit && (
                <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
                  {errors.submit}
                </Alert>
              )}
              <Button
                variant="contained"
                fullWidth
                size="large"
                sx={{ mt: 3 }}
                onClick={handleSubmit}
              >
                Buchung abschließen
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      <Snackbar
        open={showSuccess}
        autoHideDuration={2000}
        message="Buchung erfolgreich abgeschlossen!"
      />
    </Container>
  );
} 