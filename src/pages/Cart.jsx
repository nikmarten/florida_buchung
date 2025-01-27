import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Grid
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { removeFromCart } from '../store/cartSlice';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const navigate = useNavigate();

  const handleRemoveFromCart = (itemId) => {
    dispatch(removeFromCart(itemId));
  };

  const formatDate = (date) => {
    return format(new Date(date), 'PPpp', { locale: de });
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: { xs: 2, sm: 4 }, mb: { xs: 4, sm: 8 } }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Warenkorb
        </Typography>

        {cartItems.length === 0 ? (
          <Paper sx={{ p: { xs: 2, sm: 3 }, mt: 3 }}>
            <Typography>Dein Warenkorb ist leer.</Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/booking')}
              sx={{ mt: 2 }}
            >
              Zurück zur Buchung
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: { xs: 2, sm: 3 }, mb: { xs: 2, sm: 3 } }}>
                {cartItems.map((item) => (
                  <Box
                    key={item.id}
                    sx={{
                      py: 2,
                      display: 'flex',
                      flexDirection: { xs: 'column', sm: 'row' },
                      alignItems: { xs: 'flex-start', sm: 'center' },
                      gap: { xs: 2, sm: 3 },
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      '&:last-child': { borderBottom: 0 }
                    }}
                  >
                    <Box
                      component="img"
                      src={item.equipment.imageUrl || 'https://via.placeholder.com/200'}
                      alt={item.equipment.name}
                      sx={{
                        width: { xs: '100%', sm: 150 },
                        height: { xs: 200, sm: 100 },
                        objectFit: 'cover',
                        borderRadius: 1
                      }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" gutterBottom>
                        {item.equipment.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Zeitraum: {formatDate(item.startDate)} - {formatDate(item.endDate)}
                      </Typography>
                    </Box>
                    <Box sx={{ 
                      display: 'flex',
                      flexDirection: { xs: 'row', sm: 'column' },
                      gap: 1,
                      width: { xs: '100%', sm: 'auto' }
                    }}>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleRemoveFromCart(item.id)}
                        fullWidth
                        size="small"
                      >
                        Entfernen
                      </Button>
                    </Box>
                  </Box>
                ))}
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper 
                sx={{ 
                  p: { xs: 2, sm: 3 },
                  position: { md: 'sticky' },
                  top: 24
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Zusammenfassung
                </Typography>
                <Typography gutterBottom>
                  Anzahl Produkte: {cartItems.length}
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={() => navigate('/checkout')}
                  sx={{ mt: 2 }}
                >
                  Zur Kasse
                </Button>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Box>
    </Container>
  );
} 