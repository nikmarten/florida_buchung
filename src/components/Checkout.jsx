import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Alert
} from '@mui/material';
import { clearCart } from '../store/cartSlice';

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    notes: ''
  });
  const [error, setError] = useState('');

  const steps = ['Kontaktdaten', 'Überprüfung', 'Bestätigung'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) return 'Bitte geben Sie Ihren Vornamen ein';
    if (!formData.lastName.trim()) return 'Bitte geben Sie Ihren Nachnamen ein';
    if (!formData.email.trim()) return 'Bitte geben Sie Ihre E-Mail-Adresse ein';
    if (!formData.phone.trim()) return 'Bitte geben Sie Ihre Telefonnummer ein';
    return '';
  };

  const handleNext = () => {
    if (activeStep === 0) {
      const validationError = validateForm();
      if (validationError) {
        setError(validationError);
        return;
      }
    }
    setError('');
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
    try {
      // Hier würde normalerweise der API-Aufruf zum Speichern der Buchung kommen
      dispatch(clearCart());
      setActiveStep(2);
    } catch (err) {
      setError('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              required
              label="Vorname"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              required
              label="Nachname"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              required
              label="E-Mail"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              required
              label="Telefon"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Anmerkungen"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              multiline
              rows={4}
              fullWidth
            />
          </Box>
        );
      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Zusammenfassung
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1">Kontaktdaten:</Typography>
              <Typography>
                {formData.firstName} {formData.lastName}
              </Typography>
              <Typography>{formData.email}</Typography>
              <Typography>{formData.phone}</Typography>
              {formData.notes && (
                <>
                  <Typography variant="subtitle1" sx={{ mt: 2 }}>
                    Anmerkungen:
                  </Typography>
                  <Typography>{formData.notes}</Typography>
                </>
              )}
            </Box>
            <Typography variant="subtitle1">Ausgewählte Produkte:</Typography>
            {cartItems.map((item) => (
              <Box key={item.equipment.id} sx={{ mb: 2 }}>
                <Typography>
                  {item.equipment.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Von: {new Date(item.startDate).toLocaleDateString()} bis{' '}
                  {new Date(item.endDate).toLocaleDateString()}
                </Typography>
              </Box>
            ))}
          </Box>
        );
      case 2:
        return (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Vielen Dank für Ihre Buchung!
            </Typography>
            <Typography>
              Wir haben Ihre Buchungsanfrage erhalten und werden uns in Kürze bei Ihnen melden.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/')}
              sx={{ mt: 3 }}
            >
              Zurück zur Startseite
            </Button>
          </Box>
        );
      default:
        return 'Unbekannter Schritt';
    }
  };

  if (cartItems.length === 0 && activeStep !== 2) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Checkout
        </Typography>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1">
            Ihr Warenkorb ist leer.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/')}
            sx={{ mt: 2 }}
          >
            Zurück zur Ausrüstung
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Checkout
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {getStepContent(activeStep)}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
          {activeStep !== 2 && (
            <>
              {activeStep !== 0 && (
                <Button onClick={handleBack}>
                  Zurück
                </Button>
              )}
              <Button
                variant="contained"
                onClick={activeStep === steps.length - 2 ? handleSubmit : handleNext}
              >
                {activeStep === steps.length - 2 ? 'Buchung abschließen' : 'Weiter'}
              </Button>
            </>
          )}
        </Box>
      </Paper>
    </Container>
  );
} 