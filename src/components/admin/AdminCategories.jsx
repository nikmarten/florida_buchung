import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { fetchCategories, addCategory, updateCategory, deleteCategory } from '../../store/categorySlice';

export default function AdminCategories() {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories.items);
  const status = useSelector((state) => state.categories.status);
  const error = useSelector((state) => state.categories.error);
  const products = useSelector((state) => state.products.items);
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({
    label: '',
    description: ''
  });

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleOpen = (category = null) => {
    if (category) {
      setSelectedCategory(category);
      setFormData({
        label: category.label || '',
        description: category.description || ''
      });
    } else {
      setSelectedCategory(null);
      setFormData({
        label: '',
        description: ''
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedCategory(null);
    setFormData({
      label: '',
      description: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.label.trim()) {
      return;
    }

    const categoryData = {
      label: formData.label.trim(),
      description: formData.description.trim()
    };

    try {
      if (selectedCategory) {
        await dispatch(updateCategory({ id: selectedCategory._id, ...categoryData })).unwrap();
      } else {
        await dispatch(addCategory(categoryData)).unwrap();
      }
      handleClose();
    } catch (err) {
      console.error('Failed to save category:', err);
    }
  };

  const handleDelete = async (id) => {
    const productsInCategory = products.filter(product => product.category === id);
    if (productsInCategory.length > 0) {
      alert('Diese Kategorie kann nicht gelöscht werden, da ihr noch Produkte zugeordnet sind.');
      return;
    }

    if (window.confirm('Sind Sie sicher, dass Sie diese Kategorie löschen möchten?')) {
      try {
        await dispatch(deleteCategory(id)).unwrap();
        dispatch(fetchCategories());
      } catch (err) {
        console.error('Failed to delete category:', err);
        alert('Fehler beim Löschen der Kategorie: ' + (err.message || 'Unbekannter Fehler'));
      }
    }
  };

  return (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2">
          Kategorien verwalten
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Kategorie hinzufügen
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Beschreibung</TableCell>
              <TableCell>Aktionen</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category._id}>
                <TableCell>{category.label}</TableCell>
                <TableCell>{category.description}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(category)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(category._id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog 
        open={open} 
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedCategory ? 'Kategorie bearbeiten' : 'Neue Kategorie hinzufügen'}
        </DialogTitle>
        <DialogContent>
          <Box 
            component="form" 
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}
          >
            <TextField
              label="Name"
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              fullWidth
              required
              error={!formData.label.trim()}
              helperText={!formData.label.trim() ? 'Name ist erforderlich' : ''}
            />
            <TextField
              label="Beschreibung"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              fullWidth
              multiline
              rows={3}
            />
            <DialogActions>
              <Button onClick={handleClose}>Abbrechen</Button>
              <Button 
                type="submit"
                variant="contained"
                disabled={!formData.label.trim() || status === 'loading'}
              >
                {status === 'loading' ? 'Wird gespeichert...' : (selectedCategory ? 'Speichern' : 'Hinzufügen')}
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
} 