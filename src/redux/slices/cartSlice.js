// src/redux/slices/cartSlice.js
import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    userId: null,
  },
  reducers: {
    addToCart: (state, action) => {
      console.log("AddToCart Reducer Called");
      console.log("Current State:", JSON.stringify(state, null, 2));
      console.log("Payload:", JSON.stringify(action.payload, null, 2));

      const { product, quantity = 1, userId } = action.payload;

      // Validate inputs
      if (!product || !userId) {
        console.error("Invalid payload", action.payload);
        return state;
      }

      // Ensure userId is set in the state
      if (!state.userId) {
        state.userId = userId;
      }

      // Find existing item
      const existingItemIndex = state.items.findIndex(
        (item) => item.product._id === product._id && item.userId === userId
      );

      if (existingItemIndex > -1) {
        // Update quantity if item exists
        state.items[existingItemIndex].quantity += quantity;
        console.log("Updated existing item", state.items[existingItemIndex]);
      } else {
        // Add new item
        state.items.push({
          product,
          quantity,
          userId,
        });
        console.log("Added new item to cart");
      }
    },
    removeFromCart: (state, action) => {
      const { productId, userId } = action.payload;

      // Remove only for current user
      state.items = state.items.filter(
        (item) => !(item.product._id === productId && item.userId === userId)
      );
    },
    updateQuantity: (state, action) => {
      const { productId, quantity, userId } = action.payload;

      const itemIndex = state.items.findIndex(
        (item) => item.product._id === productId && item.userId === userId
      );

      if (itemIndex > -1) {
        if (quantity > 0) {
          state.items[itemIndex].quantity = quantity;
        } else {
          // Remove item if quantity is 0
          state.items.splice(itemIndex, 1);
        }
      }
    },
    clearCart: (state, action) => {
      // Clear cart for specific user or all items
      const userId = action.payload;

      if (userId) {
        // Clear only specific user's items
        state.items = state.items.filter((item) => item.userId !== userId);
      } else {
        // Clear all items
        state.items = [];
      }

      // Reset user ID
      state.userId = null;
    },
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
    resetCart: (state) => {
      state.items = [];
      state.userId = null;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  setUserId,
  resetCart,
} = cartSlice.actions;

export default cartSlice.reducer;
