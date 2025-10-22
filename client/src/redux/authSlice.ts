import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { IUser } from "../types";

interface AuthState {
    user: IUser | null;
    isAuthenticated: boolean;
}

const intialState: AuthState = {
    isAuthenticated: localStorage.getItem('user') ? true : false,
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null,
}

const authSlice = createSlice({
    name: "auth",
    initialState: intialState,
    reducers: {
        setUser: (state, action: PayloadAction<{ user: IUser }>) => {
            state.isAuthenticated = true;
            state.user = action.payload.user;
            localStorage.setItem('user', JSON.stringify(action.payload.user));
        },
        clearUser: (state) => {
            state.isAuthenticated = false;  
            state.user = null;
            localStorage.removeItem('user');
        },
    },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;