import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../store/authSlice';
import { Box, Paper, TextField, Button, Typography, Container, Alert } from '@mui/material';
import axios from 'axios';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/login`, {
        username,
        password
      });

      if (response.data && response.data.token) {
        dispatch(login(response.data.token));
        navigate('/admin');
      } else {
        setError('Login fehlgeschlagen');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Netzwerkfehler beim Login');
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
              label="Benutzername"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              margin="normal"
            />
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