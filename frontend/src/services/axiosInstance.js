import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000', // Adjust the base URL as needed
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

            // Prevent redirect loop if we're already on the login page
            if (window.location.pathname === '/login') {
                return Promise.reject(error);
            }

            const refreshToken = localStorage.getItem('refresh_token');
            if (!refreshToken) {
                window.location.href = '/login'; // If no refresh token, go to login
                return Promise.reject(error);
            }

            try {
                // Attempt to refresh the access token using the refresh token
                const response = await axios.post('http://localhost:8000/api/token/refresh/', {
                    refresh: refreshToken,
                });
                localStorage.setItem('access_token', response.data.access);  // Store the new access token

                // Update the Authorization header for the retried request
                originalRequest.headers['Authorization'] = `JWT ${response.data.access}`;
                return axios(originalRequest);  // Retry the original request with the new token
            } catch (refreshError) {
                // Log out if refreshing the token fails
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
