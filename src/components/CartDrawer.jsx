import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Button,
  Divider,
  Paper
} from '@mui/material';
import { Close as CloseIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart } from '../store/cartSlice';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

export default function CartDrawer({ open, onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);

  const handleRemoveFromCart = (itemId) => {
    dispatch(removeFromCart(itemId));
  };

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: { xs: '100%', sm: 400 } }
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">Warenkorb</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        
        <Divider />
        
        {cartItems.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="text.secondary">
              Ihr Warenkorb ist leer
            </Typography>
          </Box>
        ) : (
          <>
            <List sx={{ flexGrow: 1, overflow: 'auto' }}>
              {cartItems.map((item) => (
                <ListItem
                  key={item.id}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleRemoveFromCart(item.equipment.id)}
                      size="small"
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                  sx={{ 
                    flexDirection: 'column', 
                    alignItems: 'flex-start',
                    gap: 1
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                    {item.equipment.name}
                  </Typography>
                  <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                    <div>Von: {format(new Date(item.startDate), 'PPpp', { locale: de })}</div>
                    <div>Bis: {format(new Date(item.endDate), 'PPpp', { locale: de })}</div>
                  </Box>
                </ListItem>
              ))}
            </List>
            
            <Box sx={{ p: 2 }}>
              <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Zusammenfassung
                </Typography>
                <Typography>
                  {cartItems.length} {cartItems.length === 1 ? 'Artikel' : 'Artikel'}
                </Typography>
              </Paper>
              
              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handleCheckout}
              >
                Zur Kasse
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Drawer>
  );
} 