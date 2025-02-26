import axiosInstance from './axiosInstance';

export const handleOAuthCallback = async (navigate, location) => {
    try {
        const params = new URLSearchParams(location.search);
        const code = params.get('code');
        const state = params.get('state');

        // The backend will handle the OAuth flow and return tokens
        const response = await axiosInstance.get(`/42-callback?code=${code}&state=${state}`);
        
        if (!response.data.access || !response.data.refresh) {
            throw new Error('Missing authentication tokens in response');
        }
		console.log("access tokens", response.data.access, response.data.refresh)
        // Store tokens
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);

        // Set authorization header
        axiosInstance.defaults.headers.common['Authorization'] = `JWT ${response.data.access}`;

        return true;
    } catch (error) {
        console.error('OAuth callback handling failed:', error);
        localStorage.clear();
        return false;
    }
};

export const isAuthenticated = () => {
    return !!localStorage.getItem('access_token');
};