import axiosInstance from './axiosInstance';

const ogUrl = process.env.REACT_APP_BACKEND_URL;
const baseUrl = `${ogUrl}/user_management/players/`;

export const getAllPlayers = async () => {
    try {
        const request = await axiosInstance.get(baseUrl, {
            headers: {
				'Content-Type': 'application/json',
                'Authorization': 'JWT ' + localStorage.getItem('access_token'), 
            },
        });
        return request.data;
    } catch (error) {
        console.error("Error getting players:", error);
        throw error; 
    }
};

export default { getAllPlayers };
