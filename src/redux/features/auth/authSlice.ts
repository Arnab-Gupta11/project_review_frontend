import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  user: any | null;
  isSessionExpired: boolean;
}

const initialState: AuthState = {
  user:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "null")
      : null,
  isSessionExpired: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: any }>) => {
      state.user = action.payload.user;
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("user");
    },
    setSessionExpired: (state, action: PayloadAction<boolean>) => {
      state.isSessionExpired = action.payload;
    }
  },
});

export const { setCredentials, logout, setSessionExpired } = authSlice.actions;
export default authSlice.reducer;