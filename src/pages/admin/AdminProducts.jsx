import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  CardActions,
  Grid,
  Chip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

export default function AdminProducts() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch products from API
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error('Error fetching products:', err));
  }, []);

  // Mobile Produktkarte
  const ProductCard = ({ product }) => (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="h3" gutterBottom>
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {product.description}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="body2">
            Kategorie:
          </Typography>
          <Chip 
            label={product.category?.label || '-'} 
            size="small"
            color="primary"
            variant="outlined"
          />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2">
            Verfügbar:
          </Typography>
          <Chip 
            label={product.quantity} 
            size="small"
            color={product.quantity > 0 ? "success" : "error"}
          />
        </Box>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end', p: 2, pt: 0 }}>
        <IconButton size="small" onClick={() => {/* Handle edit */}}>
          <EditIcon />
        </IconButton>
        <IconButton size="small" onClick={() => {/* Handle delete */}}>
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );

  return (
    <Box>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3,
        flexDirection: isMobile ? 'column' : 'row',
        gap: 2
      }}>
        <Typography variant="h5" component="h2">
          Produkte verwalten
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {/* Handle add */}}
          fullWidth={isMobile}
        >
          Produkt hinzufügen
        </Button>
      </Box>

      {isMobile ? (
        // Mobile Ansicht: Grid mit Karten
        <Grid container spacing={2}>
          {products.map((product) => (
            <Grid item xs={12} key={product._id}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      ) : (
        // Desktop Ansicht: Tabelle
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Beschreibung</TableCell>
                <TableCell>Kategorie</TableCell>
                <TableCell>Verfügbar</TableCell>
                <TableCell>Aktionen</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product._id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.description}</TableCell>
                  <TableCell>{product.category?.label || '-'}</TableCell>
                  <TableCell>
                    <Chip 
                      label={product.quantity} 
                      size="small"
                      color={product.quantity > 0 ? "success" : "error"}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => {/* Handle edit */}}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => {/* Handle delete */}}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
} 