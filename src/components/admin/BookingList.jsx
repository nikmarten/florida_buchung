import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import axios from 'axios';
import BookingReturn from './BookingReturn';

const API_URL = import.meta.env.VITE_API_URL;

const statusColors = {
  pending: 'warning',
  confirmed: 'info',
  in_progress: 'primary',
  returned: 'success',
  completed: 'success'
};

const statusLabels = {
  pending: 'Ausstehend',
  confirmed: 'Bestätigt',
  in_progress: 'In Bearbeitung',
  returned: 'Zurückgegeben',
  completed: 'Abgeschlossen'
};

export default function BookingList() {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`${API_URL}/bookings`);
      setBookings(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Buchungen konnten nicht geladen werden');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleBookingUpdated = (updatedBooking) => {
    setBookings(prevBookings =>
      prevBookings.map(booking =>
        booking._id === updatedBooking._id ? updatedBooking : booking
      )
    );
    setSelectedBooking(null);
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'dd.MM.yyyy', { locale: de });
  };

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Buchungen verwalten
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Buchungsnummer</TableCell>
              <TableCell>Kunde</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Produkte</TableCell>
              <TableCell>Datum</TableCell>
              <TableCell>Aktionen</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking._id}>
                <TableCell>{booking._id}</TableCell>
                <TableCell>
                  <Typography variant="body2">{booking.customerName}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {booking.customerEmail}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={statusLabels[booking.status]}
                    color={statusColors[booking.status]}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {booking.items.length} {booking.items.length === 1 ? 'Produkt' : 'Produkte'}
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {formatDate(booking.createdAt)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setSelectedBooking(booking)}
                    disabled={booking.status === 'completed'}
                  >
                    Rückgabe prüfen
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              Buchung #{selectedBooking?._id}
            </Typography>
            <IconButton onClick={() => setSelectedBooking(null)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <BookingReturn
              booking={selectedBooking}
              onBookingUpdated={handleBookingUpdated}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
} 