import axiosInstance from './axiosInstance';

const URL = (tournamentMatchID) => `http://localhost:8000/user_management/tournaments/${tournamentMatchID}/`;

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
