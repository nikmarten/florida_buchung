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
  CircularProgress,
  Card,
  CardContent
} from '@mui/material';
import {
  CheckCircleOutline as CheckCircleIcon,
  EventNote as EventIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Notes as NotesIcon
} from '@mui/icons-material';
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
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '50vh' 
        }}>
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
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          textAlign: 'center',
          mb: 4 
        }}>
          <CheckCircleIcon 
            color="success" 
            sx={{ fontSize: 64, mb: 2 }} 
          />
          <Typography variant="h4" component="h1" gutterBottom>
            Buchung erfolgreich!
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Vielen Dank für deine Buchung. Hier sind deine Buchungsdetails:
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card elevation={0} sx={{ height: '100%', border: 1, borderColor: 'divider' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonIcon /> Persönliche Daten
                </Typography>
                <Box sx={{ ml: 4 }}>
                  <Typography variant="body1" gutterBottom>
                    {booking.customerName}
                  </Typography>
                  <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EmailIcon fontSize="small" /> {booking.customerEmail}
                  </Typography>
                  {booking.phone && (
                    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PhoneIcon fontSize="small" /> {booking.phone}
                    </Typography>
                  )}
                </Box>

                {booking.notes && (
                  <>
                    <Typography variant="h6" gutterBottom sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <NotesIcon /> Anmerkungen
                    </Typography>
                    <Typography variant="body1" sx={{ ml: 4 }}>
                      {booking.notes}
                    </Typography>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card elevation={0} sx={{ height: '100%', border: 1, borderColor: 'divider' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EventIcon /> Buchungsdetails
                </Typography>
                <Box sx={{ ml: 4 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Buchungsnummer
                  </Typography>
                  <Typography variant="body1" gutterBottom sx={{ mb: 2 }}>
                    {booking._id}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Status
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: booking.status === 'confirmed' ? 'success.main' : 'text.primary',
                      mb: 2
                    }}
                  >
                    {booking.status === 'confirmed' ? 'Bestätigt' : 'In Bearbeitung'}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Gebuchte Produkte
                </Typography>
                <Grid container spacing={2}>
                  {booking.items.map((item) => (
                    <Grid item xs={12} key={item._id}>
                      <Paper 
                        elevation={0}
                        sx={{ 
                          p: 2, 
                          border: 1, 
                          borderColor: 'divider',
                          '&:hover': {
                            bgcolor: 'action.hover'
                          }
                        }}
                      >
                        <Box sx={{ 
                          display: 'flex', 
                          flexDirection: { xs: 'column', sm: 'row' },
                          gap: 2
                        }}>
                          <Box
                            component="img"
                            src={item.product?.imageUrl || 'https://via.placeholder.com/200'}
                            alt={item.product?.name || 'Produkt'}
                            sx={{
                              width: { xs: '100%', sm: 150 },
                              height: { xs: 200, sm: 100 },
                              objectFit: 'cover',
                              borderRadius: 1
                            }}
                          />
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6">
                              {item.product?.name || 'Unbekanntes Produkt'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                              Zeitraum: {formatDate(item.startDate)} - {formatDate(item.endDate)}
                            </Typography>
                          </Box>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button
            variant="contained"
            onClick={() => navigate('/booking')}
            sx={{ minWidth: 200 }}
          >
            Neue Buchung erstellen
          </Button>
        </Box>
      </Box>
    </Container>
  );
} 