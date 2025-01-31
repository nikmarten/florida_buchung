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
  useTheme
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

export default function AdminCategories() {
  const theme = useTheme();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch categories from API
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error('Error fetching categories:', err));
  }, []);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2">
          Kategorien verwalten
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {/* Handle add */}}
        >
          Kategorie hinzufügen
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
                <IconButton edge="end" onClick={() => {/* Handle edit */}}>
                  <EditIcon />
                </IconButton>
                <IconButton edge="end" onClick={() => {/* Handle delete */}}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
} 