import axiosInstance from "./axiosInstance";
import { getUserProfile } from "./getProfile";

const baseUrl = `http://localhost:8000/user_management/players/me/`;

/**
 * Update user profile dynamically using FormData.
 * Ensures proper formatting for avatar, foreign keys, and boolean values.
 * @param {Object} data - Key-value pairs of fields to update.
 */

export const updateUserProfile = async (data) => {

	const accessToken = localStorage.getItem("access_token");
	if (!accessToken) {
		// Handle the absence of the access token
		console.error("No access token available");
		return;
	}

    try {
        const profile = await getUserProfile(); 
        const updatedProfile = { ...profile, ...data };
        const formData = new FormData();

        Object.keys(updatedProfile).forEach((key) => {
            let value = updatedProfile[key];

			if (key === "avatar") {
                if (value instanceof File) {
                    formData.append(key, value);
                } else if (typeof value === "string") {
                    formData.append(key, value);
                }
            } else if (key === "matches_id" && Array.isArray(value)) {
                // If matches_id is an array, append each value separately
                value.forEach((id) => {
                    formData.append(key, id);
                });
            } else if (["curr_match", "tournament"].includes(key)) {
                // Ensure these are numbers
                if (value && !isNaN(value)) {
                    formData.append(key, Number(value));
                }
            } else if (typeof value === "boolean") {
                formData.append(key, value ? "true" : "false");
            } else {
                formData.append(key, value);
            }
        });

		for (let [key, value] of formData.entries()) {
			console.log(key, value); // Logs all form data key-value pairs
		}
		
        const response = await axiosInstance.patch(baseUrl, formData, {
            headers: {
                Authorization: "JWT " + localStorage.getItem("access_token"),
                "Content-Type": "multipart/form-data",
            },
        });

        console.log("PATCH request successful:", response.data);
        return response.data;
    } catch (error) {
        console.error(
            "Failed to update profile:",
            error.response ? error.response.data : error.message
        );

		if (error.response?.status === 400) {
            console.error("Bad Request: Invalid data format or missing fields.");
        }
        throw error;
    }
};

export default updateUserProfile;

