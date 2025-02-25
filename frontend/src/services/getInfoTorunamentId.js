import axiosInstance from './axiosInstance';

const baseUrl = process.env.REACT_APP_BACKEND_URL;
const URL = (tournamentMatchID) => `${baseUrl}/user_management/tournaments/${tournamentMatchID}/`;

export const getTournamentData = async (tournamentMatchID) => {
    try {
        const response = await axiosInstance.get(URL(tournamentMatchID), {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'JWT ' + localStorage.getItem('access_token'),
            },
        });

        return response.data; // Return the tournament data
    } catch (error) {
        console.error("Error fetching tournament data:", error);
        throw error;  // Rethrow the error to be handled by the caller
    }
};

export default { getTournamentData };
