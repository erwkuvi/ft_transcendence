import React from 'react';
import './TextBox.css';
import { useTranslation } from "react-i18next";

const About = () => {
	const {t} = useTranslation();

	return (
		<div className="page-content">
			<h1>{t("ABOUT")}</h1>
			<div className="text-box left">
				<p>{t("This website was built for the final project in our 42 core, ft_transcendence.")}</p>
			</div>
			<div className="text-box middle">
				<p>{t("Our team consists of: Barry, Garry, Harry, Larry, and Shaniqua.")}</p>
			</div>
			<div className="text-box left">
				<p>{t("The source code for this website is available on")}&nbsp;
					<a href="https://github.com/LukasKava/ft_transcendence" className="footer-link"
					target="_blank" rel="noopener noreferrer">Github</a>.
				</p>
			</div>
		</div>
	);
};

export default About;
