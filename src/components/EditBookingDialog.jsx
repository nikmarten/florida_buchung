import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

const statusOptions = [
  { value: 'pending', label: 'Ausstehend' },
  { value: 'confirmed', label: 'Bestätigt' },
  { value: 'completed', label: 'Abgeschlossen' },
  { value: 'cancelled', label: 'Storniert' }
];

export default function EditBookingDialog({ open, onClose, booking, onSave }) {
  const [editedBooking, setEditedBooking] = useState(booking);
  const [error, setError] = useState(null);

  if (!booking) return null;

  const handleStatusChange = (event) => {
    setEditedBooking(prev => ({
      ...prev,
      status: event.target.value
    }));
  };

  const handleRemoveItem = (itemId) => {
    if (editedBooking.items.length <= 1) {
      setError('Eine Buchung muss mindestens ein Produkt enthalten');
      return;
    }
    setEditedBooking(prev => ({
      ...prev,
      items: prev.items.filter(item => item._id !== itemId)
    }));
    setError(null);
  };

  const handleSave = () => {
    onSave(editedBooking);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6">
          Buchung bearbeiten
        </Typography>
        <Typography variant="subtitle2" color="text.secondary">
          {booking.customerName} - {booking.customerEmail}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={editedBooking.status}
              onChange={handleStatusChange}
              label="Status"
            >
              {statusOptions.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Typography variant="subtitle1" gutterBottom>
            Gebuchte Produkte
          </Typography>
          <List>
            {editedBooking.items.map((item) => (
              <React.Fragment key={item._id}>
                <ListItem>
                  <ListItemText
                    primary={item.product.name}
                    secondary={
                      <>
                        <Typography variant="body2">
                          Menge: {item.quantity}
                        </Typography>
                        <Typography variant="body2">
                          Zeitraum: {format(new Date(item.startDate), 'dd.MM.yyyy', { locale: de })} - {format(new Date(item.endDate), 'dd.MM.yyyy', { locale: de })}
                        </Typography>
                      </>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton 
                      edge="end" 
                      onClick={() => handleRemoveItem(item._id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Abbrechen</Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          color="primary"
        >
          Speichern
        </Button>
      </DialogActions>
    </Dialog>
  );
} 