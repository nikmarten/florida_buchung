import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container, Typography } from '@mui/material';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <Box sx={{ 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: 'background.default'
    }}>
      <Navbar />
      
      <Container 
        component="main" 
        maxWidth="lg" 
        sx={{ 
          flex: 1,
          py: 4,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Outlet />
      </Container>

      <Box 
        component="footer" 
        sx={{ 
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: 'background.paper',
          borderTop: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Container maxWidth="lg">
          <Typography 
            variant="body2" 
            color="text.secondary" 
            align="center"
          >
            © {new Date().getFullYear()} Florida Technik. Alle Rechte vorbehalten.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
} 