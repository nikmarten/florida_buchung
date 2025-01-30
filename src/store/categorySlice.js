import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/categories');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Fehler beim Laden der Kategorien');
    }
  }
);

export const addCategory = createAsyncThunk(
  'categories/addCategory',
  async (categoryData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/categories', categoryData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Fehler beim Erstellen der Kategorie');
    }
  }
);

export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async ({ id, ...categoryData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/categories/${id}`, categoryData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Fehler beim Aktualisieren der Kategorie');
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/categories/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Fehler beim Löschen der Kategorie');
    }
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
        state.error = action.payload || 'Ein Fehler ist aufgetreten';
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
        state.error = action.payload || 'Ein Fehler ist aufgetreten';
      })
      // Update Category
      .addCase(updateCategory.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.items.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Ein Fehler ist aufgetreten';
      })
      // Delete Category
      .addCase(deleteCategory.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = state.items.filter(item => item._id !== action.payload);
        state.error = null;
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Ein Fehler ist aufgetreten';
      });
  }
});

export const { resetStatus } = categorySlice.actions;
export default categorySlice.reducer; 