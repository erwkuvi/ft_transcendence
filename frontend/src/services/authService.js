import axiosInstance from './axiosInstance';

export const handleOAuthCallback = async () => {
    try {
        const params = new URLSearchParams(window.location.search);
        const access = params.get('access');
        const refresh = params.get('refresh');

        if (!access || !refresh) {
            throw new Error('Authentication failed');
        }

        localStorage.setItem('refresh_token', refresh);
        localStorage.setItem('access_token', access);
        axiosInstance.defaults.headers.common['Authorization'] = `JWT ${access}`;

        window.location.href = '/profile'
    } catch (err) {
        localStorage.clear();
        throw err;
    }
};