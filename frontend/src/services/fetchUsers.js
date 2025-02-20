import axiosInstance from './axiosInstance';

const URL = `http://localhost:8000/api/users/`;

export const fetchUsers = async () => {
    try {
        const response = await axiosInstance.get(URL, {
            headers: {
                'Content-Type': 'application/json', 
                'Authorization': 'JWT ' + localStorage.getItem('access'),
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};

export default { fetchUsers };
