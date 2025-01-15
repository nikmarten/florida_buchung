import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
} from '@mui/material';
import { clearCart } from '../store/cartSlice';

export default function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
  });
  const [submitted, setSubmitted] = useState(false);

  if (cartItems.length === 0 && !submitted) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto' }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Keine Produkte im Warenkorb
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/booking')}
            sx={{ mt: 2 }}
          >
            Zur Buchungsseite
          </Button>
        </Paper>
      </Box>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // Hier später API-Call zum Backend einfügen
    console.log('Buchung:', { ...formData, items: cartItems });
    dispatch(clearCart());
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto' }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Alert severity="success" sx={{ mb: 3 }}>
            Ihre Buchung wurde erfolgreich abgeschlossen!
          </Alert>
          <Typography variant="body1" paragraph>
            Sie erhalten in Kürze eine Bestätigung per E-Mail.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/')}
            sx={{ mt: 2 }}
          >
            Zur Startseite
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Buchung abschließen
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                type="email"
                label="E-Mail"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Abteilung"
                value={formData.department}
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
                }
              />
            </Grid>
          </Grid>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="outlined" onClick={() => navigate('/cart')}>
              Zurück zum Warenkorb
            </Button>
            <Button type="submit" variant="contained">
              Buchung abschließen
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
} 