import axiosInstance from './axiosInstance';
import { useNavigate } from 'react-router-dom';
const baseUrl = `http://localhost:8000/user_management/players/me/`;

export const getUserProfile = async () => {

	const navigate = useNavigate();

	const token = localStorage.getItem('access_token');
	if (!token) {
		console.log("No access token found. Redirecting to login.");
		window.location.href = '/login';
		return;
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
        console.log('Error fetching profile:', error.response?.data || error.message);
		if (error.response?.status === 401) {
			navigate('/login');
		} else {
		}
		throw error;  
    }
};

export default { getUserProfile };
