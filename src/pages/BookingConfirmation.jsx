import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Button,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

const API_URL = import.meta.env.VITE_API_URL;

export default function BookingConfirmation() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        console.log('Fetching booking from:', `${API_URL}/bookings/${bookingId}`);
        const response = await axios.get(`${API_URL}/bookings/${bookingId}`);
        console.log('Booking response:', response.data);
        setBooking(response.data);
      } catch (err) {
        console.error('Error fetching booking:', err.response || err);
        setError('Buchung konnte nicht geladen werden.');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return format(date, 'dd.MM.yyyy', { locale: de });
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>
      </Container>
    );
  }

  if (!booking) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mt: 4 }}>Buchung nicht gefunden</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 8 }}>
        <Paper sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <CheckCircleOutlineIcon color="success" sx={{ fontSize: 40, mr: 2 }} />
            <Typography variant="h4" component="h1">
              Buchung erfolgreich abgeschlossen
            </Typography>
          </Box>

          <Alert severity="success" sx={{ mb: 4 }}>
            Vielen Dank für Ihre Buchung! Eine Bestätigung wurde an {booking.customerEmail} gesendet.
          </Alert>

          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            Buchungsdetails
          </Typography>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Buchungsnummer
              </Typography>
              <Typography variant="body1" gutterBottom>
                {booking._id}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Buchungsdatum
              </Typography>
              <Typography variant="body1" gutterBottom>
                {formatDate(booking.createdAt)}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Name
              </Typography>
              <Typography variant="body1" gutterBottom>
                {booking.customerName}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                E-Mail
              </Typography>
              <Typography variant="body1" gutterBottom>
                {booking.customerEmail}
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            Gebuchte Produkte
          </Typography>
          {booking.items.map((item, index) => (
            <Paper key={index} sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
              <Typography variant="subtitle1" gutterBottom>
                {item.productId.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Zeitraum: {formatDate(item.startDate)} - {formatDate(item.endDate)}
              </Typography>
            </Paper>
          ))}

          {booking.notes && (
            <>
              <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                Anmerkungen
              </Typography>
              <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Typography variant="body1">
                  {booking.notes}
                </Typography>
              </Paper>
            </>
          )}

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              onClick={() => navigate('/booking')}
              sx={{ minWidth: 200 }}
            >
              Zurück zur Übersicht
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
} 