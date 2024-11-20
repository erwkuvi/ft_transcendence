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
		<button className="btn login-button py-2 px-5 mt-5"onClick={handleClick}>
			{t("LOG IN WITH 42")}
		</button>
	);
};

export default LogInButton;
