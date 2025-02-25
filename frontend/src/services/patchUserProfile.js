import axiosInstance from "./axiosInstance";
import { getUserProfile } from "./getProfile";

const ogUrl = process.env.REACT_APP_BACKEND_URL;
const baseUrl = `${ogUrl}/user_management/players/me/`;

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
		const allowedFields = ["display_name", "language", "mode", "avatar"];
        const formData = new FormData();

		Object.keys(data).forEach((key) => {
			let value = data[key];

			if (allowedFields.includes(key)) {
				if (key === "avatar") {
					if (value instanceof File) {
						formData.append(key, value);
					}
				} else {
					formData.append(key, value);
				}
			}
		});
		
        const response = await axiosInstance.patch(baseUrl, formData, {
            headers: {
                Authorization: "JWT " + localStorage.getItem("access_token"),
                "Content-Type": "multipart/form-data",
            },
        });

        // console.log("PATCH request successful:", response.data);
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

