import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Typography,
  Box,
  FormControlLabel,
  Divider
} from '@mui/material';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

const ReturnDialog = ({ open, onClose, booking, onSave }) => {
  const [returnItems, setReturnItems] = useState(
    booking?.items.map(item => ({
      product: item.product._id,
      isReturned: item.returnStatus === 'returned',
      returnDate: new Date()
    })) || []
  );

  const handleToggle = (index) => {
    const newItems = [...returnItems];
    newItems[index] = { 
      ...newItems[index], 
      isReturned: !newItems[index].isReturned,
      returnDate: new Date()
    };
    setReturnItems(newItems);
  };

  const handleSave = () => {
    const formattedItems = returnItems.map(item => ({
      product: item.product,
      returnStatus: item.isReturned ? 'returned' : 'pending',
      returnDate: item.isReturned ? item.returnDate : null
    }));
    onSave(formattedItems);
    onClose();
  };

  const allReturned = returnItems.every(item => item.isReturned);

  if (!booking) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6">
          Rückgabe erfassen
        </Typography>
        <Typography variant="subtitle2" color="text.secondary">
          {booking.customerName}
        </Typography>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <List>
          {booking.items.map((item, index) => (
            <ListItem key={item.product._id} divider>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={returnItems[index].isReturned}
                    onChange={() => handleToggle(index)}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body1">
                      {item.product.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Menge: {item.quantity}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Abbrechen</Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          color="primary"
          disabled={!allReturned}
        >
          {allReturned ? 'Rückgabe bestätigen' : 'Alle Artikel müssen zurückgegeben sein'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReturnDialog; 