import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const fetchBookings = createAsyncThunk(
  'bookings/fetchBookings',
  async () => {
    const response = await axios.get(`${API_URL}/bookings`);
    return response.data;
  }
);

export const createBooking = createAsyncThunk(
  'bookings/createBooking',
  async (bookingData) => {
    const response = await axios.post(`${API_URL}/bookings`, bookingData);
    return response.data;
  }
);

export const updateBookingStatus = createAsyncThunk(
  'bookings/updateStatus',
  async ({ id, status }) => {
    const response = await axios.put(`${API_URL}/bookings/${id}/status`, { status });
    return response.data;
  }
);

export const checkAvailability = createAsyncThunk(
  'bookings/checkAvailability',
  async ({ productId, startDate, endDate }) => {
    const response = await axios.post(`${API_URL}/availability`, {
      productId,
      startDate,
      endDate
    });
    return response.data;
  }
);

const initialState = {
  startDate: null,
  endDate: null,
  items: [],
  status: 'idle',
  error: null,
  availability: {}
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setBookingDates: (state, action) => {
      if (action.payload.startDate !== undefined) {
        state.startDate = action.payload.startDate;
      }
      if (action.payload.endDate !== undefined) {
        state.endDate = action.payload.endDate;
      }
    },
    clearBookingDates: (state) => {
      state.startDate = null;
      state.endDate = null;
    }
  },
  extraReducers: (builder) => {
    builder
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
      .addCase(createBooking.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(checkAvailability.fulfilled, (state, action) => {
        state.availability = {
          ...state.availability,
          [action.meta.arg.productId]: action.payload.available
        };
      });
  }
});

export const { setBookingDates, clearBookingDates } = bookingSlice.actions;

export default bookingSlice.reducer; 