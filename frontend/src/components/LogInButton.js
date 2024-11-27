import React from 'react';
import { Link } from 'react-router-dom';
import './LogInButton.css';
import { useTranslation } from "react-i18next";

const LogInButton = () => {
    const { t } = useTranslation();

    const handleClick = () => {
        window.open() = 'http://localhost:8000/auth/42/login/';
    };

	return (
		<button className="btn button login-button42 py-2 px-5" onClick={handleClick}>
			{t("LogInButton")}
		</button>
	);
};

export default LogInButton;