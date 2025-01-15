import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Paper
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, addCategory, updateCategory, deleteCategory } from '../../store/categorySlice';

export default function AdminCategories() {
  const dispatch = useDispatch();
  const { items: categories, status, error } = useSelector((state) => state.categories);
  
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    label: ''
  });

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCategories());
    }
  }, [status, dispatch]);

  const handleOpenDialog = (category = null) => {
    if (category) {
      setFormData({ label: category.label });
      setEditingCategory(category);
    } else {
      setFormData({ label: '' });
      setEditingCategory(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCategory(null);
  };

  const handleInputChange = (e) => {
    setFormData({ label: e.target.value });
  };

  const generateValue = (label) => {
    return label
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '');
  };

  const handleSubmit = async () => {
    try {
      const categoryData = {
        label: formData.label,
        value: generateValue(formData.label)
      };

      if (editingCategory) {
        await dispatch(updateCategory({ 
          id: editingCategory._id, 
          data: categoryData 
        })).unwrap();
      } else {
        await dispatch(addCategory(categoryData)).unwrap();
      }
      handleCloseDialog();
    } catch (err) {
      console.error('Error saving category:', err);
      alert('Fehler beim Speichern: ' + (err.message || 'Unbekannter Fehler'));
    }
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm('Möchten Sie diese Kategorie wirklich löschen?')) {
      try {
        await dispatch(deleteCategory(categoryId)).unwrap();
      } catch (err) {
        alert('Fehler beim Löschen: ' + err.message);
      }
    }
  };

  if (status === 'loading') {
    return <Box sx={{ p: 2 }}><Typography>Lädt...</Typography></Box>;
  }

  if (status === 'failed') {
    return <Box sx={{ p: 2 }}><Typography color="error">{error}</Typography></Box>;
  }

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Kategorien verwalten</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Kategorie hinzufügen
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Bezeichnung</TableCell>
              <TableCell>Wert</TableCell>
              <TableCell align="right">Aktionen</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category._id}>
                <TableCell>{category.label}</TableCell>
                <TableCell>{category.value}</TableCell>
                <TableCell align="right">
                  <IconButton 
                    size="small" 
                    onClick={() => handleOpenDialog(category)}
                    sx={{ mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    color="error"
                    onClick={() => handleDelete(category._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingCategory ? 'Kategorie bearbeiten' : 'Neue Kategorie hinzufügen'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              autoFocus
              name="label"
              label="Bezeichnung"
              fullWidth
              value={formData.label}
              onChange={handleInputChange}
              helperText="z.B. 'Kameras' oder 'Audio Equipment'"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Abbrechen</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={!formData.label.trim()}
          >
            {editingCategory ? 'Speichern' : 'Hinzufügen'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 