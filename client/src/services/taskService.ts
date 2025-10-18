import { apiClient } from "../api/axiosInstance";
import type { ApiResponse, TaskFormData, Task } from "../types/index";

const addTask = async (taskFormData: TaskFormData): Promise<ApiResponse<Task>> => {
    const res = await apiClient.post('/tasks', taskFormData);
    return res.data;
}

const getTask = async (taskId: string): Promise<ApiResponse<Task>> => {
    const res = await apiClient.get(`/tasks/:${taskId}`);
    return res.data;
}

const getTasks = async (): Promise<ApiResponse<Task>> => {
    const res = await apiClient.get('/tasks/');
    return res.data;
}