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

			if (value === undefined || value === null) {
                return;
            }
			
            if (key === "avatar") {
                if (value instanceof File) {
                    formData.append(key, value); 
                }
            }else if (key === "avatar" && typeof value === "string") {
                formData.append(key, value); 
            } else if (["curr_match", "matches_id", "tournament"].includes(key)) {
                if (value && !isNaN(value)) {
                    formData.append(key, Number(value)); 
                }
            } else if (typeof value === "boolean") {
                formData.append(key, value ? "true" : "false"); 
            } else {
                formData.append(key, value);
            }
        });

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

