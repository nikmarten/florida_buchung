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
  Stack,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Grid,
  Chip,
  Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { fetchBookings } from '../store/bookingSlice';
import BookingList from '../components/BookingList';

const AdminBookingsPage = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'confirmed': return 'success';
      case 'completed': return 'info';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending': return 'Ausstehend';
      case 'confirmed': return 'Bestätigt';
      case 'completed': return 'Abgeschlossen';
      case 'cancelled': return 'Storniert';
      default: return status;
    }
  };

  // Mobile Buchungskarte
  const BookingCard = ({ booking }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h6" component="h3">
              {booking.customerName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {booking.customerEmail}
            </Typography>
          </Box>
          <Chip
            label={getStatusLabel(booking.status)}
            color={getStatusColor(booking.status)}
            size="small"
          />
        </Box>

        <Typography variant="subtitle2" gutterBottom>
          Gebuchte Produkte:
        </Typography>
        {booking.items.map((item, index) => (
          <Box key={index} sx={{ mb: 1 }}>
            <Typography variant="body2">
              {item.product.name} (x{item.quantity})
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {format(new Date(item.startDate), 'dd.MM.yyyy', { locale: de })} - {format(new Date(item.endDate), 'dd.MM.yyyy', { locale: de })}
            </Typography>
          </Box>
        ))}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 1 }}>
          <IconButton size="small">
            <EditIcon />
          </IconButton>
          <IconButton size="small" color="error">
            <DeleteIcon />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: { xs: 2, sm: 3 },
          flexDirection: isMobile ? 'column' : 'row',
          gap: 2
        }}>
          <Typography variant="h5" component="h1" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
            Buchungsverwaltung
          </Typography>
          <IconButton onClick={handleRefresh} title="Aktualisieren">
            <RefreshIcon />
          </IconButton>
        </Box>

        {/* Search and Filter Bar */}
        <Stack 
          direction={isMobile ? "column" : "row"} 
          spacing={2} 
          alignItems={isMobile ? "stretch" : "center"} 
          sx={{ mb: { xs: 2, sm: 3 } }}
        >
          <TextField
            placeholder={isMobile ? "Suchen..." : "Suche nach Kunde, Produkt oder Buchungsnummer..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flexGrow: 1 }}
            size={isMobile ? "small" : "medium"}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
          />
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            size={isMobile ? "small" : "medium"}
            sx={{ minWidth: isMobile ? '100%' : 'auto' }}
          >
            Filter
          </Button>
        </Stack>

        {/* Status Tabs - Scrollable auf Mobile */}
        <Box sx={{ 
          borderBottom: 1, 
          borderColor: 'divider',
          mb: { xs: 2, sm: 3 },
          mx: { xs: -2, sm: -3 },
          px: { xs: 2, sm: 3 }
        }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              '.MuiTab-root': {
                minWidth: { xs: 'auto', sm: 160 },
                px: { xs: 1, sm: 2 },
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }
            }}
          >
            <Tab label="Alle" value="all" />
            <Tab label="Ausstehend" value="pending" />
            <Tab label="Bestätigt" value="confirmed" />
            <Tab label="Abgeschlossen" value="completed" />
            <Tab label="Storniert" value="cancelled" />
          </Tabs>
        </Box>

        {/* Bookings List */}
        {status === 'loading' ? (
          <Typography>Lade Buchungen...</Typography>
        ) : status === 'failed' ? (
          <Typography color="error">
            Fehler beim Laden der Buchungen. Bitte versuchen Sie es später erneut.
          </Typography>
        ) : isMobile ? (
          // Mobile Ansicht: Grid mit Karten
          <Grid container spacing={2} sx={{ mx: -1 }}>
            {filteredBookings.map((booking) => (
              <Grid item xs={12} key={booking._id}>
                <BookingCard booking={booking} />
              </Grid>
            ))}
          </Grid>
        ) : (
          // Desktop Ansicht: Standard BookingList
          <BookingList bookings={filteredBookings} />
        )}
      </Paper>
    </Box>
  );
};

export default AdminBookingsPage; 