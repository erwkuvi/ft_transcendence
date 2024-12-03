import apiClient from './apiClient';

export const changeFriendStatus = async ({ userId, senderId, status, endpoint }) => {
  try {
    const response = await apiClient.post(
        `/${endpoint}/`, 
        {
            sender: senderId,
            receiver: userId,
            status: status
        });
    return response.data;
  } catch (error) {
    console.error("Error changing friend status:", error);
    throw error;
  }
};

export default { changeFriendStatus }