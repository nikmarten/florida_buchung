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
      <Box sx={{ mt: { xs: 2, sm: 4 }, mb: { xs: 4, sm: 8 } }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Buchungsbestätigung
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Paper sx={{ p: { xs: 2, sm: 3 }, mt: 3 }}>
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
            <Button
              variant="contained"
              onClick={() => navigate('/booking')}
            >
              Zurück zur Buchung
            </Button>
          </Paper>
        ) : booking ? (
          <>
            <Paper sx={{ p: { xs: 2, sm: 3 }, mb: { xs: 2, sm: 3 } }}>
              <Typography variant="h6" gutterBottom>
                Buchungsdetails
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Buchungsnummer
                  </Typography>
                  <Typography gutterBottom>
                    {booking._id}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Status
                  </Typography>
                  <Typography gutterBottom>
                    {booking.status}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Name
                  </Typography>
                  <Typography gutterBottom>
                    {booking.firstName} {booking.lastName}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    E-Mail
                  </Typography>
                  <Typography gutterBottom>
                    {booking.email}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Telefon
                  </Typography>
                  <Typography gutterBottom>
                    {booking.phone}
                  </Typography>
                </Grid>
                {booking.notes && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Anmerkungen
                    </Typography>
                    <Typography gutterBottom>
                      {booking.notes}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Paper>

            <Paper sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography variant="h6" gutterBottom>
                Gebuchte Produkte
              </Typography>
              <Grid container spacing={2}>
                {booking.items.map((item) => (
                  <Grid item xs={12} key={item._id}>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: { xs: 2, sm: 3 },
                        p: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1
                      }}
                    >
                      <Box
                        component="img"
                        src={item.equipment.imageUrl || 'https://via.placeholder.com/200'}
                        alt={item.equipment.name}
                        sx={{
                          width: { xs: '100%', sm: 150 },
                          height: { xs: 200, sm: 100 },
                          objectFit: 'cover',
                          borderRadius: 1
                        }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          {item.equipment.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Zeitraum: {formatDate(item.startDate)} - {formatDate(item.endDate)}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </>
        ) : null}
      </Box>
    </Container>
  );
} 