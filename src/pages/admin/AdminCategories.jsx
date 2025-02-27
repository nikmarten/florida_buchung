import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Paper,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  CardActions,
  Grid,
  Divider
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

export default function AdminCategories() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch categories from API
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error('Error fetching categories:', err));
  }, []);

  // Mobile Kategoriekarte
  const CategoryCard = ({ category }) => (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="h3" gutterBottom>
          {category.label}
        </Typography>
        {category.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {category.description}
          </Typography>
        )}
        <Typography variant="body2" color="text.secondary">
          Produkte in dieser Kategorie: {category.products?.length || 0}
        </Typography>
      </CardContent>
      <Divider />
      <CardActions sx={{ justifyContent: 'flex-end', p: 1 }}>
        <IconButton size="small" onClick={() => {/* Handle edit */}}>
          <EditIcon />
        </IconButton>
        <IconButton size="small" onClick={() => {/* Handle delete */}} color="error">
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );

  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: { xs: 2, sm: 3 },
        flexDirection: isMobile ? 'column' : 'row',
        gap: 2
      }}>
        <Typography variant="h5" component="h2" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
          Kategorien verwalten
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {/* Handle add */}}
          fullWidth={isMobile}
          size={isMobile ? "small" : "medium"}
        >
          Kategorie hinzufügen
        </Button>
      </Box>

      {isMobile ? (
        // Mobile Ansicht: Grid mit Karten
        <Grid container spacing={2} sx={{ mx: -1 }}>
          {categories.map((category) => (
            <Grid item xs={12} key={category._id}>
              <CategoryCard category={category} />
            </Grid>
          ))}
        </Grid>
      ) : (
        // Desktop Ansicht: Liste
        <Paper>
          <List>
            {categories.map((category) => (
              <ListItem key={category._id}>
                <ListItemText
                  primary={category.label}
                  secondary={
                    <>
                      {category.description}
                      <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                        Produkte: {category.products?.length || 0}
                      </Typography>
                    </>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" onClick={() => {/* Handle edit */}} size={isMobile ? "small" : "medium"}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" onClick={() => {/* Handle delete */}} color="error" size={isMobile ? "small" : "medium"}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
} 