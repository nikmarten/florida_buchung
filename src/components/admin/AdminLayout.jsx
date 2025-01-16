import React from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Box, Container, Paper, Tabs, Tab, Button } from '@mui/material';
import { logout } from '../../store/authSlice';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const getActiveTab = () => {
    const path = location.pathname.split('/').pop();
    switch (path) {
      case 'products':
        return 0;
      case 'categories':
        return 1;
      case 'bookings':
        return 2;
      default:
        return 0;
    }
  };

  const handleTabChange = (event, newValue) => {
    switch (newValue) {
      case 0:
        navigate('/admin/products');
        break;
      case 1:
        navigate('/admin/categories');
        break;
      case 2:
        navigate('/admin/bookings');
        break;
      default:
        navigate('/admin/products');
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ width: '100%', mt: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Paper sx={{ flexGrow: 1, mr: 2 }}>
            <Tabs
              value={getActiveTab()}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab label="Produkte" />
              <Tab label="Kategorien" />
              <Tab label="Buchungen" />
            </Tabs>
          </Paper>
          <Button variant="outlined" color="primary" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
        <Paper sx={{ p: 3 }}>
          <Outlet />
        </Paper>
      </Box>
    </Container>
  );
} 