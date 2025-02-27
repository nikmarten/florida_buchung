import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Paper,
  Grid,
  useTheme,
  useMediaQuery,
  Chip,
  Stack,
  IconButton,
  Tooltip,
  ButtonGroup,
} from '@mui/material';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addDays, isSameDay, isWithinInterval, startOfToday, parseISO, startOfMonth, endOfMonth, isSameMonth, addMonths } from 'date-fns';
import { de } from 'date-fns/locale';
import { fetchBookings } from '../../store/bookingSlice';
import InfoIcon from '@mui/icons-material/Info';
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import TodayIcon from '@mui/icons-material/Today';

// Status-Chip Komponente
const StatusChip = ({ status }) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'warning';
      case 'confirmed':
        return 'success';
      case 'completed':
        return 'info';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'Ausstehend';
      case 'confirmed':
        return 'Bestätigt';
      case 'completed':
        return 'Abgeschlossen';
      case 'cancelled':
        return 'Storniert';
      default:
        return status;
    }
  };

  return (
    <Chip
      label={getStatusLabel(status)}
      color={getStatusColor(status)}
      size="small"
      sx={{ fontWeight: 500 }}
    />
  );
};

// Komponente für den Buchungsdetail-Dialog
const BookingDetailsDialog = ({ booking, open, onClose }) => {
  const theme = useTheme();
  
  if (!booking) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: theme.shadows[10]
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h6" gutterBottom>
              Buchungsdetails
            </Typography>
            <StatusChip status={booking.status} />
          </Box>
          <IconButton size="small" onClick={onClose}>
            <InfoIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={3}>
          {/* Kundeninformationen */}
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Kundeninformationen
            </Typography>
            <Stack spacing={1}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <PersonIcon color="action" fontSize="small" />
                <Typography variant="body1">{booking.customerName}</Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <EmailIcon color="action" fontSize="small" />
                <Typography variant="body1">{booking.customerEmail}</Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <PhoneIcon color="action" fontSize="small" />
                <Typography variant="body1">{booking.phone || 'Nicht angegeben'}</Typography>
              </Stack>
            </Stack>
          </Box>

          {/* Gebuchte Artikel */}
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Gebuchte Artikel
            </Typography>
            <Stack spacing={2}>
              {booking.items.map((item, index) => (
                <Paper
                  key={index}
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: 1,
                    bgcolor: theme.palette.background.default
                  }}
                >
                  <Stack spacing={1}>
                    <Typography variant="subtitle1" fontWeight={500}>
                      {item.product.name}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <EventIcon color="action" fontSize="small" />
                      <Typography variant="body2" color="text.secondary">
                        {format(new Date(item.startDate), 'dd.MM.yyyy', { locale: de })} - {format(new Date(item.endDate), 'dd.MM.yyyy', { locale: de })}
                      </Typography>
                    </Stack>
                    <Typography variant="body2">
                      Menge: {item.quantity} Stück
                    </Typography>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button variant="outlined" onClick={onClose}>
          Schließen
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Komponente für den Tagesbuchungen-Dialog
const DayBookingsDialog = ({ date, bookings, open, onClose, onBookingClick }) => {
  const theme = useTheme();
  
  if (!date || !bookings) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: theme.shadows[10]
        }
      }}
    >
      <DialogTitle>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">
            Buchungen am {format(date, 'dd. MMMM yyyy', { locale: de })}
          </Typography>
          <IconButton size="small" onClick={onClose}>
            <InfoIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          {bookings.length === 0 ? (
            <Typography color="text.secondary" align="center" sx={{ py: 2 }}>
              Keine Buchungen an diesem Tag
            </Typography>
          ) : (
            bookings.map((booking) => (
              <Paper
                key={booking._id}
                elevation={0}
                onClick={() => onBookingClick(booking)}
                sx={{
                  p: 2,
                  cursor: 'pointer',
                  borderRadius: 1,
                  border: `1px solid ${theme.palette.divider}`,
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: theme.palette.action.hover,
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <Stack spacing={1}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="subtitle1" fontWeight={500}>
                      {booking.customerName}
                    </Typography>
                    <StatusChip status={booking.status} />
                  </Stack>
                  <Stack spacing={0.5}>
                    {booking.items.map((item, index) => (
                      <Typography key={index} variant="body2" color="text.secondary">
                        {item.product.name} ({item.quantity}x)
                      </Typography>
                    ))}
                  </Stack>
                </Stack>
              </Paper>
            ))
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Schließen</Button>
      </DialogActions>
    </Dialog>
  );
};

export default function AdminDashboardHome() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const bookings = useSelector((state) => state.bookings.items);
  const [selectedDate, setSelectedDate] = useState(startOfToday());
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [selectedDay, setSelectedDay] = useState(null);
  const [dayDialogOpen, setDayDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchBookings());
  }, [dispatch]);

  // Funktion zum Generieren einer Farbe für eine Buchung
  const getBookingColor = (bookingId) => {
    const colors = [
      '#4285f4', // Google Blue
      '#ea4335', // Google Red
      '#34a853', // Google Green
      '#fbbc05', // Google Yellow
      '#ff7043', // Deep Orange
      '#9c27b0', // Purple
      '#795548', // Brown
      '#607d8b', // Blue Grey
      '#009688', // Teal
      '#f06292', // Pink
    ];
    const index = bookingId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  // Navigations-Funktionen
  const handlePreviousMonth = () => {
    setSelectedDate(date => addMonths(date, -1));
  };

  const handleNextMonth = () => {
    setSelectedDate(date => addMonths(date, 1));
  };

  const handleToday = () => {
    setSelectedDate(startOfToday());
  };

  // Berechne die Tage des aktuellen Monats
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  // Gruppiere die Tage in Wochen
  const weeks = [];
  let week = [];
  calendarDays.forEach(day => {
    week.push(day);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  });

  const handleDayClick = (day, dayBookings) => {
    setSelectedDay(day);
    setDayDialogOpen(true);
  };

  const handleBookingClick = (booking) => {
    setSelectedBooking(booking);
    setDayDialogOpen(false);
    setDialogOpen(true);
  };

  return (
    <Box>
      <Typography 
        variant={isMobile ? "h5" : "h4"} 
        gutterBottom
        sx={{ mb: 3 }}
      >
        Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: { xs: 2, md: 3 },
              height: '100%',
              backgroundColor: theme.palette.background.paper,
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`
            }}
          >
            {/* Kalender Header */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mb: 3
            }}>
              <Typography variant="h6">
                {format(monthStart, 'MMMM yyyy', { locale: de })}
              </Typography>
              <ButtonGroup size="small">
                <IconButton onClick={handlePreviousMonth}>
                  <NavigateBeforeIcon />
                </IconButton>
                <Button onClick={handleToday} startIcon={<TodayIcon />}>
                  Heute
                </Button>
                <IconButton onClick={handleNextMonth}>
                  <NavigateNextIcon />
                </IconButton>
              </ButtonGroup>
            </Box>

            {/* Kalender Grid */}
            <Box sx={{ width: '100%' }}>
              {/* Wochentage Header */}
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: { xs: 0.5, md: 1 },
                mb: { xs: 0.5, md: 1 },
                textAlign: 'center'
              }}>
                {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map((day) => (
                  <Typography 
                    key={day} 
                    variant={isMobile ? "caption" : "subtitle2"}
                    sx={{ 
                      py: { xs: 0.5, md: 1 },
                      color: 'text.secondary',
                      fontWeight: 500
                    }}
                  >
                    {day}
                  </Typography>
                ))}
              </Box>

              {/* Kalender Tage */}
              <Box sx={{ 
                display: 'grid',
                gridTemplateRows: `repeat(${weeks.length}, 1fr)`,
                gap: { xs: 0.5, md: 1 },
                height: { xs: 450, md: 600 }
              }}>
                {weeks.map((week, weekIndex) => (
                  <Box 
                    key={weekIndex} 
                    sx={{ 
                      display: 'grid',
                      gridTemplateColumns: 'repeat(7, 1fr)',
                      gap: { xs: 0.5, md: 1 },
                      height: '100%'
                    }}
                  >
                    {week.map((day, dayIndex) => {
                      const isToday = isSameDay(day, new Date());
                      const isCurrentMonth = isSameMonth(day, selectedDate);
                      const dayBookings = bookings.filter(booking =>
                        booking.items.some(item =>
                          isWithinInterval(day, {
                            start: new Date(item.startDate),
                            end: new Date(item.endDate)
                          })
                        )
                      );

                      return (
                        <Box
                          key={dayIndex}
                          onClick={() => handleDayClick(day, dayBookings)}
                          sx={{
                            position: 'relative',
                            height: '100%',
                            border: `1px solid ${theme.palette.divider}`,
                            borderRadius: { xs: 0.5, md: 1 },
                            bgcolor: isToday ? 'primary.light' : 'background.paper',
                            opacity: isCurrentMonth ? 1 : 0.5,
                            overflow: 'hidden',
                            cursor: 'pointer',
                            '&:hover': {
                              bgcolor: 'action.hover'
                            }
                          }}
                        >
                          {/* Datum */}
                          <Typography
                            variant={isMobile ? "caption" : "body2"}
                            sx={{
                              p: { xs: 0.25, md: 0.5 },
                              fontWeight: isToday ? 'bold' : 'normal',
                              color: isToday ? 'primary.main' : 'text.primary'
                            }}
                          >
                            {format(day, 'd')}
                          </Typography>

                          {/* Buchungen für diesen Tag */}
                          <Box sx={{ 
                            p: { xs: 0.25, md: 0.5 },
                            display: 'flex',
                            flexDirection: 'column',
                            gap: { xs: 0.25, md: 0.5 }
                          }}>
                            {dayBookings.slice(0, isMobile ? 2 : 3).map((booking, index) => (
                              <Tooltip
                                key={booking._id}
                                title={`${booking.customerName} - ${booking.items.map(item => item.product.name).join(', ')}`}
                              >
                                <Box
                                  onClick={() => {
                                    setSelectedBooking(booking);
                                    setDialogOpen(true);
                                  }}
                                  sx={{
                                    height: { xs: '4px', md: '18px' },
                                    backgroundColor: getBookingColor(booking._id),
                                    color: 'white',
                                    borderRadius: { xs: '2px', md: '4px' },
                                    fontSize: { xs: '0', md: '0.75rem' },
                                    cursor: 'pointer',
                                    overflow: 'hidden',
                                    whiteSpace: 'nowrap',
                                    textOverflow: 'ellipsis',
                                    display: 'flex',
                                    alignItems: 'center',
                                    px: { xs: 0, md: 0.5 },
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                      filter: 'brightness(0.9)',
                                      transform: 'scale(1.02)',
                                      zIndex: 1,
                                      height: { xs: '18px', md: '18px' },
                                      fontSize: { xs: '0.65rem', md: '0.75rem' }
                                    }
                                  }}
                                >
                                  {!isMobile && booking.customerName}
                                </Box>
                              </Tooltip>
                            ))}
                            {dayBookings.length > (isMobile ? 2 : 3) && (
                              <Typography
                                variant="caption"
                                sx={{
                                  display: 'block',
                                  textAlign: 'center',
                                  color: 'text.secondary',
                                  fontSize: { xs: '0.6rem', md: '0.75rem' },
                                  mt: { xs: 0.25, md: 0.5 }
                                }}
                              >
                                +{dayBookings.length - (isMobile ? 2 : 3)}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                ))}
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: { xs: 2, md: 3 },
              height: '100%',
              backgroundColor: theme.palette.background.paper,
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`
            }}
          >
            <Typography variant="h6" gutterBottom>
              Heutige Buchungen
            </Typography>
            <Stack spacing={2}>
              {bookings.filter(booking =>
                booking.items.some(item =>
                  isWithinInterval(new Date(), {
                    start: new Date(item.startDate),
                    end: new Date(item.endDate)
                  })
                )
              ).length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                  Keine Buchungen für heute
                </Typography>
              ) : (
                bookings.filter(booking =>
                  booking.items.some(item =>
                    isWithinInterval(new Date(), {
                      start: new Date(item.startDate),
                      end: new Date(item.endDate)
                    })
                  )
                ).map((booking, index) => (
                  <Paper
                    key={index}
                    elevation={0}
                    sx={{ 
                      p: 2,
                      bgcolor: theme.palette.background.default,
                      borderRadius: 1,
                      cursor: 'pointer',
                      border: `1px solid ${theme.palette.divider}`,
                      transition: 'all 0.2s',
                      '&:hover': {
                        bgcolor: theme.palette.action.hover,
                        transform: 'translateY(-2px)'
                      }
                    }}
                    onClick={() => {
                      setSelectedBooking(booking);
                      setDialogOpen(true);
                    }}
                  >
                    <Stack spacing={1}>
                      <Stack 
                        direction="row" 
                        alignItems="center" 
                        justifyContent="space-between"
                      >
                        <Typography variant="subtitle1" fontWeight={500}>
                          {booking.customerName}
                        </Typography>
                        <StatusChip status={booking.status} />
                      </Stack>
                      <Typography variant="body2" color="text.secondary">
                        {booking.items.length} {booking.items.length === 1 ? 'Artikel' : 'Artikel'}
                      </Typography>
                    </Stack>
                  </Paper>
                ))
              )}
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      <DayBookingsDialog
        date={selectedDay}
        bookings={selectedDay ? bookings.filter(booking =>
          booking.items.some(item =>
            isWithinInterval(selectedDay, {
              start: new Date(item.startDate),
              end: new Date(item.endDate)
            })
          )
        ) : []}
        open={dayDialogOpen}
        onClose={() => {
          setDayDialogOpen(false);
          setSelectedDay(null);
        }}
        onBookingClick={handleBookingClick}
      />

      <BookingDetailsDialog
        booking={selectedBooking}
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setSelectedBooking(null);
        }}
      />
    </Box>
  );
} 