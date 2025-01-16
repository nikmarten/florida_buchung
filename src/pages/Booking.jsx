import React, { useState } from 'react';
import { Box, Grid, Container, Paper, Typography, Alert, Snackbar } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { useDispatch, useSelector } from 'react-redux';
import { setStartDate, setEndDate } from '../store/bookingSlice';
import EquipmentList from '../components/EquipmentList';

export default function Booking() {
  const dispatch = useDispatch();
  const { startDate, endDate } = useSelector((state) => ({
    startDate: state.bookings.startDate ? new Date(state.bookings.startDate) : null,
    endDate: state.bookings.endDate ? new Date(state.bookings.endDate) : null,
  }));
  const [error, setError] = useState('');

  const handleStartDateChange = (newValue) => {
    if (newValue) {
      const date = new Date(newValue);
      date.setHours(0, 0, 0, 0);
      dispatch(setStartDate(date));
      
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
      
      dispatch(setEndDate(date));
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
          <Grid item xs={12} md={3}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 3,
                borderRadius: 2,
                backgroundColor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider'
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
                    textField: { fullWidth: true },
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
                    textField: { fullWidth: true },
                  }}
                  minDate={startDate || undefined}
                  disablePast
                  format="dd.MM.yyyy"
                  views={['year', 'month', 'day']}
                />
              </Box>
            </Paper>
          </Grid>
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