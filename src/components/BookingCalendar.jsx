import React from 'react';
import { Paper, Box } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { useDispatch } from 'react-redux';
import { setBookingDates } from '../store/bookingSlice';

export default function BookingCalendar() {
  const dispatch = useDispatch();

  const handleStartDateChange = (date) => {
    dispatch(setBookingDates({ startDate: date }));
  };

  const handleEndDateChange = (date) => {
    dispatch(setBookingDates({ endDate: date }));
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <DateTimePicker
          label="Startdatum"
          onChange={handleStartDateChange}
          slotProps={{
            textField: {
              fullWidth: true,
            },
          }}
        />
        <DateTimePicker
          label="Enddatum"
          onChange={handleEndDateChange}
          slotProps={{
            textField: {
              fullWidth: true,
            },
          }}
        />
      </Box>
    </Paper>
  );
} 