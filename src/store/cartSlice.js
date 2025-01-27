import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { equipment, startDate, endDate } = action.payload;
      
      console.log('cartSlice - addToCart received:', {
        equipment,
        startDate,
        endDate
      });
      
      // Validate equipment object
      if (!equipment || !equipment._id) {
        console.error('Invalid equipment object provided to addToCart');
        return;
      }

      // Validate dates
      if (!startDate || !endDate) {
        console.error('Invalid dates provided to addToCart');
        return;
      }

      // Convert dates to ISO strings if they aren't already
      const startDateStr = startDate instanceof Date ? startDate.toISOString() : startDate;
      const endDateStr = endDate instanceof Date ? endDate.toISOString() : endDate;
      
      console.log('cartSlice - processed dates:', {
        startDateStr,
        endDateStr
      });
      
      // Create a clean equipment object with only the necessary fields
      const cleanEquipment = {
        _id: equipment._id,
        name: equipment.name,
        description: equipment.description,
        category: equipment.category,
        imageUrl: equipment.imageUrl
      };

      console.log('cartSlice - clean equipment:', cleanEquipment);

      const newItem = {
        id: Date.now(),
        equipment: cleanEquipment,
        startDate: startDateStr,
        endDate: endDateStr,
      };

      console.log('cartSlice - adding item:', newItem);
      state.items.push(newItem);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer; 