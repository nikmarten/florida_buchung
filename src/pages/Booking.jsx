import React from 'react';
import { Box, Grid, Container, Paper, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { useDispatch, useSelector } from 'react-redux';
import { setStartDate, setEndDate } from '../store/bookingSlice';
import EquipmentList from '../components/EquipmentList';

export default function Booking() {
  const dispatch = useDispatch();
  const { startDate, endDate } = useSelector((state) => state.booking);

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
                  onChange={(newValue) => {
                    if (newValue) {
                      const date = new Date(newValue);
                      date.setHours(0, 0, 0, 0);
                      dispatch(setStartDate(date));
                    } else {
                      dispatch(setStartDate(null));
                    }
                  }}
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
                  onChange={(newValue) => {
                    if (newValue) {
                      const date = new Date(newValue);
                      date.setHours(23, 59, 59, 999);
                      dispatch(setEndDate(date));
                    } else {
                      dispatch(setEndDate(null));
                    }
                  }}
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
    </Box>
  );
} 