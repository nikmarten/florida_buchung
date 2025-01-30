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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { fetchProducts, addProduct as createProduct, updateProduct, deleteProduct } from '../../store/productSlice';
import { fetchCategories } from '../../store/categorySlice';

export default function AdminProducts() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.items);
  const status = useSelector((state) => state.products.status);
  const error = useSelector((state) => state.products.error);
  const categories = useSelector((state) => state.categories.items);
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    quantity: 0,
    imageUrl: '',
    lockPeriodDays: 0
  });

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  // Filterfunktion für Produkte
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === 'all' || 
      product.category?._id === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleOpen = (product = null) => {
    if (product) {
      setSelectedProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        category: product.category?._id || '',
        quantity: product.quantity || 0,
        imageUrl: product.imageUrl || '',
        lockPeriodDays: product.lockPeriodDays || 0
      });
    } else {
      setSelectedProduct(null);
      setFormData({
        name: '',
        description: '',
        category: '',
        quantity: 0,
        imageUrl: '',
        lockPeriodDays: 0
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProduct(null);
  };

  const handleSubmit = async () => {
    // Validierung der Pflichtfelder
    if (!formData.name || !formData.description || !formData.category) {
      alert('Bitte füllen Sie alle Pflichtfelder aus (Name, Beschreibung und Kategorie)');
      return;
    }

    // Formatiere die Daten für das Backend
    const productData = {
      ...formData,
      quantity: parseInt(formData.quantity, 10) || 0,
      lockPeriodDays: parseInt(formData.lockPeriodDays, 10) || 0,
      imageUrl: formData.imageUrl.trim() || undefined,
      category: formData.category // Stelle sicher, dass die Kategorie-ID korrekt übergeben wird
    };

    try {
      if (selectedProduct) {
        const resultAction = await dispatch(updateProduct({ id: selectedProduct._id, ...productData }));
        if (updateProduct.fulfilled.match(resultAction)) {
          // Nach erfolgreicher Aktualisierung die Produktliste neu laden
          dispatch(fetchProducts());
          handleClose();
        } else if (updateProduct.rejected.match(resultAction)) {
          alert('Fehler beim Speichern: ' + (resultAction.payload || 'Unbekannter Fehler'));
        }
      } else {
        const resultAction = await dispatch(createProduct(productData));
        if (createProduct.fulfilled.match(resultAction)) {
          // Nach erfolgreicher Erstellung die Produktliste neu laden
          dispatch(fetchProducts());
          handleClose();
        } else if (createProduct.rejected.match(resultAction)) {
          alert('Fehler beim Erstellen: ' + (resultAction.payload || 'Unbekannter Fehler'));
        }
      }
    } catch (err) {
      alert('Ein Fehler ist aufgetreten: ' + err.message);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Sind Sie sicher, dass Sie dieses Produkt löschen möchten?')) {
      dispatch(deleteProduct(id));
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2">
          Produkte verwalten
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Produkt hinzufügen
        </Button>
      </Box>

      {/* Filter und Suchbereich */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <TextField
          label="Suchen"
          variant="outlined"
          size="small"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Nach Name oder Beschreibung suchen..."
          sx={{ maxWidth: 400 }}
        />
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Kategorie Filter</InputLabel>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            label="Kategorie Filter"
          >
            <MenuItem value="all">Alle Kategorien</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category._id} value={category._id}>
                {category.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Beschreibung</TableCell>
              <TableCell>Kategorie</TableCell>
              <TableCell>Verfügbare Menge</TableCell>
              <TableCell>Bild</TableCell>
              <TableCell>Sperrzeit (Tage)</TableCell>
              <TableCell>Aktionen</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body1" sx={{ py: 2 }}>
                    Keine Produkte gefunden
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product._id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.description}</TableCell>
                  <TableCell>{product.category?.label || 'Keine Kategorie'}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>
                    {product.imageUrl && (
                      <img 
                        src={product.imageUrl} 
                        alt={product.name} 
                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                      />
                    )}
                  </TableCell>
                  <TableCell>{product.lockPeriodDays || 0}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpen(product)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(product._id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog 
        open={open} 
        onClose={handleClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedProduct ? 'Produkt bearbeiten' : 'Neues Produkt hinzufügen'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 2.5, 
            pt: 2,
            width: '100%'
          }}>
            <TextField
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
              required
              variant="outlined"
              error={!formData.name}
              helperText={!formData.name ? 'Name ist erforderlich' : ''}
            />
            <TextField
              label="Beschreibung"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              required
              error={!formData.description}
              helperText={!formData.description ? 'Beschreibung ist erforderlich' : ''}
            />
            <TextField
              label="Bild URL"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              fullWidth
              variant="outlined"
              type="url"
              helperText="Optionale URL für ein Produktbild"
            />
            <FormControl fullWidth variant="outlined" required error={!formData.category}>
              <InputLabel>Kategorie</InputLabel>
              <Select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                label="Kategorie"
              >
                {categories.map((category) => (
                  <MenuItem key={category._id} value={category._id}>
                    {category.label}
                  </MenuItem>
                ))}
              </Select>
              {!formData.category && (
                <FormHelperText>Kategorie ist erforderlich</FormHelperText>
              )}
            </FormControl>
            <TextField
              label="Verfügbare Menge"
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value, 10) })}
              fullWidth
              required
              variant="outlined"
              InputProps={{ inputProps: { min: 0 } }}
            />
            <TextField
              label="Sperrzeit nach Buchung (Tage)"
              type="number"
              value={formData.lockPeriodDays}
              onChange={(e) => setFormData({ ...formData, lockPeriodDays: parseInt(e.target.value, 10) || 0 })}
              fullWidth
              variant="outlined"
              InputProps={{ 
                inputProps: { min: 0 },
              }}
              helperText="Anzahl der Tage, die das Produkt nach einer Buchung gesperrt bleibt (z.B. für Wartung/Auslesen)"
            />
            {formData.imageUrl && (
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Typography variant="subtitle2" gutterBottom>
                  Bildvorschau:
                </Typography>
                <img 
                  src={formData.imageUrl} 
                  alt="Vorschau"
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '200px', 
                    objectFit: 'contain',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    alert('Bild konnte nicht geladen werden. Bitte überprüfen Sie die URL.');
                  }}
                />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Abbrechen</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Wird gespeichert...' : (selectedProduct ? 'Speichern' : 'Hinzufügen')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 