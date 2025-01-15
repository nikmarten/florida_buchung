import React, { useEffect, useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  CircularProgress,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import { fetchProducts } from '../store/productSlice';
import { fetchCategories } from '../store/categorySlice';

export default function EquipmentList() {
  const dispatch = useDispatch();
  const { startDate, endDate } = useSelector((state) => state.booking);
  const { items: products, status: productStatus, error: productError } = useSelector((state) => state.products);
  const { items: categories, status: categoryStatus } = useSelector((state) => state.categories);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  useEffect(() => {
    if (productStatus === 'idle') {
      dispatch(fetchProducts());
    }
    if (categoryStatus === 'idle') {
      dispatch(fetchCategories());
    }
  }, [productStatus, categoryStatus, dispatch]);

  const handleAddToCart = (item) => {
    if (!startDate || !endDate) {
      alert('Bitte wählen Sie zuerst einen Zeitraum aus');
      return;
    }

    dispatch(addToCart({
      id: Date.now(),
      equipment: item,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    }));
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredProducts = products?.filter(product => {
    const matchesSearch = searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'ALL' || product.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const allCategories = [
    { value: 'ALL', label: 'Alle Kategorien' },
    ...(categories || []).map(cat => ({
      value: cat.value,
      label: cat.label
    }))
  ];

  if (productStatus === 'loading' || categoryStatus === 'loading') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (productStatus === 'failed') {
    return (
      <Alert severity="error">
        Fehler beim Laden der Produkte: {productError}
      </Alert>
    );
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      width: '100%',
      maxWidth: '100%'
    }}>
      <Box sx={{ 
        mb: { xs: 2, sm: 4 }, 
        display: 'flex', 
        gap: { xs: 1, sm: 3 },
        width: '100%',
        flexDirection: { xs: 'column', sm: 'row' }
      }}>
        <FormControl sx={{ width: '100%', minWidth: { sm: 250 } }}>
          <InputLabel id="category-select-label">Kategorie</InputLabel>
          <Select
            labelId="category-select-label"
            value={selectedCategory}
            label="Kategorie"
            onChange={handleCategoryChange}
            size={isMobile ? "small" : "medium"}
          >
            {allCategories.map((category) => (
              <MenuItem key={category.value} value={category.value}>
                {category.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <TextField
          label="Suche"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          size={isMobile ? "small" : "medium"}
          fullWidth
          sx={{ flexGrow: 1 }}
        />
      </Box>

      {!filteredProducts || filteredProducts.length === 0 ? (
        <Alert severity="info" sx={{ width: '100%' }}>Keine Ausrüstung gefunden.</Alert>
      ) : (
        <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ width: '100%' }}>
          {filteredProducts.map((equipment) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={equipment._id}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: { xs: 'none', sm: 'translateY(-4px)' },
                    boxShadow: 4
                  }
                }}
              >
                <CardMedia
                  component="img"
                  height={{ xs: 160, sm: 200 }}
                  image={equipment.imageUrl}
                  alt={equipment.name}
                  sx={{ 
                    objectFit: 'cover',
                    backgroundColor: 'grey.100'
                  }}
                />
                <CardContent sx={{ flexGrow: 1, p: { xs: 1.5, sm: 2 } }}>
                  <Typography 
                    gutterBottom 
                    variant="h6" 
                    component="h2"
                    sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
                  >
                    {equipment.name}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    paragraph
                    sx={{ 
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      mb: { xs: 1, sm: 2 }
                    }}
                  >
                    {equipment.description}
                  </Typography>
                  <Box sx={{ mt: 'auto', pt: { xs: 1, sm: 2 } }}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => handleAddToCart(equipment)}
                      size={isMobile ? "medium" : "large"}
                    >
                      Zum Warenkorb hinzufügen
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
} 