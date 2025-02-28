import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

// Async Thunks
export const createBooking = createAsyncThunk(
  'bookings/createBooking',
  async (bookingData, { rejectWithValue }) => {
    try {
      console.log('Sending booking data:', bookingData); // Debug-Log
      const response = await api.post('/bookings', bookingData);
      return response.data;
    } catch (error) {
      console.error('Booking error:', error); // Debug-Log
      if (error.response?.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ 
        message: error.message || 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.' 
      });
    }
  }
);

export const fetchBookings = createAsyncThunk(
  'bookings/fetchBookings',
  async () => {
    const response = await api.get('/bookings');
    return response.data;
  }
);

export const updateBooking = createAsyncThunk(
  'bookings/update',
  async ({ id, ...bookingData }) => {
    const response = await api.put(`/bookings/${id}`, bookingData);
    return response.data;
  }
);

export const deleteBooking = createAsyncThunk(
  'bookings/delete',
  async (bookingId) => {
    await api.delete(`/bookings/${bookingId}`);
    return bookingId;
  }
);

export const updateBookingReturn = createAsyncThunk(
  'bookings/updateBookingReturn',
  async ({ bookingId, items }) => {
    const response = await api.put(`/bookings/${bookingId}/return`, { items });
    return response.data;
  }
);

const initialState = {
  items: [],
  status: 'idle',
  error: null,
  startDate: null,
  endDate: null
};

const bookingSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    setStartDate: (state, action) => {
      state.startDate = action.payload;
    },
    setEndDate: (state, action) => {
      state.endDate = action.payload;
    },
    clearDates: (state) => {
      state.startDate = null;
      state.endDate = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBooking.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items.unshift(action.payload);
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || action.error.message;
      })
      .addCase(fetchBookings.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.filter(booking => booking.status !== 'cancelled');
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateBooking.fulfilled, (state, action) => {
        const index = state.items.findIndex(booking => booking._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteBooking.fulfilled, (state, action) => {
        state.items = state.items.filter(booking => booking._id !== action.payload);
      })
      .addCase(updateBookingReturn.fulfilled, (state, action) => {
        const index = state.items.findIndex(booking => booking._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  }
});

export const { setStartDate, setEndDate, clearDates } = bookingSlice.actions;
export default bookingSlice.reducer; 