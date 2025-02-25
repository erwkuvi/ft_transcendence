import React, { useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'

export const logout = () => {
	localStorage.removeItem('access_token');
	localStorage.removeItem('refresh_token');
	// window.location.href = '/login'; // Or use navigate() inside a component
  };

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const axiosInstance = axios.create({
    baseURL: backendUrl, // Adjust the base URL as needed
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `JWT ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add interceptors to handle 401 errors and refresh token
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Check if the error response is 401 (Unauthorized) and not already retried
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem('refresh_token');
            if (!refreshToken) {
                logout();
				return Promise.reject(error);
            }

            try {
                // Attempt to refresh the access token using the refresh token
								const response = await axios.post(`${backendUrl}/api/token/refresh/`, {
                    refresh: refreshToken,
                });
                localStorage.setItem('access_token', response.data.access);  // Store the new access token

                // Update the Authorization header for the retried request
                originalRequest.headers['Authorization'] = `JWT ${response.data.access}`;
                return axios(originalRequest);  // Retry the original request with the new token
            } catch (refreshError) {
				console.error('Error refreshing token:', refreshError);  // Log the error for the refresh attempt
                logout();
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
