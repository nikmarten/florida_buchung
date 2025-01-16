import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Badge,
  Box,
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
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CartDrawer from './CartDrawer';

export default function Navbar() {
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
    <>
      <AppBar position="sticky" elevation={0}>
        <Container maxWidth="lg">
          <Toolbar sx={{ px: 0 }}>
            <Typography
              variant="h5"
              component="div"
              sx={{ 
                flexGrow: 1, 
                cursor: 'pointer',
                fontWeight: 500
              }}
              onClick={() => navigate('/')}
            >
              Florida Technik
            </Typography>

            {isMobile ? (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton
                  color="inherit"
                  onClick={handleMenuOpen}
                  size="large"
                  sx={{ ml: 1 }}
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
              <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                <Button 
                  color="inherit" 
                  onClick={() => navigate('/booking')}
                  sx={{ 
                    fontSize: '1rem',
                    textTransform: 'none',
                    fontWeight: 400
                  }}
                >
                  Ausrüstung buchen
                </Button>
                <Button 
                  color="inherit" 
                  onClick={() => navigate('/admin')}
                  sx={{ 
                    fontSize: '1rem',
                    textTransform: 'none',
                    fontWeight: 400
                  }}
                >
                  Admin
                </Button>
                <IconButton 
                  color="inherit" 
                  onClick={() => setCartOpen(true)}
                  size="large"
                  sx={{ ml: 1 }}
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

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
} 