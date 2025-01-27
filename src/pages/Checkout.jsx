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
  Snackbar,
  TableCell
} from '@mui/material';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { clearCart } from '../store/cartSlice';
import { createBooking } from '../store/bookingSlice';
import LoadingButton from '@mui/lab/LoadingButton';

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
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    // Ensure we have items in the cart
    if (!cartItems || cartItems.length === 0) {
      setErrors({ submit: 'Keine Produkte im Warenkorb' });
      return;
    }

    const bookingData = {
      customerName: formData.name,
      customerEmail: formData.email,
      notes: formData.notes || '',
      items: cartItems.map(item => ({
        productId: item.equipment._id,
        startDate: item.startDate,
        endDate: item.endDate
      }))
    };
    
    try {
      setIsSubmitting(true);
      const result = await dispatch(createBooking(bookingData)).unwrap();
      
      if (result && result._id) {
        setShowSuccess(true);
        setTimeout(() => {
          dispatch(clearCart());
          navigate(`/booking-confirmation/${result._id}`);
        }, 1000);
      } else {
        setError('Unerwarteter Fehler: Keine Buchungs-ID erhalten');
      }
    } catch (error) {
      setError(error.message || 'Die Buchung konnte nicht abgeschlossen werden. Bitte versuchen Sie es später erneut.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  if (cartItems.length === 0) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: { xs: 2, sm: 4 }, mb: { xs: 4, sm: 8 } }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Checkout
          </Typography>

          <Paper sx={{ p: { xs: 2, sm: 3 }, mt: 3 }}>
            <Typography>Dein Warenkorb ist leer.</Typography>
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
      <Box sx={{ mt: { xs: 2, sm: 4 }, mb: { xs: 4, sm: 8 } }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Checkout
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: { xs: 2, sm: 3 }, mb: { xs: 2, sm: 3 } }}>
              <Typography variant="h6" gutterBottom>
                Kontaktdaten
              </Typography>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="Vorname"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      error={!!errors.firstName}
                      helperText={errors.firstName}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="Nachname"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      error={!!errors.lastName}
                      helperText={errors.lastName}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label="E-Mail"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      error={!!errors.email}
                      helperText={errors.email}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label="Telefon"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      error={!!errors.phone}
                      helperText={errors.phone}
                      size="small"
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
                      size="small"
                    />
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper 
              sx={{ 
                p: { xs: 2, sm: 3 },
                position: { md: 'sticky' },
                top: 24
              }}
            >
              <Typography variant="h6" gutterBottom>
                Zusammenfassung
              </Typography>
              <Box sx={{ mb: 2 }}>
                {cartItems.map((item) => (
                  <Box
                    key={item.id}
                    sx={{
                      py: 1,
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      '&:last-child': { borderBottom: 0 }
                    }}
                  >
                    <Typography variant="subtitle2">
                      {item.equipment.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(item.startDate)} - {formatDate(item.endDate)}
                    </Typography>
                  </Box>
                ))}
              </Box>
              <Typography gutterBottom>
                Anzahl Produkte: {cartItems.length}
              </Typography>
              <LoadingButton
                loading={isSubmitting}
                variant="contained"
                fullWidth
                size="large"
                onClick={handleSubmit}
                sx={{ mt: 2 }}
              >
                Jetzt buchen
              </LoadingButton>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      <Snackbar
        open={showSuccess}
        autoHideDuration={2000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Buchung erfolgreich! Du wirst weitergeleitet...
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
} 