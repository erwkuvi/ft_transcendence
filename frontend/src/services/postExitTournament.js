
const backendUrl = process.env.REACT_APP_BACKEND_URL;
import axiosInstance from './axiosInstance';

export const exitTournament = async (userId) => {
    try {
			const response = await axiosInstance.post(`${backendUrl}/user_management/exit-tournament/`, {
				user_id: userId
			}, {
            headers: {
				"Content-Type": "application/json",
				'Authorization': 'JWT ' + localStorage.getItem('access_token'),
				},
			}
        );

        if (response.status !== 200) throw new Error("Failed to exit tournament");

        // console.log("Successfully exited tournament");
    } catch (error) {
        console.error("Error exiting the tournament:", error);
        throw error;
    }
};

export default { exitTournament };
