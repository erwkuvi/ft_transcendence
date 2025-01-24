import axiosInstance from './axiosInstance';

export const handleOAuthCallback = async () => {
    try {
        // Retrieve URL parameters
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const state = params.get('state');

        // Validate state parameter
        const storedState = localStorage.getItem('oauth_state');
        if (!state || state !== storedState) {
            throw new Error('Invalid state parameter');
        }

        // Remove stored state to prevent reuse
        localStorage.removeItem('oauth_state');

        // Send authorization code to backend
        const response = await axiosInstance.post('/api/oauth/42/callback', { code });

        // Extract and store tokens
        const { access_token, refresh_token } = response.data;

        // Store tokens in local storage
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);

        // Update axios default headers for future requests
        axiosInstance.defaults.headers.common['Authorization'] = `JWT ${access_token}`;

        return response.data;
    } catch (error) {
        // Clear any existing tokens on failure
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        throw error;
    }
};

//export const handleOAuthCallback = async () => {
//    try {
//        const params = new URLSearchParams(window.location.search);
//        const access = params.get('access');
//        const refresh = params.get('refresh');
//
//        if (!access || !refresh) {
//            throw new Error('Authentication failed');
//        }
//
//			localStorage.setItem('access_token', access);
//			localStorage.setItem('refresh_token', refresh);
//			axiosInstance.defaults.headers.common['Authorization'] = `JWT ${access}`;
//
//        window.location.href = '/profile'
//    } catch (err) {
//        localStorage.clear();
//        throw err;
//    }
//};
