import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Grid, TextField, FormControl, Select, MenuItem, Typography, Card, CardContent, CardMedia, Button, Alert, InputLabel } from '@mui/material';
import { addToCart } from '../store/cartSlice';
import { fetchProducts } from '../store/productSlice';
import { fetchCategories } from '../store/categorySlice';
import { fetchBookings } from '../store/bookingSlice';
import { parseISO, isWithinInterval, isSameDay, format } from 'date-fns';
import { de } from 'date-fns/locale';

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
  const [quantities, setQuantities] = useState({});

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

  const handleQuantityChange = (equipmentId, value) => {
    const numValue = parseInt(value);
    const equipment = products.find(p => p._id === equipmentId);
    if (equipment && numValue > 0 && isProductAvailable(equipmentId, numValue)) {
      setQuantities(prev => ({
        ...prev,
        [equipmentId]: numValue
      }));
    }
  };

  const isProductAvailable = (productId, requestedQuantity = 1) => {
    if (!startDate || !endDate || !bookings) return true;

    const product = products.find(p => p._id === productId);
    if (!product) return false;

    // Finde alle relevanten Buchungen für dieses Produkt
    const relevantBookings = bookings.filter(booking => 
      booking.status !== 'cancelled' && 
      booking.status !== 'completed' &&
      booking.items.some(item => item.product._id === productId)
    );

    let totalBookedQuantity = 0;

    // Prüfe jede Buchung auf Überschneidung
    relevantBookings.forEach(booking => {
      booking.items.forEach(item => {
        if (item.product._id === productId) {
          const bookedStart = new Date(item.startDate);
          const bookedEnd = new Date(item.endDate);
          const desiredStart = new Date(startDate);
          const desiredEnd = new Date(endDate);

          // Wenn sich die Zeiträume überschneiden
          if (
            isWithinInterval(desiredStart, { start: bookedStart, end: bookedEnd }) ||
            isWithinInterval(desiredEnd, { start: bookedStart, end: bookedEnd }) ||
            isWithinInterval(bookedStart, { start: desiredStart, end: desiredEnd }) ||
            isSameDay(desiredStart, bookedStart) ||
            isSameDay(desiredEnd, bookedEnd)
          ) {
            totalBookedQuantity += item.quantity;
          }
        }
      });
    });

    // Prüfe ob genügend Produkte verfügbar sind
    return (product.quantity - totalBookedQuantity) >= requestedQuantity;
  };

  const getAvailabilityInfo = (equipment) => {
    if (!startDate || !endDate) return null;

    // Finde alle relevanten Buchungen für dieses Produkt
    const relevantBookings = bookings.filter(booking => 
      booking.status !== 'cancelled' && 
      booking.status !== 'completed' &&
      booking.items.some(item => item.product._id === equipment._id)
    );

    let totalBookedQuantity = 0;
    const bookingInfo = [];

    // Prüfe jede Buchung auf Überschneidung
    relevantBookings.forEach(booking => {
      booking.items.forEach(item => {
        if (item.product._id === equipment._id) {
          const bookedStart = new Date(item.startDate);
          const bookedEnd = new Date(item.endDate);
          const desiredStart = new Date(startDate);
          const desiredEnd = new Date(endDate);

          if (
            isWithinInterval(desiredStart, { start: bookedStart, end: bookedEnd }) ||
            isWithinInterval(desiredEnd, { start: bookedStart, end: bookedEnd }) ||
            isWithinInterval(bookedStart, { start: desiredStart, end: desiredEnd }) ||
            isSameDay(desiredStart, bookedStart) ||
            isSameDay(desiredEnd, bookedEnd)
          ) {
            totalBookedQuantity += item.quantity;
            bookingInfo.push({
              customerName: booking.customerName,
              quantity: item.quantity,
              startDate: item.startDate,
              endDate: item.endDate
            });
          }
        }
      });
    });

    return {
      isAvailable: (equipment.quantity - totalBookedQuantity) >= 1,
      remainingQuantity: equipment.quantity - totalBookedQuantity,
      bookingInfo
    };
  };

  // Filtere und sortiere die Produkte
  const filteredAndSortedProducts = [...products]
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'ALL' || 
                            (product.category && product.category._id === selectedCategory);
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

  const allCategories = [
    { _id: 'ALL', label: 'Alle Kategorien' }, 
    ...(categories || [])
  ];
  const isTimeRangeSelected = startDate && endDate;

  const handleAddToCart = (equipment) => {
    dispatch(addToCart({
      productId: equipment._id,
      productName: equipment.name,
      productDescription: equipment.description,
      productImageUrl: equipment.imageUrl,
      startDate,
      endDate,
      quantity: quantities[equipment._id] || 1
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
          <InputLabel>Kategorie</InputLabel>
          <Select
            value={selectedCategory}
            onChange={handleCategoryChange}
            label="Kategorie"
          >
            {allCategories.map((category) => (
              <MenuItem key={category._id} value={category._id}>
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
            <MenuItem key="popularity" value="popularity">Nach Beliebtheit</MenuItem>
            <MenuItem key="alphabetical" value="alphabetical">Alphabetisch</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {filteredAndSortedProducts?.length === 0 ? (
        <Alert severity="info">Keine Produkte gefunden.</Alert>
      ) : (
        <Grid container spacing={2}>
          {filteredAndSortedProducts?.map((equipment) => {
            const availabilityInfo = getAvailabilityInfo(equipment);
            const available = availabilityInfo?.isAvailable ?? true;
            const availableQuantity = availabilityInfo?.remainingQuantity ?? equipment.quantity;

            return (
              <Grid item key={equipment._id} xs={12} sm={6} md={3}>
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
                    height="160"
                    image={equipment.imageUrl || 'https://via.placeholder.com/200'}
                    alt={equipment.name}
                  />
                  <CardContent sx={{ 
                    flexGrow: 1, 
                    display: 'flex', 
                    flexDirection: 'column',
                    p: 2
                  }}>
                    <Typography gutterBottom variant="h6" component="h2" sx={{ fontSize: '1.1rem' }}>
                      {equipment.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, fontSize: '0.875rem' }}>
                      {equipment.description}
                    </Typography>
                    
                    {isTimeRangeSelected && (
                      <Box sx={{ mb: 1.5 }}>
                        {available ? (
                          <Alert severity="success" icon={false} sx={{ py: 0.5 }}>
                            Im gewählten Zeitraum verfügbar
                          </Alert>
                        ) : (
                          <Alert severity="error" icon={false} sx={{ py: 0.5 }}>
                            Im gewählten Zeitraum nicht verfügbar
                            {availabilityInfo?.bookingInfo?.map((info, index) => (
                              <Typography key={index} variant="body2" sx={{ mt: 0.5, fontSize: '0.8rem' }}>
                                Gebucht von: {info.customerName} ({info.quantity} Stück)
                                <br />
                                {format(new Date(info.startDate), 'dd.MM.yyyy', { locale: de })} - {format(new Date(info.endDate), 'dd.MM.yyyy', { locale: de })}
                              </Typography>
                            ))}
                          </Alert>
                        )}
                      </Box>
                    )}
                    
                    <Box sx={{ mt: 'auto' }}>
                      {isTimeRangeSelected && available && (
                        <TextField
                          fullWidth
                          label="Menge"
                          type="number"
                          value={quantities[equipment._id] || 1}
                          onChange={(e) => handleQuantityChange(equipment._id, e.target.value)}
                          sx={{ mb: 1.5 }}
                          size="small"
                          InputProps={{
                            inputProps: { 
                              min: 1, 
                              max: availableQuantity 
                            }
                          }}
                          helperText={isTimeRangeSelected 
                            ? `Verfügbar im gewählten Zeitraum: ${availableQuantity} Stück`
                            : 'Bitte wählen Sie zuerst einen Zeitraum'}
                        />
                      )}
                      <Button
                        fullWidth
                        variant={isTimeRangeSelected ? "contained" : "outlined"}
                        color="primary"
                        onClick={() => handleAddToCart(equipment)}
                        disabled={!isTimeRangeSelected || !available}
                        size="small"
                      >
                        {!isTimeRangeSelected 
                          ? "Zeitraum auswählen"
                          : available 
                            ? "In den Warenkorb" 
                            : "Nicht verfügbar"}
                      </Button>
                    </Box>
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