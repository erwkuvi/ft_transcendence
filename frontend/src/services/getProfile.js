import axiosInstance from './axiosInstance';

const baseUrl = `http://localhost:8000/user_management/players/me/`;

export const getUserProfile = async () => {
    try {
        const request = await axiosInstance.get(baseUrl, {
            headers: {
                'Content-Type': 'application/json',  
                'Authorization': 'JWT ' + localStorage.getItem('access_token'),
            },
        });
        return request.data;
    } catch (error) {
        console.log("Error getting user profile:", error);
        throw error; 
    }
};

export default { getUserProfile };
