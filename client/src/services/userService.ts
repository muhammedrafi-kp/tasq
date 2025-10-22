import { apiClient } from "../api/axiosInstance";
import type { ApiResponse, IUser } from "../types/index";

export const getUser = async (): Promise<ApiResponse<IUser>> => {
    const res = await apiClient.get('users/me');
    return res.data;
}