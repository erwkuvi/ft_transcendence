import React from 'react';
import './TextBox.css';
import { useTranslation } from "react-i18next";

const Play = () => {
	const {t} = useTranslation();

	return (
		<div className="page-content">
			<h1>{t("PLAY")}</h1>
			<div className="text-box left">
				<p>{t("Ready to play some Pong?")}</p>
			</div>
			<div className="text-box middle">
				<p>{t("Too bad, because we're not ready :(")}</p>
			</div>
			<div className="text-box left">
				<p>{t("Please wait until we've finished building our site!")}</p>
			</div>
		</div>
	);
};

export default Play;
