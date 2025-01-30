import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Chip,
  Collapse,
  Box,
  Typography,
  Grid,
  Button
} from '@mui/material';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ReturnDialog from './ReturnDialog';
import { useDispatch } from 'react-redux';
import { updateBookingReturn } from '../store/bookingSlice';

const statusColors = {
  pending: 'warning',
  confirmed: 'info',
  completed: 'success',
  cancelled: 'error'
};

const statusLabels = {
  pending: 'Ausstehend',
  confirmed: 'Bestätigt',
  completed: 'Abgeschlossen',
  cancelled: 'Storniert'
};

const returnStatusColors = {
  pending: 'warning',
  returned: 'success',
  damaged: 'error',
  lost: 'error'
};

const returnStatusLabels = {
  pending: 'Ausstehend',
  returned: 'Zurückgegeben',
  damaged: 'Beschädigt',
  lost: 'Verloren'
};

const Row = ({ booking }) => {
  const [open, setOpen] = useState(false);
  const [returnDialogOpen, setReturnDialogOpen] = useState(false);
  const dispatch = useDispatch();

  const handleReturnSave = async (returnItems) => {
    await dispatch(updateBookingReturn({
      bookingId: booking._id,
      items: returnItems
    }));
  };

  const allItemsReturned = booking.items.every(
    item => item.returnStatus === 'returned' || 
    item.returnStatus === 'damaged' || 
    item.returnStatus === 'lost'
  );

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{format(new Date(booking.createdAt), 'dd.MM.yyyy HH:mm', { locale: de })}</TableCell>
        <TableCell>
          <Typography variant="subtitle2">{booking.customerName}</Typography>
          <Typography variant="caption" color="textSecondary">
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
          {format(new Date(booking.items[0].startDate), 'dd.MM.yyyy', { locale: de })}
          {' - '}
          {format(new Date(booking.items[0].endDate), 'dd.MM.yyyy', { locale: de })}
        </TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Rückgabe">
              <IconButton 
                size="small"
                onClick={() => setReturnDialogOpen(true)}
                disabled={booking.status === 'completed' || booking.status === 'cancelled'}
                color={allItemsReturned ? 'success' : 'default'}
              >
                <AssignmentReturnIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Bearbeiten">
              <IconButton size="small" color="primary">
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Stornieren">
              <IconButton 
                size="small" 
                color="error"
                disabled={booking.status === 'completed' || booking.status === 'cancelled'}
              >
                <CancelIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2 }}>
              <Typography variant="h6" gutterBottom component="div">
                Gebuchte Produkte
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Produkt</TableCell>
                    <TableCell align="right">Menge</TableCell>
                    <TableCell>Rückgabestatus</TableCell>
                    <TableCell>Rückgabedatum</TableCell>
                    <TableCell>Anmerkungen</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {booking.items.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell component="th" scope="row">
                        {item.product.name}
                      </TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                      <TableCell>
                        <Chip
                          label={returnStatusLabels[item.returnStatus || 'pending']}
                          color={returnStatusColors[item.returnStatus || 'pending']}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {item.returnDate ? 
                          format(new Date(item.returnDate), 'dd.MM.yyyy', { locale: de }) 
                          : '-'}
                      </TableCell>
                      <TableCell>{item.notes || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {booking.notes && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Anmerkungen zur Buchung:
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {booking.notes}
                  </Typography>
                </Box>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

      <ReturnDialog
        open={returnDialogOpen}
        onClose={() => setReturnDialogOpen(false)}
        booking={booking}
        onSave={handleReturnSave}
      />
    </>
  );
};

const BookingList = ({ bookings }) => {
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell width={50} />
            <TableCell>Datum</TableCell>
            <TableCell>Kunde</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Zeitraum</TableCell>
            <TableCell width={150}>Aktionen</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {bookings.map((booking) => (
            <Row key={booking._id} booking={booking} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BookingList; 