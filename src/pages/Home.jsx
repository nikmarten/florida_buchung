import React from 'react';
import { Typography, Button, Box, Paper, Grid, Container, useTheme, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { CalendarMonth, PhotoCamera, ShoppingCart, CheckCircle } from '@mui/icons-material';

export default function Home() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const features = [
    {
      icon: <CalendarMonth sx={{ fontSize: { xs: 32, sm: 40 }, color: 'primary.main' }} />,
      title: 'Einfache Zeitauswahl',
      description: 'Wählen Sie den gewünschten Zeitraum für Ihre Buchung aus.'
    },
    {
      icon: <PhotoCamera sx={{ fontSize: { xs: 32, sm: 40 }, color: 'primary.main' }} />,
      title: 'Professionelle Ausrüstung',
      description: 'Hochwertige Kamera- und Tontechnik für Ihre Projekte.'
    },
    {
      icon: <ShoppingCart sx={{ fontSize: { xs: 32, sm: 40 }, color: 'primary.main' }} />,
      title: 'Flexibler Warenkorb',
      description: 'Fügen Sie mehrere Geräte zu Ihrer Buchung hinzu.'
    },
    {
      icon: <CheckCircle sx={{ fontSize: { xs: 32, sm: 40 }, color: 'primary.main' }} />,
      title: 'Schnelle Bestätigung',
      description: 'Erhalten Sie umgehend eine Buchungsbestätigung.'
    }
  ];

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box 
        sx={{ 
          textAlign: 'center', 
          mb: { xs: 4, sm: 6, md: 8 },
          py: { xs: 4, sm: 6, md: 8 },
          px: { xs: 2, sm: 3, md: 4 },
          background: 'linear-gradient(45deg, #37474f 30%, #546e7a 90%)',
          color: 'white',
          borderRadius: { xs: '0 0 20px 20px', sm: '0 0 40px 40px' },
          width: '100%'
        }}
      >
        <Container 
          maxWidth="xl"
          sx={{ 
            maxWidth: '1400px !important',
            margin: '0 auto',
            width: '100%'
          }}
        >
          <Typography 
            variant="h1" 
            component="h1" 
            gutterBottom
            sx={{ 
              color: 'white',
              fontWeight: 'bold',
              fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem', lg: '3.5rem' },
              textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
              mb: { xs: 2, sm: 3 }
            }}
          >
            Florida Technik Buchungssystem
          </Typography>
          <Typography 
            variant="h5" 
            paragraph
            sx={{ 
              maxWidth: { xs: '100%', sm: 600, md: 800 }, 
              mx: 'auto', 
              mb: { xs: 3, sm: 4 },
              color: 'rgba(255,255,255,0.9)',
              fontSize: { xs: '1rem', sm: '1.2rem', md: '1.4rem' },
              px: { xs: 2, sm: 0 }
            }}
          >
            Buchen Sie einfach und schnell die firmeninterne Kamera- und Tontechnik für Ihre Projekte.
          </Typography>
          <Button
            variant="contained"
            size={isMobile ? "medium" : "large"}
            onClick={() => navigate('/booking')}
            sx={{ 
              py: { xs: 1, sm: 1.5, md: 2 },
              px: { xs: 3, sm: 4 },
              fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
              backgroundColor: 'white',
              color: 'primary.main',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.9)',
              },
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease'
            }}
          >
            Jetzt Ausrüstung buchen
          </Button>
        </Container>
      </Box>

      <Container 
        maxWidth="xl" 
        sx={{ 
          maxWidth: '1400px !important',
          margin: '0 auto',
          width: '100%',
          px: { xs: 2, sm: 3, md: 4 }
        }}
      >
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper 
                sx={{ 
                  p: { xs: 2, sm: 3 }, 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                  }
                }}
                elevation={2}
              >
                <Box sx={{ mb: { xs: 1.5, sm: 2 } }}>
                  {feature.icon}
                </Box>
                <Typography 
                  variant="h6" 
                  component="h2" 
                  gutterBottom
                  sx={{ 
                    fontSize: { xs: '1.1rem', sm: '1.25rem' },
                    fontWeight: 600
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ 
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    lineHeight: 1.6
                  }}
                >
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
} 