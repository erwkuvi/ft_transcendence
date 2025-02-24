import { getAllPlayers } from '../../services/getAllUsers';

const UserList = ({ friends }) => {
	const handlePress = (user) => {
		console.log(`Button pressed for ${user.username}`);
		const fetchPlayersstatus = async() => {
			try{
				const userId = user.id
				const allPlayers = await getAllPlayers()
				const friend_id = allPlayers.find(player => player.user_id === userId);
				console.log('test', friend_id.online)
				console.log('testtttttttt', allPlayers)
			}
			catch{

			}
		}
		fetchPlayersstatus()
	};

	//	const handleRelease = (user) => {
	//		console.log(`Button released for ${user.username}`);
	//		// Add your logic for onRelease here
	//	};

	return (
		<>
			{friends.map(user => (
				<div key={user.id}>
					{user.username}
					<button
						onMouseDown={() => handlePress(user)}
						//onMouseUp={() => handleRelease(user)}
					>
						Action
					</button>
				</div>
			))}
		</>
	);
};

export default UserList;
