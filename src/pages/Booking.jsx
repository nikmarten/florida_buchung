import React, { useState, useMemo } from 'react';
import { Box, Grid, Container, Paper, Typography, Alert, Snackbar } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { useDispatch, useSelector } from 'react-redux';
import { setStartDate, setEndDate } from '../store/bookingSlice';
import EquipmentList from '../components/EquipmentList';

export default function Booking() {
  const dispatch = useDispatch();
  const startDateISO = useSelector((state) => state.bookings.startDate);
  const endDateISO = useSelector((state) => state.bookings.endDate);
  
  const startDate = useMemo(() => 
    startDateISO ? new Date(startDateISO) : null, 
    [startDateISO]
  );
  
  const endDate = useMemo(() => 
    endDateISO ? new Date(endDateISO) : null, 
    [endDateISO]
  );
  
  const [error, setError] = useState('');

  const handleStartDateChange = (newValue) => {
    if (newValue) {
      const date = new Date(newValue);
      date.setHours(0, 0, 0, 0);
      dispatch(setStartDate(date.toISOString()));
      
      // Wenn ein Enddatum existiert und vor dem neuen Startdatum liegt
      if (endDate && endDate < date) {
        dispatch(setEndDate(null));
        setError('Das Enddatum muss nach dem Startdatum liegen.');
      }
    } else {
      dispatch(setStartDate(null));
    }
  };

  const handleEndDateChange = (newValue) => {
    if (newValue) {
      const date = new Date(newValue);
      date.setHours(23, 59, 59, 999);
      
      // Überprüfe, ob das Enddatum nach dem Startdatum liegt
      if (startDate && date <= startDate) {
        setError('Das Enddatum muss nach dem Startdatum liegen.');
        return;
      }
      
      dispatch(setEndDate(date.toISOString()));
    } else {
      dispatch(setEndDate(null));
    }
  };

  const handleCloseError = () => {
    setError('');
  };

  return (
    <Box>
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {/* Zeitauswahl */}
          <Grid item xs={12} md={3}>
            <Paper 
              elevation={0}
              sx={{ 
                p: { xs: 2, sm: 3 },
                borderRadius: 2,
                backgroundColor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                position: { md: 'sticky' },
                top: { md: 24 }
              }}
            >
              <Typography variant="h6" gutterBottom>
                Zeitraum auswählen
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <DatePicker
                  label="Von"
                  value={startDate}
                  onChange={handleStartDateChange}
                  slotProps={{
                    textField: { 
                      fullWidth: true,
                      size: "small"
                    },
                  }}
                  disablePast
                  format="dd.MM.yyyy"
                  views={['year', 'month', 'day']}
                />
                <DatePicker
                  label="Bis"
                  value={endDate}
                  onChange={handleEndDateChange}
                  slotProps={{
                    textField: { 
                      fullWidth: true,
                      size: "small"
                    },
                  }}
                  minDate={startDate || undefined}
                  disablePast
                  format="dd.MM.yyyy"
                  views={['year', 'month', 'day']}
                />
              </Box>
            </Paper>
          </Grid>
          
          {/* Equipment Liste */}
          <Grid item xs={12} md={9}>
            <EquipmentList />
          </Grid>
        </Grid>
      </Container>

      {/* Fehlermeldung */}
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseError} 
          severity="error" 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
} 