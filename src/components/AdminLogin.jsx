import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Container
} from '@mui/material';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;
    
    if (password === adminPassword) {
      localStorage.setItem('adminAuthenticated', 'true');
      navigate('/admin');
    } else {
      setError('Falsches Passwort');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            width: '100%',
            maxWidth: 400
          }}
        >
          <Typography 
            variant="h5" 
            component="h1" 
            gutterBottom
            sx={{ mb: 3, fontWeight: 500 }}
          >
            Admin Login
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              type="password"
              label="Passwort"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
              sx={{ mb: 2 }}
            />

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Button 
              type="submit" 
              variant="contained" 
              fullWidth
              size="large"
            >
              Anmelden
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
} 