import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Nutze den in vite.config.js konfigurierten Proxy
const API_URL = import.meta.env.VITE_API_URL;

// Helper-Funktion für den Auth-Header
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async () => {
    const response = await axios.get(`${API_URL}/categories`);
    return response.data;
  }
);

export const addCategory = createAsyncThunk(
  'categories/addCategory',
  async (category) => {
    const response = await axios.post(`${API_URL}/categories`, category, {
      headers: getAuthHeader()
    });
    return response.data;
  }
);

export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async (category) => {
    const response = await axios.put(`${API_URL}/categories/${category._id}`, {
      label: category.label,
      value: category.value,
      order: category.order,
      description: category.description
    }, {
      headers: getAuthHeader()
    });
    return response.data;
  }
);

export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (id) => {
    await axios.delete(`${API_URL}/categories/${id}`, {
      headers: getAuthHeader()
    });
    return id;
  }
);

const initialState = {
  items: [],
  status: 'idle',
  error: null
};

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    resetStatus: (state) => {
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Categories
      .addCase(fetchCategories.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Add Category
      .addCase(addCategory.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items.push(action.payload);
        state.error = null;
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Update Category
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Delete Category
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item._id !== action.payload);
      });
  }
});

export const { resetStatus } = categorySlice.actions;
export default categorySlice.reducer; 