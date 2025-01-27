import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Grid, TextField, FormControl, Select, MenuItem, Typography, Card, CardContent, CardMedia, Button, Alert, InputLabel } from '@mui/material';
import { addToCart } from '../store/cartSlice';
import { fetchProducts } from '../store/productSlice';
import { fetchCategories } from '../store/categorySlice';
import { fetchBookings } from '../store/bookingSlice';
import { parseISO, isWithinInterval, isSameDay } from 'date-fns';

export default function EquipmentList() {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [sortOption, setSortOption] = useState('popularity');
  const { items: products, status: productsStatus, error: productsError } = useSelector((state) => state.products);
  const { items: categories, status: categoriesStatus } = useSelector((state) => state.categories);
  const { items: bookings } = useSelector((state) => state.bookings);
  const startDate = useSelector((state) => state.bookings.startDate);
  const endDate = useSelector((state) => state.bookings.endDate);

  useEffect(() => {
    if (productsStatus === 'idle') {
      dispatch(fetchProducts());
    }
    if (categoriesStatus === 'idle') {
      dispatch(fetchCategories());
    }
    // Buchungen immer neu laden
    dispatch(fetchBookings());
  }, [dispatch, productsStatus, categoriesStatus]);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  // Prüfe, ob ein Produkt im gewünschten Zeitraum verfügbar ist
  const isProductAvailable = (productId) => {
    if (!startDate || !endDate || !bookings) return true;

    const desiredStart = new Date(startDate);
    const desiredEnd = new Date(endDate);

    const conflictingBooking = bookings.find(booking =>
      booking.items.some(item => {
        if (item.productId?._id !== productId) return false;
        
        const bookedStart = new Date(item.startDate);
        const bookedEnd = new Date(item.endDate);

        return (
          isWithinInterval(desiredStart, { start: bookedStart, end: bookedEnd }) ||
          isWithinInterval(desiredEnd, { start: bookedStart, end: bookedEnd }) ||
          isWithinInterval(bookedStart, { start: desiredStart, end: desiredEnd }) ||
          isSameDay(desiredStart, bookedStart) ||
          isSameDay(desiredEnd, bookedEnd)
        );
      })
    );

    return !conflictingBooking;
  };

  // Filtere und sortiere die Produkte
  const filteredAndSortedProducts = [...products]
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'ALL' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortOption) {
        case 'popularity':
          return (b.bookingCount || 0) - (a.bookingCount || 0);
        case 'alphabetical':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  const allCategories = [{ value: 'ALL', label: 'Alle Kategorien' }, ...(categories || [])];
  const isTimeRangeSelected = startDate && endDate;

  const handleAddToCart = (equipment) => {
    dispatch(addToCart({
      equipment,
      startDate,
      endDate
    }));
  };

  if (productsStatus === 'loading' || categoriesStatus === 'loading') {
    return <Alert severity="info">Lade Produkte...</Alert>;
  }

  if (productsError) {
    return <Alert severity="error">{productsError}</Alert>;
  }

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
        <TextField
          label="Suche"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ flexGrow: 1, maxWidth: { sm: 400 } }}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <Select
            value={selectedCategory}
            onChange={handleCategoryChange}
            displayEmpty
          >
            {allCategories.map((category) => (
              <MenuItem key={category.value} value={category.value}>
                {category.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Sortierung</InputLabel>
          <Select
            value={sortOption}
            onChange={handleSortChange}
            label="Sortierung"
          >
            <MenuItem value="popularity">Nach Beliebtheit</MenuItem>
            <MenuItem value="alphabetical">Alphabetisch</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {filteredAndSortedProducts?.length === 0 ? (
        <Alert severity="info">Keine Produkte gefunden.</Alert>
      ) : (
        <Grid container spacing={3}>
          {filteredAndSortedProducts?.map((equipment) => {
            const available = isProductAvailable(equipment._id);
            return (
              <Grid item key={equipment._id} xs={12} sm={6} md={4}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    opacity: !isTimeRangeSelected || available ? 1 : 0.7,
                    '&:hover': {
                      boxShadow: 6
                    }
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={equipment.imageUrl || 'https://via.placeholder.com/200'}
                    alt={equipment.name}
                  />
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography gutterBottom variant="h6" component="h2">
                      {equipment.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {equipment.description}
                    </Typography>
                    {isTimeRangeSelected && !available && (
                      <Alert severity="error" sx={{ mb: 2 }}>
                        Im gewählten Zeitraum nicht verfügbar
                      </Alert>
                    )}
                    <Button
                      variant={isTimeRangeSelected ? "contained" : "outlined"}
                      color="primary"
                      onClick={() => handleAddToCart(equipment)}
                      disabled={!isTimeRangeSelected || !available}
                      sx={{ mt: 'auto' }}
                    >
                      {!isTimeRangeSelected 
                        ? "Zeitraum auswählen"
                        : available 
                          ? "In den Warenkorb" 
                          : "Nicht verfügbar"}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
} 