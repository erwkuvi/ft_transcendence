const UserList = ({ friends }) => {
	return (
	  <>
		{friends.map((user, index) => (
  			<div key={index}> {user.username}</div>
		))}
	  </>
	);
  };
  
  export default UserList;