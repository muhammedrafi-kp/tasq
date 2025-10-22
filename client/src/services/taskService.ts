import { apiClient } from "../api/axiosInstance";
import type { ApiResponse, ITask } from "../types/index";

export const addTask = async (formData: FormData): Promise<ApiResponse<ITask>> => {
    const res = await apiClient.post('/tasks', formData,{
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return res.data;
}

export const getTask = async (taskId: string): Promise<ApiResponse<ITask>> => {
    const res = await apiClient.get(`/tasks/${taskId}`);
    return res.data;
}

export const getTasks = async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    priority?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}): Promise<ApiResponse<ITask[]>> => {
    const queryParams = new URLSearchParams();
    
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                queryParams.append(key, value.toString());
            }
        });
    }
    
    const queryString = queryParams.toString();
    const url = queryString ? `/tasks/?${queryString}` : '/tasks/';
    
    const res = await apiClient.get(url);
    return res.data;
}