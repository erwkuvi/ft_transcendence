import React from 'react';
import './LogInButton.css';
import { useTranslation } from "react-i18next";

const LogInButton = () => {
	const {t} = useTranslation();

	return (
		// target blank opens link in new tab
		<a href="https://www.google.co.uk" target="_blank">
			<button className="btn button login-button py-2 px-5 mt-5">
				{t("LogInButton")}
			</button>
		</a>
	);
};

export default LogInButton;
