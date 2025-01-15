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
  IconButton
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { removeFromCart } from '../store/cartSlice';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

export default function Cart() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  const handleRemoveFromCart = (itemId) => {
    dispatch(removeFromCart(itemId));
  };

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Container 
        maxWidth="xl"
        sx={{ 
          maxWidth: '1400px !important',
          margin: '0 auto',
          width: '100%',
          px: { xs: 2, sm: 3, md: 4 }
        }}
      >
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom
          sx={{ 
            mb: { xs: 3, sm: 4 },
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
            fontWeight: 600
          }}
        >
          Warenkorb
        </Typography>

        {cartItems.length === 0 ? (
          <Paper 
            sx={{ 
              p: { xs: 3, sm: 4 },
              textAlign: 'center',
              borderRadius: 2
            }}
          >
            <Typography variant="h6" color="text.secondary">
              Ihr Warenkorb ist leer
            </Typography>
          </Paper>
        ) : (
          <>
            <TableContainer 
              component={Paper}
              sx={{ 
                mb: { xs: 3, sm: 4 },
                borderRadius: 2,
                overflow: 'hidden'
              }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Ausrüstung</TableCell>
                    <TableCell>Startdatum</TableCell>
                    <TableCell>Enddatum</TableCell>
                    <TableCell align="right">Aktionen</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cartItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.equipment.name}</TableCell>
                      <TableCell>
                        {format(new Date(item.startDate), 'PPpp', { locale: de })}
                      </TableCell>
                      <TableCell>
                        {format(new Date(item.endDate), 'PPpp', { locale: de })}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          onClick={() => handleRemoveFromCart(item.id)}
                          color="error"
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                variant="contained" 
                color="primary"
                size="large"
                sx={{ 
                  px: { xs: 3, sm: 4 },
                  py: { xs: 1, sm: 1.5 }
                }}
              >
                Zur Kasse
              </Button>
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
} 