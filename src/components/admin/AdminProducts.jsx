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
  MenuItem,
  Typography,
  Paper,
  CircularProgress
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, addProduct, updateProduct, deleteProduct } from '../../store/productSlice';
import { fetchCategories } from '../../store/categorySlice';

export default function AdminProducts() {
  const dispatch = useDispatch();
  const { items: products, status, error } = useSelector((state) => state.products);
  const { items: categories, status: categoryStatus } = useSelector((state) => state.categories);
  
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    imageUrl: ''
  });

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
    if (categoryStatus === 'idle') {
      dispatch(fetchCategories());
    }
  }, [status, categoryStatus, dispatch]);

  const handleOpenDialog = (product = null) => {
    if (product) {
      setFormData({ ...product });
      setEditingProduct(product);
    } else {
      setFormData({
        name: '',
        category: categories.length > 0 ? categories[0].value : '',
        description: '',
        imageUrl: ''
      });
      setEditingProduct(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingProduct(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      if (editingProduct) {
        await dispatch(updateProduct({ id: editingProduct._id, data: formData })).unwrap();
      } else {
        await dispatch(addProduct(formData)).unwrap();
      }
      handleCloseDialog();
    } catch (err) {
      console.error('Error saving product:', err);
      alert('Fehler beim Speichern: ' + (err.message || 'Unbekannter Fehler beim Speichern des Produkts'));
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Möchten Sie dieses Produkt wirklich löschen?')) {
      try {
        await dispatch(deleteProduct(productId)).unwrap();
      } catch (err) {
        alert('Fehler beim Löschen: ' + err.message);
      }
    }
  };

  const getCategoryLabel = (categoryValue) => {
    const category = categories.find(cat => cat.value === categoryValue);
    return category ? category.label : categoryValue;
  };

  if (status === 'loading' || categoryStatus === 'loading') {
    return <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>;
  }

  if (status === 'failed') {
    return <Box sx={{ p: 2 }}><Typography color="error">{error}</Typography></Box>;
  }

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Produkte verwalten</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Produkt hinzufügen
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Kategorie</TableCell>
              <TableCell>Beschreibung</TableCell>
              <TableCell>Bild-URL</TableCell>
              <TableCell align="right">Aktionen</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product._id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{getCategoryLabel(product.category)}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>{product.imageUrl}</TableCell>
                <TableCell align="right">
                  <IconButton 
                    size="small" 
                    onClick={() => handleOpenDialog(product)}
                    sx={{ mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    color="error"
                    onClick={() => handleDelete(product._id)}
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
          {editingProduct ? 'Produkt bearbeiten' : 'Neues Produkt hinzufügen'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              name="name"
              label="Name"
              fullWidth
              value={formData.name}
              onChange={handleInputChange}
            />
            <TextField
              name="category"
              label="Kategorie"
              select
              fullWidth
              value={formData.category}
              onChange={handleInputChange}
            >
              {categories.map((category) => (
                <MenuItem key={category.value} value={category.value}>
                  {category.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              name="description"
              label="Beschreibung"
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
            />
            <TextField
              name="imageUrl"
              label="Bild-URL"
              fullWidth
              value={formData.imageUrl}
              onChange={handleInputChange}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Abbrechen</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingProduct ? 'Speichern' : 'Hinzufügen'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 