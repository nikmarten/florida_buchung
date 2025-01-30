import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Checkbox,
  TextField,
  Button,
  Alert,
  Grid
} from '@mui/material';
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export default function BookingReturn({ booking, onBookingUpdated }) {
  const [returnItems, setReturnItems] = useState(
    booking.items.map(item => ({
      ...item,
      isReturned: item.returnStatus === 'returned',
      notes: item.returnNotes || ''
    }))
  );
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleReturnToggle = (index) => {
    const newItems = [...returnItems];
    newItems[index].isReturned = !newItems[index].isReturned;
    setReturnItems(newItems);
  };

  const handleNotesChange = (index, value) => {
    const newItems = [...returnItems];
    newItems[index].notes = value;
    setReturnItems(newItems);
  };

  const updateProductAvailability = async (productId, isReturned, startDate, endDate) => {
    try {
      const now = new Date();
      const bookingEndDate = new Date(endDate);
      
      // Nur wenn die Buchung noch nicht abgelaufen ist, müssen wir die Verfügbarkeit aktualisieren
      if (isReturned && bookingEndDate > now) {
        // Entferne /api vom Ende der URL, falls vorhanden
        const baseUrl = API_URL.endsWith('/api') ? API_URL.slice(0, -4) : API_URL;
        const url = `${baseUrl}/api/products/${productId}/availability/release`;
        
        console.log('Updating availability for product:', productId, 'with dates:', { startDate, endDate });
        console.log('Request URL:', url);
        
        await axios.put(url, {
          startDate: startDate,
          endDate: endDate
        });
      }
    } catch (err) {
      console.error('Error updating product availability:', err);
      console.error('Request details:', {
        productId,
        startDate,
        endDate,
        API_URL,
        fullUrl: `${API_URL.endsWith('/api') ? API_URL.slice(0, -4) : API_URL}/api/products/${productId}/availability/release`
      });
      throw err;
    }
  };

  const handleSubmit = async () => {
    try {
      setError(null);
      const updatedItems = returnItems.map(item => ({
        productId: item.productId._id,
        returnStatus: item.isReturned ? 'returned' : 'pending',
        returnNotes: item.notes,
        returnDate: item.isReturned ? new Date() : null
      }));

      console.log('Submitting return with items:', updatedItems);

      // Entferne /api vom Ende der URL, falls vorhanden
      const baseUrl = API_URL.endsWith('/api') ? API_URL.slice(0, -4) : API_URL;
      
      // Aktualisiere die Buchung
      const response = await axios.put(`${baseUrl}/api/bookings/${booking._id}/return`, {
        items: updatedItems
      });

      console.log('Booking update response:', response.data);

      // Aktualisiere die Verfügbarkeit für jedes zurückgegebene Produkt
      const updatePromises = returnItems
        .filter(item => item.isReturned)
        .map(item => updateProductAvailability(
          item.productId._id, 
          true,
          item.startDate,
          item.endDate
        ));

      await Promise.all(updatePromises);

      setSuccess(true);
      if (onBookingUpdated) {
        onBookingUpdated(response.data);
      }
    } catch (err) {
      console.error('Error in handleSubmit:', err);
      setError('Fehler beim Aktualisieren der Rückgabe. Bitte versuchen Sie es erneut.');
    }
  };

  const allItemsReturned = returnItems.every(item => item.isReturned);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Rückgabe prüfen
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Rückgabe erfolgreich aktualisiert
          </Alert>
        )}

        <Grid container spacing={2}>
          {returnItems.map((item, index) => (
            <Grid item xs={12} key={item._id}>
              <Box
                sx={{
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                  p: 2
                }}
              >
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Checkbox
                        checked={item.isReturned}
                        onChange={() => handleReturnToggle(index)}
                        color="success"
                      />
                      <Box>
                        <Typography variant="subtitle1" component="div">
                          {item.productId.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" component="div">
                          Menge: {item.quantity}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Anmerkungen zur Rückgabe"
                      variant="outlined"
                      size="small"
                      value={item.notes}
                      onChange={(e) => handleNotesChange(index, e.target.value)}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary" component="div">
            {allItemsReturned ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircleIcon color="success" />
                Alle Produkte zurückgegeben
              </Box>
            ) : (
              'Noch nicht alle Produkte zurückgegeben'
            )}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={returnItems.length === 0}
          >
            Rückgabe speichern
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
} 