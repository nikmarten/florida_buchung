import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Typography,
  Alert,
  InputAdornment
} from '@mui/material';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export default function ProductForm({ product, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    imageUrl: '',
    quantity: 1,
    lockPeriodDays: 0,
    isActive: true,
    ...product
  });

  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_URL}/categories`);
        setCategories(response.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Kategorien konnten nicht geladen werden');
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = product?._id
        ? await axios.put(`${API_URL}/products/${product._id}`, formData)
        : await axios.post(`${API_URL}/products`, formData);

      if (onSave) {
        onSave(response.data);
      }
    } catch (err) {
      console.error('Error saving product:', err);
      setError('Produkt konnte nicht gespeichert werden');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Beschreibung"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={3}
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required>
            <InputLabel>Kategorie</InputLabel>
            <Select
              name="category"
              value={formData.category}
              onChange={handleChange}
              label="Kategorie"
            >
              {categories.map((category) => (
                <MenuItem key={category._id} value={category._id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Bild URL"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Verfügbare Menge"
            name="quantity"
            type="number"
            value={formData.quantity}
            onChange={handleChange}
            required
            InputProps={{
              inputProps: { min: 0 }
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Sperrzeit nach Buchung"
            name="lockPeriodDays"
            type="number"
            value={formData.lockPeriodDays}
            onChange={handleChange}
            required
            InputProps={{
              inputProps: { min: 0 },
              endAdornment: <InputAdornment position="end">Tage</InputAdornment>
            }}
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        {onCancel && (
          <Button onClick={onCancel} color="inherit">
            Abbrechen
          </Button>
        )}
        <Button type="submit" variant="contained" color="primary">
          {product?._id ? 'Speichern' : 'Erstellen'}
        </Button>
      </Box>
    </Box>
  );
} 