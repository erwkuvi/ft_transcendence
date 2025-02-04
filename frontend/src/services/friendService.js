import axiosInstance from './axiosInstance';

export const changeFriendStatus = async ({ userId, senderId, status, endpoint }) => {
    try {
        const response = await axiosInstance.post(
            `/friends/users/${endpoint}/`, 
            {
                sender: senderId,
                receiver: userId,
                status: status
            },
            {
                headers: {
                    'Authorization': 'JWT ' + localStorage.getItem('access'),
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error changing friend status:", error);
        throw error;
    }
};

export default { changeFriendStatus };
