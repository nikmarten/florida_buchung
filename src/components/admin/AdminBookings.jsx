import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { format, parseISO, startOfWeek, addDays, isWithinInterval, isSameDay, addWeeks, subWeeks } from 'date-fns';
import { de } from 'date-fns/locale';
import {
  Paper,
  Box,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  IconButton,
} from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { fetchBookings, deleteBooking } from '../../store/bookingSlice';

// Funktion zur Generierung einer zufälligen Pastellfarbe
const generatePastelColor = (seed) => {
  // Verwende den seed (booking._id), um konsistente Farben für die gleiche Buchung zu generieren
  const hash = seed.split('').reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
  
  // Generiere HSL-Farben für angenehmere Pastelltöne
  const hue = hash % 360; // 0-360 Grad
  const saturation = 60 + (hash % 20); // 60-80%
  const lightness = 75 + (hash % 10); // 75-85%
  
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

const AdminBookings = () => {
  const dispatch = useDispatch();
  const { items: bookings, status, error } = useSelector((state) => state.bookings);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Generiere Farben für alle Buchungen einmalig
  const bookingColors = useMemo(() => {
    if (!bookings) return {};
    return bookings.reduce((acc, booking) => {
      acc[booking._id] = generatePastelColor(booking._id);
      return acc;
    }, {});
  }, [bookings]);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchBookings());
    }
  }, [status, dispatch]);

  const handleOpenDialog = (booking) => {
    setSelectedBooking(booking);
  };

  const handleCloseDialog = () => {
    setSelectedBooking(null);
  };

  const handlePreviousWeek = () => {
    setCurrentDate(prevDate => subWeeks(prevDate, 1));
  };

  const handleNextWeek = () => {
    setCurrentDate(prevDate => addWeeks(prevDate, 1));
  };

  const handleDeleteBooking = async () => {
    if (window.confirm('Möchten Sie diese Buchung wirklich löschen?')) {
      try {
        await dispatch(deleteBooking(selectedBooking._id)).unwrap();
        handleCloseDialog();
      } catch (err) {
        alert('Fehler beim Löschen der Buchung: ' + err.message);
      }
    }
  };

  if (status === 'loading') {
    return <CircularProgress />;
  }

  if (status === 'failed') {
    return <Alert severity="error">{error}</Alert>;
  }

  // Kalender-Logik
  const startDate = startOfWeek(currentDate, { locale: de });
  const weekDays = [...Array(7)].map((_, index) => addDays(startDate, index));

  // Gruppiere Buchungen nach Tagen
  const getBookingsForDay = (day) => {
    if (!bookings) return [];
    
    return bookings.filter(booking => 
      booking.items.some(item => {
        if (!item.startDate || !item.endDate) return false;
        const start = parseISO(item.startDate);
        const end = parseISO(item.endDate);
        
        // Prüfe, ob der Tag innerhalb des Buchungszeitraums liegt
        const isInRange = isWithinInterval(day, { start, end });
        // Oder ob es der Start- oder Endtag ist
        const isStartDay = isSameDay(day, start);
        const isEndDay = isSameDay(day, end);
        
        return isInRange || isStartDay || isEndDay;
      })
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header mit Navigation */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
        <Typography variant="h5">Buchungskalender</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
          <IconButton onClick={handlePreviousWeek} size="large">
            <ChevronLeft />
          </IconButton>
          <Typography sx={{ mx: 2 }}>
            {format(startDate, 'dd.MM.', { locale: de })} - {format(weekDays[6], 'dd.MM.yyyy', { locale: de })}
          </Typography>
          <IconButton onClick={handleNextWeek} size="large">
            <ChevronRight />
          </IconButton>
        </Box>
      </Box>
      
      <Grid container spacing={1}>
        <Grid container item spacing={1}>
          {/* Wochentage Header */}
          {weekDays.map((day) => (
            <Grid item xs key={day.toISOString()}>
              <Paper 
                elevation={2}
                sx={{ 
                  p: 1,
                  bgcolor: 'primary.main',
                  color: 'white',
                  textAlign: 'center',
                  borderRadius: '4px 4px 0 0'
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  {format(day, 'EEEE', { locale: de })}
                </Typography>
                <Typography variant="caption">
                  {format(day, 'dd.MM.', { locale: de })}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Grid container item spacing={1}>
          {/* Buchungen für jeden Tag */}
          {weekDays.map((day) => (
            <Grid item xs key={`bookings-${day.toISOString()}`}>
              <Paper 
                elevation={1}
                sx={{ 
                  p: 1,
                  minHeight: 200,
                  bgcolor: 'background.default',
                  borderRadius: '0 0 4px 4px',
                  overflowY: 'auto'
                }}
              >
                {getBookingsForDay(day).map((booking) => (
                  <Tooltip 
                    key={booking._id}
                    title="Klicken für Details"
                  >
                    <Paper
                      elevation={2}
                      onClick={() => handleOpenDialog(booking)}
                      sx={{
                        p: 1,
                        mb: 1,
                        bgcolor: bookingColors[booking._id],
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        '&:hover': {
                          filter: 'brightness(0.9)',
                          transform: 'translateY(-2px)'
                        }
                      }}
                    >
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 'bold',
                          color: 'rgba(0, 0, 0, 0.7)'
                        }} 
                        align="center"
                      >
                        {booking.customerName}
                      </Typography>
                    </Paper>
                  </Tooltip>
                ))}
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Grid>

      {/* Buchungsdetails Dialog */}
      <Dialog 
        open={Boolean(selectedBooking)} 
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        {selectedBooking && (
          <>
            <DialogTitle>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                bgcolor: bookingColors[selectedBooking._id],
                mx: -3,
                mt: -3,
                mb: -2,
                p: 2
              }}>
                <Typography variant="h6" sx={{ color: 'rgba(0, 0, 0, 0.7)' }}>
                  Buchungsdetails
                </Typography>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ py: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Kundeninformationen
                </Typography>
                <Typography variant="body1">
                  <strong>Name:</strong> {selectedBooking.customerName}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  <strong>Email:</strong> {selectedBooking.customerEmail}
                </Typography>
                {selectedBooking.notes && (
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    <strong>Notizen:</strong> {selectedBooking.notes}
                  </Typography>
                )}

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Gebuchte Produkte
                </Typography>
                {selectedBooking.items.map((item, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      {item.productId?.name}
                    </Typography>
                    <Typography variant="body2">
                      Zeitraum: {format(parseISO(item.startDate), 'dd.MM.yyyy')} - {format(parseISO(item.endDate), 'dd.MM.yyyy')}
                    </Typography>
                  </Box>
                ))}

                <Divider sx={{ my: 2 }} />

                <Typography variant="body2" color="text.secondary">
                  Buchung erstellt am: {format(parseISO(selectedBooking.createdAt), 'dd.MM.yyyy HH:mm')}
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} variant="contained">
                Schließen
              </Button>
              <Button 
                onClick={handleDeleteBooking}
                color="error"
                variant="contained"
              >
                Buchung löschen
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default AdminBookings; 