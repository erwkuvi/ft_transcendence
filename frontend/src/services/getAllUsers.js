import axiosInstance from './axiosInstance';

const baseUrl = `http://localhost:8000/user_management/players/`;

export const getAllPlayers = async () => {
    try {
        const request = await axiosInstance.get(baseUrl, {
            headers: {
				'Content-Type': 'application/json',
                'Authorization': 'JWT ' + localStorage.getItem('access'), 
            },
        });
        return request.data;
    } catch (error) {
        console.log("Error getting players:", error);
        throw error; 
    }
};

export default { getAllPlayers };
