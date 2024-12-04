import axiosInstance from './axiosInstance';

const baseURL = `http://localhost:8000/api/users/`;

export const fetchUsers = async () => {
    try {
        const usersResponse = await axiosInstance.get(baseURL);
        return usersResponse.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};

export default { fetchUsers };