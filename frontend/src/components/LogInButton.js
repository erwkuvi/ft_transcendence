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
		<button className="btn button login-button py-2 px-5 mt-5"onClick={handleClick}>
			{t("LogInButton")}
		</button>
	);
};

export default LogInButton;
