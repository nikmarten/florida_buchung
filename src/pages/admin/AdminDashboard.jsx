import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
  Container,
  Paper,
  Divider,
  ListItemButton,
  BottomNavigation,
  BottomNavigationAction,
  Fab
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import CategoryIcon from '@mui/icons-material/Category';
import BookingsIcon from '@mui/icons-material/BookOnline';
import LogoutIcon from '@mui/icons-material/Logout';
import AdminProducts from '../../components/admin/AdminProducts';
import AdminCategories from '../../components/admin/AdminCategories';
import AdminBookingsPage from '../../pages/AdminBookingsPage';
import AdminDashboardHome from '../../components/admin/AdminDashboardHome';

const drawerWidth = 280;

const menuItems = [
  { path: '/admin', label: 'Dashboard', icon: <DashboardIcon /> },
  { path: '/admin/products', label: 'Produkte', icon: <InventoryIcon /> },
  { path: '/admin/categories', label: 'Kategorien', icon: <CategoryIcon /> },
  { path: '/admin/bookings', label: 'Buchungen', icon: <BookingsIcon /> }
];

export default function AdminDashboard() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuClick = (path) => {
    navigate(path);
    if (isMobile) setMobileOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    navigate('/booking');
  };

  // Bestimme den aktuellen Navigationswert basierend auf dem Pfad
  const getCurrentNavValue = () => {
    const path = location.pathname;
    if (path === '/admin') return 0;
    if (path === '/admin/products') return 1;
    if (path === '/admin/categories') return 2;
    if (path === '/admin/bookings') return 3;
    return 0;
  };

  const currentPath = location.pathname;

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ 
        p: 3,
        borderBottom: '1px solid',
        borderColor: 'divider',
        background: theme.palette.mode === 'dark' 
          ? 'linear-gradient(45deg, #1a237e 30%, #283593 90%)'
          : 'linear-gradient(45deg, #42a5f5 30%, #1976d2 90%)',
      }}>
        <Typography 
          variant="h6" 
          sx={{ 
            color: '#fff',
            fontWeight: 'bold',
            textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
          }}
        >
          Florida Technik
        </Typography>
        <Typography 
          variant="subtitle2" 
          sx={{ 
            color: 'rgba(255,255,255,0.8)',
            mt: 1
          }}
        >
          Verwaltungsbereich
        </Typography>
      </Box>
      
      <List sx={{ flex: 1, px: 2, py: 3 }}>
        {menuItems.map((item) => (
          <ListItem 
            key={item.path} 
            disablePadding
            sx={{ mb: 1 }}
          >
            <ListItemButton
              onClick={() => handleMenuClick(item.path)}
              selected={currentPath === item.path}
              sx={{
                borderRadius: 2,
                '&.Mui-selected': {
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                  },
                  '& .MuiListItemIcon-root': {
                    color: theme.palette.primary.contrastText,
                  }
                },
                '&:hover': {
                  backgroundColor: theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.08)'
                    : 'rgba(0, 0, 0, 0.04)',
                }
              }}
            >
              <ListItemIcon sx={{ 
                minWidth: 40,
                color: currentPath === item.path ? 'inherit' : theme.palette.text.secondary
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: '0.95rem',
                  fontWeight: currentPath === item.path ? 600 : 400
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ mx: 2 }} />
      
      <Box sx={{ p: 2 }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            mb: 2,
            color: theme.palette.error.main,
            '&:hover': {
              backgroundColor: theme.palette.error.main,
              color: '#fff'
            }
          }}
        >
          <ListItemIcon sx={{ 
            minWidth: 40,
            color: 'inherit'
          }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText 
            primary="Abmelden"
            primaryTypographyProps={{
              fontSize: '0.95rem',
              fontWeight: 500
            }}
          />
        </ListItemButton>

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center' }}>
          © 2024 Florida Technik
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh',
      maxWidth: '100vw',
      overflow: 'hidden',
      pb: isMobile ? 7 : 0,
      pt: 8 // Für den Header
    }}>
      {/* Admin Sidebar */}
      <Box
        component="nav"
        sx={{ 
          width: { md: drawerWidth }, 
          flexShrink: { md: 0 }
        }}
      >
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              backgroundColor: 'background.paper',
              backgroundImage: 'none',
              mt: 8
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              backgroundColor: 'background.paper',
              backgroundImage: 'none',
              borderRight: '1px solid',
              borderColor: 'divider',
              position: 'relative',
              height: '100%',
              mt: 8
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
          height: '100%',
          overflow: 'auto',
          backgroundColor: theme.palette.mode === 'dark' 
            ? 'rgba(0, 0, 0, 0.1)'
            : 'rgba(0, 0, 0, 0.02)',
          position: 'relative'
        }}
      >
        <Container 
          maxWidth={false} 
          sx={{ 
            p: { xs: 1, sm: 2, md: 3 },
            maxWidth: '100%'
          }}
        >
          <Paper 
            elevation={0}
            sx={{ 
              p: { xs: 2, sm: 3 },
              backgroundColor: 'background.paper',
              borderRadius: 3,
              boxShadow: theme.shadows[1],
              overflow: 'hidden'
            }}
          >
            <Routes>
              <Route index element={<AdminDashboardHome />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="bookings" element={<AdminBookingsPage />} />
            </Routes>
          </Paper>
        </Container>

        {/* Mobile Bottom Navigation */}
        {isMobile && (
          <>
            {/* Logout FAB */}
            <Fab
              color="error"
              size="medium"
              onClick={handleLogout}
              sx={{
                position: 'fixed',
                right: 16,
                bottom: 80,
                zIndex: 1000
              }}
            >
              <LogoutIcon />
            </Fab>

            {/* Bottom Navigation */}
            <Paper
              sx={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                borderTop: `1px solid ${theme.palette.divider}`
              }}
              elevation={3}
            >
              <BottomNavigation
                value={getCurrentNavValue()}
                onChange={(event, newValue) => {
                  switch (newValue) {
                    case 0:
                      navigate('/admin');
                      break;
                    case 1:
                      navigate('/admin/products');
                      break;
                    case 2:
                      navigate('/admin/categories');
                      break;
                    case 3:
                      navigate('/admin/bookings');
                      break;
                    default:
                      break;
                  }
                }}
                showLabels
              >
                <BottomNavigationAction 
                  label="Dashboard" 
                  icon={<DashboardIcon />} 
                />
                <BottomNavigationAction 
                  label="Produkte" 
                  icon={<InventoryIcon />} 
                />
                <BottomNavigationAction 
                  label="Kategorien" 
                  icon={<CategoryIcon />} 
                />
                <BottomNavigationAction 
                  label="Buchungen" 
                  icon={<BookingsIcon />} 
                />
              </BottomNavigation>
            </Paper>
          </>
        )}
      </Box>
    </Box>
  );
} 