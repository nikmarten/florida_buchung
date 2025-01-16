import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Button,
  Divider
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { removeFromCart } from '../store/cartSlice';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

export default function CartDrawer({ open, onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items) || [];

  const handleRemoveFromCart = (itemId) => {
    dispatch(removeFromCart(itemId));
  };

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return format(date, 'dd.MM.yyyy', { locale: de });
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: { xs: '100%', sm: 400 } },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Warenkorb</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {cartItems.length === 0 ? (
          <Typography>Der Warenkorb ist leer</Typography>
        ) : (
          <>
            <List>
              {cartItems.map((item) => (
                <ListItem
                  key={item.id}
                  secondaryAction={
                    <IconButton edge="end" onClick={() => handleRemoveFromCart(item.id)}>
                      <DeleteIcon />
                    </IconButton>
                  }
                  sx={{ flexDirection: 'column', alignItems: 'flex-start', gap: 1 }}
                >
                  <ListItemText
                    primary={item.name}
                    secondary={
                      <>
                        <Typography variant="body2" color="text.secondary">
                          Zeitraum: {formatDate(item.startDate)} - {formatDate(item.endDate)}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
            <Divider sx={{ my: 2 }} />
            <Button
              variant="contained"
              fullWidth
              onClick={handleCheckout}
            >
              Zur Buchung
            </Button>
          </>
        )}
      </Box>
    </Drawer>
  );
} 