import React from 'react';
import { useHistory } from 'react-router-dom';
import './LogInButton.css';
import { useTranslation } from "react-i18next";

const LogInButton = () => {
	const history = useHistory();
	const {t} = useTranslation();

	const handleClick = () => {
		history.push('/login');
	}

	return (
		<a href="https://www.google.co.uk" target="_blank">
			<button className="btn button login-button py-2 px-5 mt-5">
				{t("LogInButton")}
			</button>
		</a>
	);
};

export default LogInButton;
