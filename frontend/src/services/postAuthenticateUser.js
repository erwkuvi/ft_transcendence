import axiosInstance from './axiosInstance';

const baseUrl = process.env.REACT_APP_BACKEND_URL;
const authUrl = `${baseUrl}/user_management/simple-auth/`;

export const authenticateUser = async (credentials) => {
    try {
        const response = await axiosInstance.post(authUrl, credentials);
        return response.data;
    } catch (error) {
        console.error("Authentication failed:", error);
        throw error;
    }
};

export default { authenticateUser };
