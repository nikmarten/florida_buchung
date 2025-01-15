import React, { useState } from 'react';
import { 
  Box, 
  Tabs, 
  Tab, 
  Typography,
  Paper
} from '@mui/material';
import AdminProducts from '../components/admin/AdminProducts';
import AdminBookings from '../components/admin/AdminBookings';

function TabPanel({ children, value, index }) {
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      sx={{ pt: 3 }}
    >
      {value === index && children}
    </Box>
  );
}

export default function Admin() {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <Box>
      <Typography 
        variant="h4" 
        component="h1" 
        gutterBottom
        sx={{ 
          mb: { xs: 3, sm: 4 },
          fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
          fontWeight: 600
        }}
      >
        Adminbereich
      </Typography>

      <Paper sx={{ width: '100%' }}>
        <Tabs 
          value={currentTab} 
          onChange={handleTabChange}
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            px: 2
          }}
        >
          <Tab label="Produkte" />
          <Tab label="Buchungen" />
        </Tabs>

        <TabPanel value={currentTab} index={0}>
          <AdminProducts />
        </TabPanel>
        <TabPanel value={currentTab} index={1}>
          <AdminBookings />
        </TabPanel>
      </Paper>
    </Box>
  );
} 