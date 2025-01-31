import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ADMIN_PASSWORD = 'florida2024'; // Einfaches hardcodiertes Passwort

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      // Setze einen Flag im localStorage, dass der Admin eingeloggt ist
      localStorage.setItem('adminAuthenticated', 'true');
      navigate('/admin');
    } else {
      setError(true);
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: 'calc(100vh - 64px)' 
    }}>
      <Card sx={{ maxWidth: 400, width: '100%', mx: 2 }}>
        <CardContent>
          <Typography variant="h5" component="h1" gutterBottom>
            Admin-Login
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Falsches Passwort
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              type="password"
              label="Passwort"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 2 }}
              autoFocus
            />
            <Button
              fullWidth
              variant="contained"
              type="submit"
            >
              Anmelden
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
} 