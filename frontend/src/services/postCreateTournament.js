import axiosInstance from './axiosInstance';

const ogUrl = process.env.REACT_APP_BACKEND_URL;
const baseUrl = `${ogUrl}/user_management/tournament-create/`;

export const createTournament = async (createTournamentData) => {
    try {
        const response = await axiosInstance.post(baseUrl, createTournamentData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access_token')}`,
            },
        });

        // If the request is successful, return the response data
        return { success: true, data: response.data, error: null };
    } catch (error) {
        console.error("Error creating tournament:", error);

        let errorMessage = "An unknown error occurred.";

        if (error.response) {
            const { status, data } = error.response;

            if (status === 400) {
                if (data.detail) {
                    errorMessage = data.detail;
                } else if (typeof data === "object" && data !== null) {
                    const firstKey = Object.keys(data)[0];
                    errorMessage = data[firstKey] || errorMessage;
                } else if (typeof data === "string") {
                    errorMessage = data;
                }
            } else {
                errorMessage = `Error ${status}: ${data?.message || "An unknown error occurred."}`;
            }
        } else {
            errorMessage = "Network error: Unable to connect to the backend.";
        }

        return { success: false, data: null, error: errorMessage };
    }
};

