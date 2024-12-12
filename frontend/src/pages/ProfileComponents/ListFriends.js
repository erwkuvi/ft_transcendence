const UserList = ({ friends }) => {
	return (
	  <>
		{friends.map(user => (
		  <div> {user.username}</div>
		))}
	  </>
	);
  };
  
  export default UserList;