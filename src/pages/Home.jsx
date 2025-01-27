import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions
} from '@mui/material';
import { 
  CalendarMonth as CalendarIcon,
  ShoppingCart as CartIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';

export default function Home() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg">
      <Box sx={{ 
        mt: 8, 
        mb: 4, 
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 'bold',
            mb: 3
          }}
        >
          Willkommen bei Florida Technik
        </Typography>
        <Typography 
          variant="h5" 
          color="text.secondary"
          sx={{ mb: 4, maxWidth: 800 }}
        >
          Hier findest du professionelles Equipment für dein nächstes Projekt.
          Einfach buchen und direkt loslegen!
        </Typography>
        <Button 
          variant="contained" 
          size="large"
          onClick={() => navigate('/booking')}
          sx={{ 
            fontSize: '1.2rem',
            py: 1.5,
            px: 4,
            mb: 8
          }}
        >
          Jetzt Equipment buchen
        </Button>

        <Typography 
          variant="h4" 
          component="h2" 
          gutterBottom
          sx={{ mb: 4 }}
        >
          So einfach geht's
        </Typography>

        <Grid container spacing={4} sx={{ mb: 8 }}>
          <Grid item xs={12} md={4}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                p: 2
              }}
            >
              <CalendarIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <CardContent>
                <Typography variant="h5" component="h3" gutterBottom align="center">
                  1. Zeitraum wählen
                </Typography>
                <Typography variant="body1" color="text.secondary" align="center">
                  Wähle deinen gewünschten Zeitraum für die Ausleihe aus
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                p: 2
              }}
            >
              <CartIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <CardContent>
                <Typography variant="h5" component="h3" gutterBottom align="center">
                  2. Equipment auswählen
                </Typography>
                <Typography variant="body1" color="text.secondary" align="center">
                  Wähle aus unserem Sortiment das Equipment, das du brauchst
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                p: 2
              }}
            >
              <CheckIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <CardContent>
                <Typography variant="h5" component="h3" gutterBottom align="center">
                  3. Buchung abschließen
                </Typography>
                <Typography variant="body1" color="text.secondary" align="center">
                  Gib deine Kontaktdaten ein und schließe die Buchung ab
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
            bgcolor: 'primary.main', 
            color: 'primary.contrastText',
            borderRadius: 2,
            textAlign: 'center',
            width: '100%'
          }}
        >
          <Typography variant="h5" gutterBottom>
            Bereit zum Loslegen?
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Starte jetzt und buche das Equipment für dein nächstes Projekt!
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            onClick={() => navigate('/booking')}
            sx={{ 
              bgcolor: 'white',
              color: 'primary.main',
              '&:hover': {
                bgcolor: 'grey.100'
              }
            }}
          >
            Zur Buchung
          </Button>
        </Paper>
      </Box>
    </Container>
  );
} 