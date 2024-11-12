import { changeFriendStatus } from '../../services/friendService';
import UserCard from './UserCard';

const ListUsers = ({allUsers, personLoggedIn}) => {
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
			  await changeFriendStatus({ userId, senderId, status, endpoint });
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
          		/>
		))}</p>
	)
}

export default ListUsers;
