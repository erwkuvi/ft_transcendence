import './NotifMenu.css'
import { openDropdown } from './NotifMenuScript'

const NotifMenu = () => {
	return (
		<div className="dropdown">
			<button onClick={openDropdown} className="btn btn-secondary dropbtn">
				<i className="fas fa-bell bell-icon"></i>
			</button>
			<div id="drop" className="dropdown-content mt-1">
				<a className="dropdown-item" href="#">Notification 1</a>
				<a className="dropdown-item" href="#">Notification 2</a>
				<a className="dropdown-item" href="#">Notification 3</a>
			</div>
		</div>
	);
};

export default NotifMenu;