import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Stack
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { removeFromCart } from '../store/cartSlice';

export default function Cart({ open, onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);

  const handleRemoveFromCart = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const handleCheckout = () => {
    navigate('/checkout');
    onClose();
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
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">
            Warenkorb ({cartItems.length})
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        {cartItems.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" gutterBottom>
              Ihr Warenkorb ist leer.
            </Typography>
            <Button
              variant="contained"
              onClick={() => {
                onClose();
                navigate('/');
              }}
              sx={{ mt: 2 }}
            >
              Zurück zur Ausrüstung
            </Button>
          </Box>
        ) : (
          <>
            <List sx={{ mb: 2 }}>
              {cartItems.map((item) => (
                <React.Fragment key={item.productId}>
                  <ListItem
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      py: 2
                    }}
                  >
                    <Box sx={{ display: 'flex', width: '100%', mb: 1 }}>
                      {item.productImageUrl && (
                        <Box
                          component="img"
                          src={item.productImageUrl}
                          alt={item.productName}
                          sx={{
                            width: 60,
                            height: 60,
                            objectFit: 'cover',
                            borderRadius: 1,
                            mr: 2
                          }}
                        />
                      )}
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle1">
                          {item.productName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.productDescription}
                        </Typography>
                      </Box>
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          onClick={() => handleRemoveFromCart(item.productId)}
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Von: {new Date(item.startDate).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Bis: {new Date(item.endDate).toLocaleDateString()}
                    </Typography>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>

            <Stack spacing={2} sx={{ mt: 'auto' }}>
              <Button
                variant="contained"
                fullWidth
                onClick={handleCheckout}
                disabled={cartItems.length === 0}
              >
                Zur Kasse
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={onClose}
              >
                Weiter einkaufen
              </Button>
            </Stack>
          </>
        )}
      </Box>
    </Drawer>
  );
} 