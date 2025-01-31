import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  useTheme
} from '@mui/material';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

export default function AdminBookings() {
  const theme = useTheme();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    // Fetch bookings from API
    fetch('/api/bookings')
      .then(res => res.json())
      .then(data => setBookings(data))
      .catch(err => console.error('Error fetching bookings:', err));
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'confirmed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
        Buchungen verwalten
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Buchungs-ID</TableCell>
              <TableCell>Kunde</TableCell>
              <TableCell>Produkte</TableCell>
              <TableCell>Von</TableCell>
              <TableCell>Bis</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking._id}>
                <TableCell>{booking._id}</TableCell>
                <TableCell>{booking.customerName}</TableCell>
                <TableCell>
                  {booking.items.map((item, index) => (
                    <div key={index}>
                      {item.product.name} (x{item.quantity})
                    </div>
                  ))}
                </TableCell>
                <TableCell>
                  {format(new Date(booking.startDate), 'dd.MM.yyyy', { locale: de })}
                </TableCell>
                <TableCell>
                  {format(new Date(booking.endDate), 'dd.MM.yyyy', { locale: de })}
                </TableCell>
                <TableCell>
                  <Chip
                    label={booking.status}
                    color={getStatusColor(booking.status)}
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
} 