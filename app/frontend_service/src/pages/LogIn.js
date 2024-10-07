import React from 'react';
import LogInButton from '../components/LogInButton';
import './TextBox.css';

const LogIn = () => {
	return (
		<div className="page-content">
			<h1>Log In</h1>
			<div className="col d-flex justify-content-center align-items-center">
				<LogInButton />
			</div>
		</div>
	);
};

export default LogIn;
