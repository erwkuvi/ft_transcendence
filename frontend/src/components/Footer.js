import React from 'react';
import './Footer.css';
import DarkModeToggle from './DarkModeToggle';

const Footer = () => {
	return (
		<footer className="footer">
			<div className="container">
				<div className="row">
					<div className="col m-1 d-flex justify-content-start">
						<a href="https://github.com/LukasKava/ft_transcendence" className="footer-link  mr-4"
						target="_blank" rel="noopener noreferrer">GitHub</a>
						<a href="https://42wolfsburg.de/" className="footer-link"
						target="_blank" rel="noopener noreferrer">About 42</a>
					</div>
					<div className="col d-flex justify-content-end">
						<DarkModeToggle />
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
