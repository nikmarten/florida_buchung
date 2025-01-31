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
  ListItemButton
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
          onClick={() => {
            localStorage.removeItem('adminAuthenticated');
            navigate('/booking');
          }}
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
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', flex: 1 }}>
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
            p: 3,
            backgroundColor: theme.palette.mode === 'dark' 
              ? 'rgba(0, 0, 0, 0.1)'
              : 'rgba(0, 0, 0, 0.02)',
            minHeight: '100%'
          }}
        >
          <Container maxWidth="xl">
            <Paper 
              elevation={0}
              sx={{ 
                p: 3,
                backgroundColor: 'background.paper',
                borderRadius: 3,
                boxShadow: theme.shadows[1]
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
        </Box>
      </Box>
    </Box>
  );
}

function AdminDashboardHome() {
  const theme = useTheme();
  const navigate = useNavigate();
  
  return (
    <Box>
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{ 
          color: theme.palette.primary.main, 
          fontWeight: 'bold',
          mb: 4
        }}
      >
        Willkommen im Verwaltungsbereich
      </Typography>

      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        {menuItems.slice(1).map((item) => (
          <Paper
            key={item.path}
            sx={{
              p: 3,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              cursor: 'pointer',
              transition: 'all 0.2s',
              borderRadius: 2,
              border: '1px solid',
              borderColor: theme.palette.divider,
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: theme.shadows[4],
                borderColor: theme.palette.primary.main,
                '& .icon-wrapper': {
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                }
              }
            }}
            onClick={() => navigate(item.path)}
          >
            <Box 
              className="icon-wrapper"
              sx={{ 
                p: 2, 
                borderRadius: '50%', 
                backgroundColor: theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.05)'
                  : 'rgba(0, 0, 0, 0.04)',
                color: theme.palette.primary.main,
                transition: 'all 0.2s'
              }}
            >
              {item.icon}
            </Box>
            <Typography 
              variant="h6"
              sx={{ 
                fontWeight: 500,
                textAlign: 'center'
              }}
            >
              {item.label}
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                textAlign: 'center',
                mt: 1
              }}
            >
              {item.path === '/admin/products' && 'Verwalten Sie Ihr Produktinventar'}
              {item.path === '/admin/categories' && 'Organisieren Sie Ihre Produktkategorien'}
              {item.path === '/admin/bookings' && 'Überwachen Sie aktive Buchungen'}
            </Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  );
} 