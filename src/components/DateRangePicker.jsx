import React, { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Grid, Alert, Snackbar } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { setStartDate, setEndDate } from '../store/bookingSlice';

export default function DateRangePicker() {
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
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <DatePicker
            label="Von"
            value={startDate}
            onChange={handleStartDateChange}
            slotProps={{
              textField: { 
                fullWidth: true,
                size: "medium",
                sx: {
                  backgroundColor: 'background.paper',
                  borderRadius: 1,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'transparent',
                    },
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }
              },
            }}
            disablePast
            format="dd.MM.yyyy"
            views={['year', 'month', 'day']}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <DatePicker
            label="Bis"
            value={endDate}
            onChange={handleEndDateChange}
            slotProps={{
              textField: { 
                fullWidth: true,
                size: "medium",
                sx: {
                  backgroundColor: 'background.paper',
                  borderRadius: 1,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'transparent',
                    },
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }
              },
            }}
            minDate={startDate || undefined}
            disablePast
            format="dd.MM.yyyy"
            views={['year', 'month', 'day']}
          />
        </Grid>
      </Grid>

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
    </>
  );
} 