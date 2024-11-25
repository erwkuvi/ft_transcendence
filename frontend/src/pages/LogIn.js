import React from 'react';
import './Login.css';
import LogInButton from '../components/LogInButton';
import { useTranslation } from "react-i18next";

const LogIn = () => {
	const {t} = useTranslation();
	return (
		<div className="page-content container login">
			<h1>{t("LogInTitle")}</h1>
			<div className="login-box">
				<p>
					{t("LogInText")}
				</p>
				<div className="col d-flex justify-content-center align-items-center">
					<LogInButton />
				</div>

			</div>
		</div>
	);
};

export default LogIn;
