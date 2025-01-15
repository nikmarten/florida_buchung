import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField
} from '@mui/material';
import { 
  Visibility as VisibilityIcon,
  Check as CheckIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBookings, updateBookingStatus } from '../../store/bookingSlice';

export default function AdminBookings() {
  const dispatch = useDispatch();
  const { items: bookings, status, error } = useSelector((state) => state.booking);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchBookings());
    }
  }, [status, dispatch]);

  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedBooking(null);
  };

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      await dispatch(updateBookingStatus({ id: bookingId, status: newStatus })).unwrap();
    } catch (err) {
      alert('Fehler beim Aktualisieren des Status: ' + err.message);
    }
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      PENDING: { label: 'Ausstehend', color: 'warning' },
      APPROVED: { label: 'Genehmigt', color: 'success' },
      REJECTED: { label: 'Abgelehnt', color: 'error' },
      COMPLETED: { label: 'Abgeschlossen', color: 'default' }
    };

    const config = statusConfig[status] || statusConfig.PENDING;
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  if (status === 'loading') {
    return <Box sx={{ p: 2 }}><Typography>Lädt...</Typography></Box>;
  }

  if (status === 'failed') {
    return <Box sx={{ p: 2 }}><Typography color="error">{error}</Typography></Box>;
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>Buchungen verwalten</Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Kunde</TableCell>
              <TableCell>E-Mail</TableCell>
              <TableCell>Datum</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Aktionen</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>{booking.customerName}</TableCell>
                <TableCell>{booking.customerEmail}</TableCell>
                <TableCell>
                  {format(booking.createdAt, 'Pp', { locale: de })}
                </TableCell>
                <TableCell>
                  {getStatusChip(booking.status)}
                </TableCell>
                <TableCell align="right">
                  <IconButton 
                    size="small" 
                    onClick={() => handleViewBooking(booking)}
                    sx={{ mr: 1 }}
                  >
                    <VisibilityIcon />
                  </IconButton>
                  {booking.status === 'PENDING' && (
                    <>
                      <IconButton 
                        size="small" 
                        color="success"
                        onClick={() => handleUpdateStatus(booking.id, 'APPROVED')}
                        sx={{ mr: 1 }}
                      >
                        <CheckIcon />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleUpdateStatus(booking.id, 'REJECTED')}
                      >
                        <CloseIcon />
                      </IconButton>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Buchungsdetails</DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Kundeninformationen
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Typography>Name: {selectedBooking.customerName}</Typography>
                <Typography>E-Mail: {selectedBooking.customerEmail}</Typography>
                <Typography>Status: {getStatusChip(selectedBooking.status)}</Typography>
              </Box>

              <Typography variant="subtitle1" gutterBottom>
                Gebuchte Artikel
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Artikel</TableCell>
                      <TableCell>Kategorie</TableCell>
                      <TableCell>Von</TableCell>
                      <TableCell>Bis</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedBooking.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.equipment.name}</TableCell>
                        <TableCell>{item.equipment.category}</TableCell>
                        <TableCell>
                          {format(item.startDate, 'Pp', { locale: de })}
                        </TableCell>
                        <TableCell>
                          {format(item.endDate, 'Pp', { locale: de })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Schließen</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 