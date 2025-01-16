import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../store/authSlice';
import { Box, Paper, TextField, Button, Typography, Container, Alert } from '@mui/material';

const ADMIN_PASSWORD = 'admin123'; // In einer echten Anwendung würde das Passwort natürlich sicher im Backend gespeichert

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      dispatch(login());
      navigate('/admin');
    } else {
      setError('Falsches Passwort');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper elevation={0} sx={{ p: 4, width: '100%', border: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h5" component="h1" gutterBottom textAlign="center">
            Admin Login
          </Typography>
          
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              type="password"
              label="Passwort"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              error={!!error}
              helperText={error}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3 }}
            >
              Anmelden
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
} 