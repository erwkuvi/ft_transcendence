import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000', // Adjust the base URL as needed
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add interceptors to add the access token to every requests
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// add interceptors to refresh the access token if it's expired
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refresh_token');
            try {
                const response = await axios.post('http://localhost:8000/api/token/refresh/', {
                    refresh: refreshToken,
                });
                const { access } = response.data;
                localStorage.setItem('access_token', access);
                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${access}`;
                originalRequest.headers['Authorization'] = `Bearer ${access}`;
                return axiosInstance(originalRequest);
            } catch (err) {
                console.error('Refresh token is expired', err);
                // Handle token refresh failure (e.g., redirect to login)
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;