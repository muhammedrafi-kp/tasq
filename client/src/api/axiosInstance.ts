import axios from "axios";
import type { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import store from "../redux/store";
import { logout } from "../redux/authSlice";

const publicApiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
});

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = store.getState().auth.authToken;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error: AxiosError) => {
    return Promise.reject(error);
});

apiClient.interceptors.response.use((response: AxiosResponse) => {
    return response;
}, (error: AxiosError) => {
    if (error.response?.status === 401) {
        store.dispatch(logout());
    }
    return Promise.reject(error);
});

export { publicApiClient, apiClient };