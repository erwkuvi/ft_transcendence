import { changeFriendStatus } from '../../services/friendService';
import UserCard from './UserCard';
import { fetchUsers } from '../../services/fetchUsers';
import React, { useState } from 'react';

const ListUsers = ({allUsers, setAllUsers, personLoggedIn}) => {
	const [refreshKey, setRefreshKey] = useState(0);

	const handleInvite = async (userId, senderId, option) => {

		const optionMapping = {
			Invite: { endpoint: 'send_invite', status: 'pending'},
			Accept: { endpoint: 'accept_invite', status: 'accepted'},
			Reject: { endpoint: 'reject_invite', status: 'rejected'},
			Unfriend: { endpoint: 'remove_friend', status: 'removed'},
			Block: { endpoint: 'block_user', status: 'blocked'},
			Unblock: { endpoint: 'unblock_user', status: 'unblock'},
		  };
	  
		  if (option in optionMapping) {
			const { endpoint, status } = optionMapping[option];
			try {
			  // Change friend status on the server
			  await changeFriendStatus({ userId, senderId, status, endpoint });

			  const updatedUsers = await fetchUsers();
              const listUsers = updatedUsers.filter(user => user.username !== personLoggedIn.username);
			  setAllUsers(listUsers);
			  setRefreshKey(prevKey => prevKey + 1);
			} catch (error) {
			  console.error("Failed to update friend status:", error);
			}
		  } else {
			console.warn("Unknown option selected:", option);
		  }
		};

	return (
		<p>{allUsers.map((user) => (
			<UserCard 
          		user={user}
          		personLoggedIn={personLoggedIn}
          		handleInvite={handleInvite}
				refreshKey={refreshKey}
          		/>
		))}</p>
	)
}

export default ListUsers;
