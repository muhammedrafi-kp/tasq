import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { IUser } from "../types";

interface AuthState {
    user: IUser | null;
    isAuthenticated: boolean;
}

const intialState: AuthState = {
    isAuthenticated: false,
    user: null,
}

const authSlice = createSlice({
    name: "auth",
    initialState: intialState,
    reducers: {
        setUser: (state, action: PayloadAction<{ user: IUser }>) => {
            state.isAuthenticated = true;
            state.user = action.payload.user;
        },
        clearUser: (state) => {
            state.isAuthenticated = false;  
            state.user = null;
        },
    },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;