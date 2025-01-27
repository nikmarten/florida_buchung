import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Nutze den in vite.config.js konfigurierten Proxy
const API_URL = '/api';

// Async Thunks
export const createBooking = createAsyncThunk(
  'bookings/createBooking',
  async (bookingData, { rejectWithValue }) => {
    try {
      // Ensure dates are in ISO format and create a clean booking object
      const formattedBookingData = {
        customerName: bookingData.customerName,
        customerEmail: bookingData.customerEmail,
        notes: bookingData.notes || '',
        items: bookingData.items.map(item => ({
          productId: item.productId,
          startDate: new Date(item.startDate).toISOString(),
          endDate: new Date(item.endDate).toISOString()
        }))
      };

      const response = await axios.post(`${API_URL}/bookings`, formattedBookingData);
      return response.data;
    } catch (error) {
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
  'bookings/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/bookings`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const updateBookingStatus = createAsyncThunk(
  'bookings/updateStatus',
  async ({ id, status }) => {
    const response = await axios.patch(`${API_URL}/bookings/${id}/status`, { status });
    return response.data;
  }
);

export const deleteBooking = createAsyncThunk(
  'bookings/delete',
  async (bookingId) => {
    const response = await axios.delete(`${API_URL}/bookings/${bookingId}`);
    return bookingId;
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
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items.push(action.payload);
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchBookings.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        const index = state.items.findIndex(booking => booking._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteBooking.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteBooking.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = state.items.filter(booking => booking._id !== action.payload);
      })
      .addCase(deleteBooking.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export const { setStartDate, setEndDate, clearDates } = bookingSlice.actions;
export default bookingSlice.reducer; 