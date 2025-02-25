import axiosInstance from './axiosInstance';
const ogUrl = process.env.REACT_APP_BACKEND_URL;
const baseUrl = `${ogUrl}/user_management/players/me/`;

export const getUserProfile = async () => {
	const token = localStorage.getItem('access_token');
	if (!token) {
		// console.log("No access token found. Redirecting to login.");
		throw new Error('No access token');
	}

    try {
        const request = await axiosInstance.get(baseUrl, {
            headers: {
                'Content-Type': 'application/json',  
                'Authorization': 'JWT ' + localStorage.getItem('access_token'),
            },
        });
        return request.data;
    } catch (error) {
		if (error.response && error.response.status === 401) {
            // console.log("Unauthorized access, redirecting to login...");
            throw new Error('Unauthorized access');
        }
        console.error('Error fetching profile:', error.response?.data || error.message);
		throw error;  
    }
};

export default { getUserProfile };
