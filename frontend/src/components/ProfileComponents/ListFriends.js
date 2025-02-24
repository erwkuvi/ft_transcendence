import { useState } from 'react';
import { getAllPlayers } from '../../services/getAllUsers';
import { useTranslation } from 'react-i18next';

const UserList = ({ friends }) => {
	const [onlineStatuses, setOnlineStatuses] = useState({});
	const { t } = useTranslation();
	
	const handleCheckAllStatuses = async () => {
		try {
			const allPlayers = await getAllPlayers();
			const statuses = friends.reduce((acc, user) => {
				const friend = allPlayers.find(player => player.user_id === user.id);
				acc[user.id] = friend ? friend.online : false;
				return acc;
			}, {});
			setOnlineStatuses(statuses);
		} catch (error) {
			console.error('Error fetching all statuses:', error);
		}
	};

	const handleRelease = () => {
		setOnlineStatuses({});
	};

	return (
		<>
			<button 
				onMouseDown={handleCheckAllStatuses} 
				onMouseUp={handleRelease}
				onMouseLeave={handleRelease}
			>
				{t("Check Online Status")}
			</button>

			{friends.map(user => (
				<div key={user.id} >
					{user.username}
					{onlineStatuses[user.id] && (
						<span style={{
							width: '10px',
							height: '10px',
							backgroundColor: 'green',
							borderRadius: '50%',
							display: 'inline-block'
						}}></span>
					)}
				</div>
			))}
		</>
	);
};

export default UserList;

