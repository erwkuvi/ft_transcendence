import React from 'react';
import { useHistory } from 'react-router-dom';
import './LogInButton.css';

const LogInButton = () => {
	const history = useHistory();

	const handleClick = () => {
		history.push('/login');
	}

	return (
		<button className="btn button login-button py-2 px-5 mt-5"onClick={handleClick}>
			LOG IN WITH 42
		</button>
	);
};

export default LogInButton;
