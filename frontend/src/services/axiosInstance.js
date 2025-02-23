import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000', // Adjust the base URL as needed
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add interceptors to add the access token to every request
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

// add interceptors to response to refresh the access token if it's expired
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
			if (window.location.pathname === '/login') {
				// Prevent redirect loop by rejecting the error if we're on the login page
				return Promise.reject(error);
			}
            const refreshToken = localStorage.getItem('refresh_token');
			if (!refreshToken) {
				// If no refresh token is available, redirect to login
				window.location.href = '/login';
				return Promise.reject(error);
			  }
            try {
                const response = await axios.post('http://localhost:8000/api/token/refresh/', {
                    refresh: refreshToken,
                });
				localStorage.setItem('access_token', response.data.access);

                originalRequest.headers['Authorization'] = `JWT ${response.data.access}`;
				return axios(originalRequest);
            } catch (refreshError) {
				// If refreshing the token fails, redirect to login
				window.location.href = '/login';
				return Promise.reject(refreshError);
			  }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
