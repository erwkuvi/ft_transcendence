//import React from 'react';
import './LogInButton.css';
import { useTranslation } from "react-i18next";
//import { generateOAuthState } from '../utils/authUtils';

//Classes for the old buttons: btn button login-button42 py-2 px-5"*/
const baseUrl = process.env.REACT_APP_BACKEND_URL;
const LogInButton = () => {
	const { t } = useTranslation();

	const handleClick = () => {
		window.location.href = `${baseUrl}/42-login/`;
	};

	return (
		<button className="buttonStyle1" onClick={handleClick}>
		{t("LogInButton")}
		</button>
	);
};import React from 'react';

export default LogInButton;
