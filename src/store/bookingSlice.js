import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Async Thunks
export const createBooking = createAsyncThunk(
  'bookings/create',
  async (bookingData) => {
    const response = await axios.post(`${API_URL}/bookings`, bookingData);
    return response.data;
  }
);

export const fetchBookings = createAsyncThunk(
  'bookings/fetchAll',
  async () => {
    const response = await axios.get(`${API_URL}/bookings`);
    return response.data;
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
      state.startDate = action.payload ? action.payload.toISOString() : null;
    },
    setEndDate: (state, action) => {
      state.endDate = action.payload ? action.payload.toISOString() : null;
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