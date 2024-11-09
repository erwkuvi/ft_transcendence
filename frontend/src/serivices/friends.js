import axios from 'axios'
const baseUrl = 'http://localhost:8000/friends/users'

const changeUserStatus = async ({userId, senderId, status, url}) => {
	const response = await axios.post(url,
		{
			sender: senderId,
			receiver: userId,
			status: status
		}
	);
	return response;
}

//   const postInvite = () => {
// 	const request = await axios.post(
// 		`${baseUrl}/send_invite`,
// 		{
// 			sender: senderId,
// 			receiver: userId,
// 			status: status
// 		}
// 	);
//     const request = axios.get(`${baseUrl}/all`)
//     return request.then(response => response.data)
//   }
//   const getCountry = (country) => {
//     const request = axios.get(`${baseUrl}/name/${country}`)
//     return request.then(response => response.data)
//   }

  export default { changeUserStatus }