import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import './NotifMenu'
import NotifMenu from './NotifMenu';

const Header = () => {
	return (
		<div>
			<nav className="navbar header m-0 p-0">
				<div className="container-fluid p-0">
					<nav className="menu custom-menu">
						<Link to="/">
							<i className="fa-regular fa-circle pr-3"/>
							Home
						</Link>
						<Link to="/play">Play</Link>
						<Link to="/profile">Profile</Link>
						<Link to="/about">About</Link>
					</nav>
					<nav className="menu right-menu">
						<div className="notif">
							<NotifMenu/>
						</div>
						<Link to="/login" className="login">Log in</Link>
					</nav>
				</div>
			</nav>
		</div>
	);
};

export default Header;
