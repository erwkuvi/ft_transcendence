import React from 'react';
import LogInButton from '../components/LogInButton';

const LogIn = () => {
	return (
		<div className="page-content">
			<h1>log in</h1>
			<p>
				You will be redirected to login with 42.
			</p>
			<div className="col d-flex justify-content-center align-items-center">
				<LogInButton />
			</div>
		</div>
	);
};

export default LogIn;
