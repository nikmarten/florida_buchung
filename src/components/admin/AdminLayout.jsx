import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Typography,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Inventory2 as Inventory2Icon,
  Category as CategoryIcon,
  BookOnline as BookingsIcon
} from '@mui/icons-material';

const DRAWER_WIDTH = 240;

const menuItems = [
  { text: 'Produkte', icon: <Inventory2Icon />, path: '/admin/products' },
  { text: 'Kategorien', icon: <CategoryIcon />, path: '/admin/categories' },
  { text: 'Buchungen', icon: <BookingsIcon />, path: '/admin/bookings' }
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            top: { xs: 0, sm: 64 }, // Berücksichtigt die AppBar-Höhe auf Desktop
            height: { xs: '100%', sm: 'calc(100% - 64px)' }
          },
        }}
      >
        <Box sx={{ overflow: 'auto', mt: { xs: 0, sm: 2 } }}>
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  selected={location.pathname === item.path}
                  onClick={() => navigate(item.path)}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` }
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
} 