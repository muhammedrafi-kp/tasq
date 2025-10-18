import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
    isAuthenticated: boolean;
    authToken: string;
}

const intialState: AuthState = {
    isAuthenticated: localStorage.getItem("authToken") !== null,
    authToken: localStorage.getItem("authToken") || "",
}

const authSlice = createSlice({
    name: "auth",
    initialState: intialState,
    reducers: {
        login: (state, action: PayloadAction<{ authToken: string }>) => {
            state.isAuthenticated = true;
            state.authToken = action.payload.authToken;
            localStorage.setItem("authToken", state.authToken);
        },
        logout: (state) => {
            state.isAuthenticated = false;  
            state.authToken = "";
            localStorage.removeItem("authToken");
        },
    },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;