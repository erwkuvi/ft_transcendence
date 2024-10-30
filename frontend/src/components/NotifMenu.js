import './NotifMenu.css'
import {openDropdown} from './NotifMenuScript'

const NotifMenu = () => {
	return (
		<div className="dropdown">
			<button onClick={openDropdown} className="btn btn-secondary dropbtn"> AA </button>
			<div id="drop" className="dropdown-content">
				<a className="dropdown-item" href="#">A</a>
				<a className="dropdown-item" href="#">B</a>
				<a className="dropdown-item" href="#">C</a>
			</div>
		</div>
	);
};

export default NotifMenu;