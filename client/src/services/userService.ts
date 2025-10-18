import { apiClient } from "../api/axiosInstance";
import type { ApiResponse, IUser } from "../types/index";

const getUser = async (userId: string): Promise<ApiResponse<IUser>> => {
    const res = await apiClient.get(`/users/:${userId}`);
    return res.data;
}