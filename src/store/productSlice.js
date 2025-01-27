import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Nutze den in vite.config.js konfigurierten Proxy
const API_URL = '/api';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching products from:', `${API_URL}/products`);
      const response = await axios.get(`${API_URL}/products`);
      console.log('Fetched products:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const addProduct = createAsyncThunk(
  'products/addProduct',
  async (productData, { rejectWithValue }) => {
    try {
      console.log('Adding product:', productData);
      const response = await axios.post(`${API_URL}/products`, productData);
      console.log('Server response:', response);
      if (!response.data) {
        throw new Error('Keine Daten vom Server erhalten');
      }
      return response.data;
    } catch (error) {
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      return rejectWithValue(
        error.response?.data?.message || 
        error.response?.data || 
        error.message || 
        'Fehler beim Speichern des Produkts'
      );
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/products/${id}`, data);
      if (!response.data) {
        throw new Error('Keine Daten vom Server erhalten');
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.response?.data || 
        error.message || 
        'Fehler beim Aktualisieren des Produkts'
      );
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id) => {
    await axios.delete(`${API_URL}/products/${id}`);
    return id;
  }
);

const initialState = {
  items: [],
  status: 'idle',
  error: null
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    resetStatus: (state) => {
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      // Add Product
      .addCase(addProduct.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items.push(action.payload);
        state.error = null;
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      // Update Product
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Delete Product
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item._id !== action.payload);
      });
  }
});

export const { resetStatus } = productSlice.actions;
export default productSlice.reducer; 