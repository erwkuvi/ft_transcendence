import axiosInstance from './axiosInstance';

const baseUrl = `http://localhost:8000/user_management/match-tournament/`;

export const getInfoTournament = async () => {
    try {
        const request = await axiosInstance.get(baseUrl, {
            headers: {
                'Content-Type': 'application/json', 
                'Authorization': 'JWT ' + localStorage.getItem('access'),
            },
        });
        return request.data;
    } catch (error) {
        console.log("Error getting tournament info:", error);
        throw error; 
    }
};

export default { getInfoTournament };
