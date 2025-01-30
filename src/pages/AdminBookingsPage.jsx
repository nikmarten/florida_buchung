import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Paper,
  Typography,
  Box,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  IconButton,
  Divider,
  Stack
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import RefreshIcon from '@mui/icons-material/Refresh';
import { fetchBookings } from '../store/bookingSlice';
import BookingList from '../components/BookingList';

const AdminBookingsPage = () => {
  const dispatch = useDispatch();
  const bookings = useSelector((state) => state.bookings.items);
  const status = useSelector((state) => state.bookings.status);
  const [tabValue, setTabValue] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBookings, setFilteredBookings] = useState([]);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchBookings());
    }
  }, [status, dispatch]);

  useEffect(() => {
    let filtered = [...bookings];

    // Filter by tab
    if (tabValue !== 'all') {
      filtered = filtered.filter(booking => booking.status === tabValue);
    }

    // Filter by search
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(booking => 
        booking.customerName.toLowerCase().includes(search) ||
        booking.customerEmail.toLowerCase().includes(search) ||
        booking._id.toLowerCase().includes(search) ||
        booking.items.some(item => 
          item.product.name.toLowerCase().includes(search)
        )
      );
    }

    setFilteredBookings(filtered);
  }, [bookings, tabValue, searchTerm]);

  const handleRefresh = () => {
    dispatch(fetchBookings());
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Buchungsverwaltung
          </Typography>
          <IconButton onClick={handleRefresh} title="Aktualisieren">
            <RefreshIcon />
          </IconButton>
        </Box>

        {/* Search and Filter Bar */}
        <Stack 
          direction="row" 
          spacing={2} 
          alignItems="center" 
          sx={{ mb: 3 }}
        >
          <TextField
            placeholder="Suche nach Kunde, Produkt oder Buchungsnummer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flexGrow: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
          />
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Stack>

        {/* Status Tabs */}
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{ mb: 3 }}
        >
          <Tab label="Alle" value="all" />
          <Tab label="Ausstehend" value="pending" />
          <Tab label="Bestätigt" value="confirmed" />
          <Tab label="Abgeschlossen" value="completed" />
          <Tab label="Storniert" value="cancelled" />
        </Tabs>

        <Divider sx={{ mb: 3 }} />

        {/* Bookings List */}
        {status === 'loading' ? (
          <Typography>Lade Buchungen...</Typography>
        ) : status === 'failed' ? (
          <Typography color="error">
            Fehler beim Laden der Buchungen. Bitte versuchen Sie es später erneut.
          </Typography>
        ) : (
          <BookingList bookings={filteredBookings} />
        )}
      </Paper>
    </Container>
  );
};

export default AdminBookingsPage; 