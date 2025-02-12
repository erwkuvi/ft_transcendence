// src/services/axiosInterceptors.js
import axios from 'axios';
import { refreshToken } from './authService';

const setupAxiosInterceptors = (axiosInstance) => {
    axiosInstance.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;

            if (error.response.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;

                try {
                    const newAccessToken = await refreshToken();
                    
                    originalRequest.headers['Authorization'] = `JWT ${newAccessToken}`;
                    return axiosInstance(originalRequest);
                } catch (refreshError) {
                    console.error('(axiosInterceptor) Token refresh failed:', refreshError);
                    return Promise.reject(refreshError);
                }
            }

            return Promise.reject(error);
        }
    );
};

export default setupAxiosInterceptors;


