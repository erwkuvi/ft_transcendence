import axiosInstance from './axiosInstance';

const baseUrl = 'http://localhost:8000/user_management/tournament-create/';

export const createTournament = async (createTournamentData) => {
    try {
        const response = await axiosInstance.post(baseUrl, createTournamentData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access_token')}`,
            },
        });

        // If the request is successful, return the data
        if (response.status === 200) {
            return { success: true, data: response.data };
        } else {
            return { success: false, error: "An error occurred while creating the tournament." };
        }
    } catch (error) {
        console.error("Error creating tournament:", error);

        if (error.response) {
            const { status, data } = error.response;

            if (status === 400) {
                return { success: false, error: data.detail || "An error occurred while creating the tournament." };
            } else {
                return { success: false, error: `Error ${status}: ${data?.message || "An unknown error occurred."}` };
            }
        } else {
            return { success: false, error: "Network error: Unable to connect to the backend." };
        }
    }
};

export default { createTournament };

