import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Grid, TextField, FormControl, Select, MenuItem, Typography, Card, CardContent, CardMedia, Button, Alert } from '@mui/material';
import { addToCart } from '../store/cartSlice';
import { fetchProducts } from '../store/productSlice';
import { fetchCategories } from '../store/categorySlice';

export default function EquipmentList() {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const { items: products, status: productsStatus, error: productsError } = useSelector((state) => state.products);
  const { items: categories, status: categoriesStatus } = useSelector((state) => state.categories);
  const { startDate, endDate } = useSelector((state) => state.booking);

  useEffect(() => {
    if (productsStatus === 'idle') {
      dispatch(fetchProducts());
    }
    if (categoriesStatus === 'idle') {
      dispatch(fetchCategories());
    }
  }, [dispatch, productsStatus, categoriesStatus]);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
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
          {filteredProducts?.map((equipment) => (
            <Grid item key={equipment._id} xs={12} sm={6} md={4}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
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
                  <Button
                    variant={isTimeRangeSelected ? "contained" : "outlined"}
                    color="primary"
                    onClick={() => dispatch(addToCart({ ...equipment, startDate, endDate }))}
                    disabled={!isTimeRangeSelected}
                    sx={{ mt: 'auto' }}
                  >
                    {isTimeRangeSelected ? "In den Warenkorb" : "Zeitraum auswählen"}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
} 