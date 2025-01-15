import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Box, 
  Typography, 
  IconButton, 
  Badge, 
  Button, 
  Container,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { 
  ShoppingCart as ShoppingCartIcon,
  Menu as MenuIcon
} from '@mui/icons-material';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CartDrawer from './CartDrawer';

export default function Layout() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [cartOpen, setCartOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const cartItems = useSelector((state) => state.cart.items);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path) => {
    navigate(path);
    handleMenuClose();
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      width: '100%',
      maxWidth: '100%'
    }}>
      <AppBar position="sticky">
        <Container maxWidth="lg">
          <Toolbar sx={{ px: 0 }}>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1, cursor: 'pointer' }}
              onClick={() => navigate('/')}
            >
              Florida Technik
            </Typography>
            {isMobile ? (
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <IconButton
                  color="inherit"
                  onClick={handleMenuOpen}
                  size="large"
                >
                  <MenuIcon />
                </IconButton>
                <IconButton 
                  color="inherit" 
                  onClick={() => setCartOpen(true)}
                  size="large"
                >
                  <Badge badgeContent={cartItems.length} color="error">
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                >
                  <MenuItem onClick={() => handleNavigation('/booking')}>
                    Ausrüstung buchen
                  </MenuItem>
                  <MenuItem onClick={() => handleNavigation('/admin')}>
                    Admin
                  </MenuItem>
                </Menu>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Button 
                  color="inherit" 
                  onClick={() => navigate('/booking')}
                >
                  Ausrüstung buchen
                </Button>
                <Button 
                  color="inherit" 
                  onClick={() => navigate('/admin')}
                >
                  Admin
                </Button>
                <IconButton 
                  color="inherit" 
                  onClick={() => setCartOpen(true)}
                  size="large"
                >
                  <Badge badgeContent={cartItems.length} color="error">
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      <Box 
        component="main" 
        sx={{ 
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          width: '100%',
          p: { xs: 1, sm: 4 },
          boxSizing: 'border-box',
          bgcolor: 'background.default'
        }}
      >
        <Container maxWidth="lg" sx={{ height: '100%' }}>
          <Outlet />
        </Container>
      </Box>

      <Box 
        component="footer" 
        sx={{ 
          py: 2,
          px: { xs: 1, sm: 4 },
          bgcolor: 'background.paper',
          width: '100%',
          textAlign: 'center'
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Florida Technik. Alle Rechte vorbehalten.
          </Typography>
        </Container>
      </Box>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </Box>
  );
} 