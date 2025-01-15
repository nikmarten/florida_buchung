import React from 'react';
import { Container, Typography, Grid, Box } from '@mui/material';
import BookingCalendar from '../components/BookingCalendar';
import EquipmentList from '../components/EquipmentList';

export default function Booking() {
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
          Ausrüstung buchen
        </Typography>
        
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
          <Grid item xs={12} md={4}>
            <BookingCalendar />
          </Grid>
          <Grid item xs={12} md={8}>
            <EquipmentList />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
} 