import React from 'react';
import LogInButton from '../components/LogInButton';
import './TextBox.css';
import { useTranslation } from "react-i18next";

const LogIn = () => {
	const {t} = useTranslation();
	return (
		<div className="page-content">
			<h1>{t("Log In")}</h1>
			<div className="col d-flex justify-content-center align-items-center">
				<LogInButton />
			</div>
		</div>
	);
};

export default LogIn;
