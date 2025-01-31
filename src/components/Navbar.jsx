import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Box,
  Container,
  Menu,
  MenuItem,
  useMediaQuery,
  Tooltip,
  useTheme as useMuiTheme,
  Switch,
  styled,
  Badge
} from '@mui/material';
import { 
  Menu as MenuIcon,
  Home as HomeIcon,
  AdminPanelSettings as AdminIcon,
  ShoppingCart as CartIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTheme as useCustomTheme } from '../context/ThemeContext';
import { useSelector } from 'react-redux';
import Cart from './Cart';

// Styled Switch Component
const ThemeSwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',
      '& .MuiSwitch-thumb:before': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          '#fff',
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
    width: 32,
    height: 32,
    '&:before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        '#fff',
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
    borderRadius: 20 / 2,
  },
}));

export default function Navbar() {
  const navigate = useNavigate();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { mode, toggleMode } = useCustomTheme();
  const cartItems = useSelector((state) => state.cart.items);
  const [isCartOpen, setIsCartOpen] = React.useState(false);

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

  const handleCartOpen = () => {
    setIsCartOpen(true);
  };

  const handleCartClose = () => {
    setIsCartOpen(false);
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
              onClick={() => navigate('/booking')}
            >
              Florida Technik
            </Typography>

            {isMobile ? (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="Warenkorb">
                  <IconButton
                    color="inherit"
                    onClick={handleCartOpen}
                    size="large"
                  >
                    <Badge badgeContent={cartItems.length} color="error">
                      <CartIcon />
                    </Badge>
                  </IconButton>
                </Tooltip>
                <IconButton
                  color="inherit"
                  onClick={handleMenuOpen}
                  size="large"
                >
                  <MenuIcon />
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
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <HomeIcon />
                      Ausrüstung buchen
                    </Box>
                  </MenuItem>
                  <MenuItem onClick={handleCartOpen}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CartIcon />
                      Warenkorb ({cartItems.length})
                    </Box>
                  </MenuItem>
                  <MenuItem onClick={() => handleNavigation('/admin')}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AdminIcon />
                      Admin
                    </Box>
                  </MenuItem>
                  <MenuItem onClick={(e) => e.stopPropagation()}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      width: '100%'
                    }}>
                      <span>{mode === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                      <ThemeSwitch
                        checked={mode === 'dark'}
                        onChange={toggleMode}
                      />
                    </Box>
                  </MenuItem>
                </Menu>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Tooltip title="Ausrüstung buchen">
                  <IconButton 
                    color="inherit"
                    onClick={() => navigate('/booking')}
                    size="large"
                  >
                    <HomeIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Warenkorb">
                  <IconButton 
                    color="inherit"
                    onClick={handleCartOpen}
                    size="large"
                  >
                    <Badge badgeContent={cartItems.length} color="error">
                      <CartIcon />
                    </Badge>
                  </IconButton>
                </Tooltip>
                <Tooltip title="Admin-Bereich">
                  <IconButton 
                    color="inherit"
                    onClick={() => navigate('/admin')}
                    size="large"
                  >
                    <AdminIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title={mode === 'light' ? 'Dark Mode' : 'Light Mode'}>
                  <ThemeSwitch
                    checked={mode === 'dark'}
                    onChange={toggleMode}
                  />
                </Tooltip>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      <Cart open={isCartOpen} onClose={handleCartClose} />
    </>
  );
} 