import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  useTheme,
  useMediaQuery
} from '@mui/material';
import DateRangePicker from '../components/DateRangePicker';
import EquipmentList from '../components/EquipmentList';

export default function Booking() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        {/* Header Section */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 'bold',
              color: 'primary.main',
              mb: 2
            }}
          >
            Equipment Buchung
          </Typography>
          <Typography 
            variant="subtitle1" 
            color="text.secondary"
            sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}
          >
            Wählen Sie den gewünschten Zeitraum und die Menge für Ihre Buchung. 
            Unsere Verfügbarkeitsprüfung zeigt Ihnen sofort, ob die gewünschten Produkte verfügbar sind.
          </Typography>
        </Box>

        {/* Date Picker Section */}
        <Paper 
          elevation={3} 
          sx={{ 
            p: 3, 
            mb: 4,
            background: theme.palette.mode === 'dark' 
              ? 'linear-gradient(45deg, #1a237e 30%, #283593 90%)'
              : 'linear-gradient(45deg, #e3f2fd 30%, #bbdefb 90%)',
          }}
        >
          <Grid container spacing={2} alignItems="center" justifyContent="center">
            <Grid item xs={12} md={8}>
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{ 
                  textAlign: { xs: 'center', md: 'left' },
                  color: theme.palette.mode === 'dark' ? 'white' : 'primary.main'
                }}
              >
                Zeitraum auswählen
              </Typography>
              <DateRangePicker />
            </Grid>
          </Grid>
        </Paper>

        {/* Equipment List Section */}
        <Box sx={{ 
          backgroundColor: theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.05)' 
            : 'rgba(0, 0, 0, 0.02)',
          borderRadius: 2,
          p: { xs: 2, md: 3 }
        }}>
          <EquipmentList />
        </Box>
      </Box>
    </Container>
  );
} 