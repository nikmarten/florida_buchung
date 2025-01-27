import React from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Box, Container, Paper, Tabs, Tab, Button, AppBar, Toolbar, IconButton, Menu, MenuItem, useMediaQuery, useTheme, Typography } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { logout } from '../../store/authSlice';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = React.useState(null);

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
    if (isMobile) {
      setAnchorEl(null);
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Navigation Header - für beide Ansichten */}
      <AppBar position="sticky" sx={{ bgcolor: 'primary.main' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {isMobile ? (
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={handleMenuOpen}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            ) : null}
            <Typography variant="h6" component="div" color="white">
              Admin-Bereich
            </Typography>
          </Box>
          <Button 
            color="inherit" 
            onClick={handleLogout}
            sx={{ color: 'white' }}
          >
            Logout
          </Button>
        </Toolbar>

        {/* Desktop Tabs direkt unter der Toolbar */}
        {!isMobile && (
          <Tabs
            value={getActiveTab()}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              bgcolor: 'primary.dark',
              '& .MuiTab-root': {
                color: 'rgba(255, 255, 255, 0.7)',
                '&.Mui-selected': {
                  color: 'white'
                }
              }
            }}
          >
            <Tab label="Produkte" />
            <Tab label="Kategorien" />
            <Tab label="Buchungen" />
          </Tabs>
        )}
      </AppBar>

      {/* Mobile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        sx={{ 
          mt: 1,
          '& .MuiMenuItem-root': {
            minWidth: 200
          }
        }}
      >
        <MenuItem 
          onClick={() => handleTabChange(null, 0)}
          selected={getActiveTab() === 0}
        >
          Produkte
        </MenuItem>
        <MenuItem 
          onClick={() => handleTabChange(null, 1)}
          selected={getActiveTab() === 1}
        >
          Kategorien
        </MenuItem>
        <MenuItem 
          onClick={() => handleTabChange(null, 2)}
          selected={getActiveTab() === 2}
        >
          Buchungen
        </MenuItem>
      </Menu>

      {/* Content */}
      <Container 
        maxWidth="lg" 
        sx={{ 
          flex: 1,
          mt: { xs: 2, sm: 3 },
          mb: { xs: 2, sm: 3 },
          px: { xs: 1, sm: 3 }
        }}
      >
        <Paper 
          sx={{ 
            p: { xs: 2, sm: 3 },
            height: '100%',
            overflow: 'auto'
          }}
        >
          <Outlet />
        </Paper>
      </Container>
    </Box>
  );
} 