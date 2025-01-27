import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.token = action.payload;
      // Token im localStorage speichern
      localStorage.setItem('token', action.payload);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      // Token aus localStorage entfernen
      localStorage.removeItem('token');
    },
    // Initialisiere den Auth-Status aus dem localStorage
    initAuth: (state) => {
      const token = localStorage.getItem('token');
      if (token) {
        state.isAuthenticated = true;
        state.token = token;
      }
    },
  },
});

export const { login, logout, initAuth } = authSlice.actions;
export default authSlice.reducer; 