import './NotifMenu.css'
import Notification from './Notification'
import { openDropdown } from './NotifMenuScript'

const NotifMenu = () => {
	return (
		<div className="dropdown">
			<button onClick={openDropdown} className="btn btn-secondary dropbtn">
				<i className="fas fa-bell bell-icon"></i>
			</button>
			<div id="drop" className="dropdown-content mt-1">
				<Notification
					title="New friend request"
					description="Lukas wants to add you as a friend"
				/>
				<Notification/>
			</div>
		</div>
	);
};

export default NotifMenu;