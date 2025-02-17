import axiosInstance from './axiosInstance';

const baseUrl = `http://localhost:8000/user_management/match-tournament/`;

export const getInfoTournament = async () => {
    try {
        const request = await axiosInstance.get(baseUrl);
        return request.data;
    } catch (error) {
        console.log("Error getting user profile:", error);
        throw error;
    }
};

export default { getInfoTournament }
