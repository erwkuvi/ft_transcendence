import React from 'react';
import Main from '../components/Main';
import LogInButton from '../components/LogInButton';
import './TextBox.css';

const LogIn = () => {
	return (
		<div className="page-content">
			<h1>Log In</h1>
			<Main>
				<LogInButton />
			</Main>
		</div>
	);
};

export default LogIn;
