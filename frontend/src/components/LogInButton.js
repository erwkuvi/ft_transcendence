import React from 'react';
import './LogInButton.css';
import { useTranslation } from "react-i18next";

const LogInButton = () => {
	const { t } = useTranslation();

	const handleClick = () => {
		window.location.href = 'http://localhost:8000/42-login/';
	};

	return (
		<button className="buttonStyle1" 
				onClick={handleClick}
				aria-label={t("LogInButton")}
		>
			{t("LogInButton")}
		</button>
	);
};

export default LogInButton;
