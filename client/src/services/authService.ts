import { publicApiClient } from "../api/axiosInstance";
import type { ApiResponse, LoginFormData, SignupFormData, IUser } from "../types/index";

export const loginUser = async (loginData:LoginFormData): Promise<ApiResponse<IUser>> =>{
    const res = await publicApiClient.post("/auth/login",loginData);
    return res.data;
};

export const signupUser = async (userData: SignupFormData): Promise<ApiResponse<IUser>> => {
    const res = await publicApiClient.post("/auth/signup", userData);
    return res.data;
};

export const logoutUser = async (): Promise<ApiResponse<void>> => {
    const res = await publicApiClient.post("/auth/logout");
    return res.data;
};

export const googleAuthCallback = async (credential: string): Promise<ApiResponse<IUser>> => {
    const res = await publicApiClient.post("/auth/google/callback", { credential });
    return res.data;
};