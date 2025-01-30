import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  Container,
  Button,
  useTheme
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import CheckoutForm from '../components/CheckoutForm';

export default function Checkout() {
  const theme = useTheme();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return format(date, 'dd.MM.yyyy', { locale: de });
  };

  if (cartItems.length === 0) {
    return (
      <Container maxWidth="md">
        <Box sx={{ 
          py: 8,
          textAlign: 'center',
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 3
        }}>
          <ShoppingCartIcon sx={{ fontSize: 60, color: 'text.secondary' }} />
          <Typography variant="h4" gutterBottom>
            Ihr Warenkorb ist leer
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Bitte fügen Sie Produkte zu Ihrem Warenkorb hinzu, bevor Sie zur Kasse gehen.
          </Typography>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/booking')}
          >
            Zurück zur Buchung
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 'bold',
              color: 'primary.main'
            }}
          >
            Buchung abschließen
          </Typography>
          <Typography 
            variant="subtitle1" 
            color="text.secondary"
            sx={{ maxWidth: 600, mx: 'auto' }}
          >
            Überprüfen Sie Ihre Auswahl und geben Sie Ihre Kontaktdaten ein, 
            um die Buchung abzuschließen.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Produktübersicht */}
          <Grid item xs={12} md={7}>
            <Card 
              elevation={3}
              sx={{ 
                height: '100%',
                background: theme.palette.mode === 'dark' 
                  ? 'linear-gradient(45deg, #1a237e 30%, #283593 90%)'
                  : 'linear-gradient(45deg, #e3f2fd 30%, #bbdefb 90%)',
              }}
            >
              <CardContent>
                <Typography 
                  variant="h6" 
                  gutterBottom
                  sx={{ 
                    color: theme.palette.mode === 'dark' ? 'white' : 'primary.main',
                    borderBottom: '2px solid',
                    borderColor: 'primary.main',
                    pb: 1,
                    mb: 3
                  }}
                >
                  Ausgewählte Produkte
                </Typography>
                <Paper sx={{ p: 2, backgroundColor: 'background.paper' }}>
                  <List>
                    {cartItems.map((item) => (
                      <React.Fragment key={`${item.productId}-${item.startDate}-${item.endDate}`}>
                        <ListItem>
                          <Box sx={{ width: '100%' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="subtitle1">
                                {item.productName}
                              </Typography>
                              <Typography 
                                variant="body2" 
                                component="span"
                                sx={{ 
                                  backgroundColor: 'primary.main', 
                                  color: 'primary.contrastText',
                                  px: 1,
                                  py: 0.5,
                                  borderRadius: 1,
                                  fontSize: '0.75rem'
                                }}
                              >
                                {item.quantity}x
                              </Typography>
                            </Box>
                            <Box sx={{ mt: 1 }}>
                              <Typography variant="body2" color="text.secondary">
                                {item.productDescription}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Zeitraum: {formatDate(item.startDate)} - {formatDate(item.endDate)}
                              </Typography>
                            </Box>
                          </Box>
                        </ListItem>
                        <Divider />
                      </React.Fragment>
                    ))}
                  </List>
                </Paper>
              </CardContent>
            </Card>
          </Grid>

          {/* Buchungsformular */}
          <Grid item xs={12} md={5}>
            <Paper 
              elevation={3}
              sx={{ 
                p: 3,
                height: '100%',
                backgroundColor: 'background.paper'
              }}
            >
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{ 
                  borderBottom: '2px solid',
                  borderColor: 'primary.main',
                  pb: 1,
                  mb: 3
                }}
              >
                Ihre Kontaktdaten
              </Typography>
              <CheckoutForm cartItems={cartItems} />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
} 