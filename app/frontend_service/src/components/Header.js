import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
	return (
		<nav className="navbar navbar-expand-lg header m-0 p-0 pl-3">
			<div className="container-fluid p-0">
				<Link to="/" className="navar-bran logo"><svg width="24" height="24	" xmlns="http://www.w3.org/2000/svg" fill="none"
					strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
					viewBox= "0 0 24 24" clipRule="evenodd" className="icon mr-2 p-0" stroke="currentColor">
						<path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z"/>
					</svg>
					miniPong
				</Link>
				<nav className="ml-auto menu">
					<Link to="/">Home</Link>
					<Link to="/play">Play</Link>
					<Link to="/profile">Profile</Link>
					<Link to="/about">About</Link>
					<Link to="/login">Log in</Link>
				</nav>
			</div>
		</nav>
	);
};

export default Header;
