import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
  Typography,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '' });
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/categories`);
      setCategories(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Kategorien konnten nicht geladen werden');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = () => {
    setSelectedCategory(null);
    setFormData({ name: '' });
    setIsDialogOpen(true);
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setFormData({ name: category.name });
    setIsDialogOpen(true);
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('Möchten Sie diese Kategorie wirklich löschen?')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/categories/${categoryId}`);
      await fetchCategories();
    } catch (err) {
      console.error('Error deleting category:', err);
      setError('Kategorie konnte nicht gelöscht werden');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedCategory) {
        await axios.put(`${API_URL}/categories/${selectedCategory._id}`, formData);
      } else {
        await axios.post(`${API_URL}/categories`, formData);
      }
      await fetchCategories();
      setIsDialogOpen(false);
    } catch (err) {
      console.error('Error saving category:', err);
      setError('Kategorie konnte nicht gespeichert werden');
    }
  };

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">
          Kategorien verwalten
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddCategory}
        >
          Neue Kategorie
        </Button>
      </Box>

      <Paper>
        <List>
          {categories.map((category) => (
            <ListItem key={category._id}>
              <ListItemText
                primary={category.name}
                secondary={`${category.products?.length || 0} Produkte`}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  onClick={() => handleEditCategory(category)}
                  sx={{ mr: 1 }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  onClick={() => handleDeleteCategory(category._id)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>

      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              {selectedCategory ? 'Kategorie bearbeiten' : 'Neue Kategorie'}
            </Typography>
            <IconButton onClick={() => setIsDialogOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ name: e.target.value })}
              required
            />
            <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button onClick={() => setIsDialogOpen(false)} color="inherit">
                Abbrechen
              </Button>
              <Button type="submit" variant="contained" color="primary">
                {selectedCategory ? 'Speichern' : 'Erstellen'}
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
} 