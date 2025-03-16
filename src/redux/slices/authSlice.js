import { createSlice } from "@reduxjs/toolkit";
import { setUserId, resetCart } from "./cartSlice";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    isAuthenticated: false,
  },
  reducers: {
    login: (state, action) => {
      const { user, token } = action.payload;

      state.user = user;
      state.token = token;
      state.isAuthenticated = true;

      // Store in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      // Clear localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});

// Custom action creator for login
export const loginUser = (userData) => (dispatch) => {
  // Dispatch login action
  dispatch(authSlice.actions.login(userData));

  // Set user ID in cart
  dispatch(setUserId(userData.user._id));
};

// Custom action creator for logout
export const logoutUser = () => (dispatch) => {
  // Reset cart
  dispatch(resetCart());

  // Perform logout
  dispatch(authSlice.actions.logout());
};

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
