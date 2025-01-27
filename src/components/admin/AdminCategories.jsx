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
  Paper,
  CircularProgress,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Add as AddIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon 
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, addCategory, updateCategory, deleteCategory } from '../../store/categorySlice';

export default function AdminCategories() {
  const dispatch = useDispatch();
  const { items: categories, status, error } = useSelector((state) => state.categories);
  
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    label: '',
    order: 0
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCategories());
    }
  }, [status, dispatch]);

  const handleOpenDialog = (category = null) => {
    if (category) {
      setFormData({ 
        label: category.label,
        order: category.order || 0
      });
      setEditingCategory(category);
    } else {
      setFormData({ 
        label: '',
        order: categories.length 
      });
      setEditingCategory(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCategory(null);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
        value: generateValue(formData.label),
        order: formData.order
      };

      if (editingCategory) {
        await dispatch(updateCategory({ 
          ...editingCategory,
          ...categoryData
        })).unwrap();
      } else {
        await dispatch(addCategory(categoryData)).unwrap();
      }
      handleCloseDialog();
      dispatch(fetchCategories());
    } catch (err) {
      console.error('Error saving category:', err);
      alert('Fehler beim Speichern: ' + (err.message || 'Unbekannter Fehler'));
    }
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm('Möchten Sie diese Kategorie wirklich löschen?')) {
      try {
        await dispatch(deleteCategory(categoryId)).unwrap();
        dispatch(fetchCategories());
      } catch (err) {
        alert('Fehler beim Löschen: ' + err.message);
      }
    }
  };

  const handleMove = async (category, direction) => {
    const sortedCategories = [...categories].sort((a, b) => a.order - b.order);
    const currentIndex = sortedCategories.findIndex(c => c._id === category._id);
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    if (newIndex >= 0 && newIndex < sortedCategories.length) {
      const otherCategory = sortedCategories[newIndex];
      
      try {
        // Zuerst die andere Kategorie aktualisieren
        await dispatch(updateCategory({
          _id: otherCategory._id,
          label: otherCategory.label,
          value: otherCategory.value,
          description: otherCategory.description || '',
          order: currentIndex // Tausche die Positionen
        })).unwrap();
        
        // Dann die aktuelle Kategorie aktualisieren
        await dispatch(updateCategory({
          _id: category._id,
          label: category.label,
          value: category.value,
          description: category.description || '',
          order: newIndex // Tausche die Positionen
        })).unwrap();
        
        // Kategorien neu laden
        await dispatch(fetchCategories());
      } catch (err) {
        console.error('Error moving category:', err);
        alert('Fehler beim Verschieben: ' + (err.message || 'Unbekannter Fehler'));
      }
    }
  };

  const MobileCategoryCard = ({ category, index }) => (
    <Paper 
      elevation={2}
      sx={{ 
        mb: 2,
        overflow: 'hidden',
        '&:last-child': { mb: 0 }
      }}
    >
      <Box sx={{ 
        p: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}>
        <Box 
          sx={{ 
            width: 40,
            height: 40,
            borderRadius: '50%',
            bgcolor: 'primary.main',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            flexShrink: 0
          }}
        >
          {index + 1}
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            {category.label}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {category.value}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Button
            size="small"
            startIcon={<ArrowUpIcon />}
            onClick={() => handleMove(category, 'up')}
            disabled={index === 0}
            fullWidth
          >
            Nach oben
          </Button>
          <Button
            size="small"
            startIcon={<ArrowDownIcon />}
            onClick={() => handleMove(category, 'down')}
            disabled={index === categories.length - 1}
            fullWidth
          >
            Nach unten
          </Button>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            size="small"
            startIcon={<EditIcon />}
            onClick={() => handleOpenDialog(category)}
            fullWidth
          >
            Bearbeiten
          </Button>
          <Button
            size="small"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => handleDelete(category._id)}
            fullWidth
          >
            Löschen
          </Button>
        </Box>
      </Box>
    </Paper>
  );

  if (status === 'loading') {
    return <Box sx={{ p: 2 }}><CircularProgress /></Box>;
  }

  if (status === 'failed') {
    return <Box sx={{ p: 2 }}><Typography color="error">{error}</Typography></Box>;
  }

  const sortedCategories = [...categories].sort((a, b) => a.order - b.order);

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ 
        mb: 3, 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2,
        alignItems: { xs: 'stretch', sm: 'center' },
        justifyContent: 'space-between'
      }}>
        <Typography variant="h6">Kategorien verwalten</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          fullWidth={isMobile}
        >
          Kategorie hinzufügen
        </Button>
      </Box>

      {isMobile ? (
        // Mobile Ansicht
        <Box>
          {sortedCategories.map((category, index) => (
            <MobileCategoryCard 
              key={category._id} 
              category={category} 
              index={index}
            />
          ))}
        </Box>
      ) : (
        // Desktop Ansicht (unverändert)
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Position</TableCell>
                <TableCell>Bezeichnung</TableCell>
                <TableCell>Wert</TableCell>
                <TableCell align="right">Aktionen</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedCategories.map((category, index) => (
                <TableRow key={category._id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IconButton 
                        size="small"
                        onClick={() => handleMove(category, 'up')}
                        disabled={index === 0}
                      >
                        <ArrowUpIcon />
                      </IconButton>
                      <IconButton 
                        size="small"
                        onClick={() => handleMove(category, 'down')}
                        disabled={index === categories.length - 1}
                      >
                        <ArrowDownIcon />
                      </IconButton>
                      {index + 1}
                    </Box>
                  </TableCell>
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
      )}

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
              sx={{ mb: 2 }}
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