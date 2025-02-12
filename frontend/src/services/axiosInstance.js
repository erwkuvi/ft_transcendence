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
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refresh_token');
            try {
                const response = await axios.post('http://localhost:8000/api/token/refresh/', {
                    refresh: refreshToken,
                });
                const { access } = response.data;
                localStorage.setItem('access_token', access);
                axiosInstance.defaults.headers.common['Authorization'] = `JWT ${access}`;
                originalRequest.headers['Authorization'] = `JWT ${access}`;
                return axiosInstance(originalRequest);
            } catch (err) {
                console.error('Refresh token is expired', err);
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                //window.location.href = '/login'; 
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
