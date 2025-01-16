import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Grid, TextField, FormControl, Select, MenuItem, Typography, Card, CardContent, CardMedia, Button, Alert } from '@mui/material';
import { addToCart } from '../store/cartSlice';
import { fetchProducts } from '../store/productSlice';
import { fetchCategories } from '../store/categorySlice';
import { fetchBookings } from '../store/bookingSlice';
import { parseISO, isWithinInterval, isSameDay } from 'date-fns';

export default function EquipmentList() {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const { items: products, status: productsStatus, error: productsError } = useSelector((state) => state.products);
  const { items: categories, status: categoriesStatus } = useSelector((state) => state.categories);
  const { items: bookings } = useSelector((state) => state.bookings);
  const { startDate, endDate } = useSelector((state) => state.bookings);

  useEffect(() => {
    if (productsStatus === 'idle') {
      dispatch(fetchProducts());
    }
    if (categoriesStatus === 'idle') {
      dispatch(fetchCategories());
    }
    // Lade auch die Buchungen, um die Verfügbarkeit zu prüfen
    dispatch(fetchBookings());
  }, [dispatch, productsStatus, categoriesStatus]);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Prüfe, ob ein Produkt im gewünschten Zeitraum verfügbar ist
  const isProductAvailable = (productId) => {
    if (!startDate || !endDate || !bookings) return true;

    const desiredStart = new Date(startDate);
    const desiredEnd = new Date(endDate);

    // Prüfe alle existierenden Buchungen für dieses Produkt
    const conflictingBooking = bookings.find(booking =>
      booking.items.some(item => {
        if (item.productId?._id !== productId) return false;
        
        const bookedStart = parseISO(item.startDate);
        const bookedEnd = parseISO(item.endDate);

        // Ein Konflikt besteht, wenn sich die Zeiträume überschneiden
        // oder wenn Start- oder Endtag gleich sind
        const isOverlapping = isWithinInterval(desiredStart, { start: bookedStart, end: bookedEnd }) ||
                            isWithinInterval(desiredEnd, { start: bookedStart, end: bookedEnd }) ||
                            isWithinInterval(bookedStart, { start: desiredStart, end: desiredEnd }) ||
                            isSameDay(desiredStart, bookedStart) ||
                            isSameDay(desiredEnd, bookedEnd);

        return isOverlapping;
      })
    );

    return !conflictingBooking;
  };

  const handleAddToCart = (equipment) => {
    if (!startDate || !endDate) return;
    
    if (!isProductAvailable(equipment._id)) {
      return; // Produkt ist nicht verfügbar
    }
    
    dispatch(addToCart({
      ...equipment,
      startDate: new Date(startDate),
      endDate: new Date(endDate)
    }));
  };

  const filteredProducts = products?.filter(equipment => {
    const matchesSearch = equipment.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || equipment.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const allCategories = [{ value: 'ALL', label: 'Alle Kategorien' }, ...(categories || [])];
  const isTimeRangeSelected = startDate && endDate;

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
      </Box>

      {filteredProducts?.length === 0 ? (
        <Alert severity="info">Keine Produkte gefunden.</Alert>
      ) : (
        <Grid container spacing={3}>
          {filteredProducts?.map((equipment) => {
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