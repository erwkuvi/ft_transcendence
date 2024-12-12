import React from 'react';
import { useTranslation } from "react-i18next";

const About = () => {
	const {t} = useTranslation();

	return (
		<div className="page-content">
			<h1>{t("AboutTitle")}</h1>
			<div>
				<p>
					{t("AboutT1")}
					{t("AboutT2")}
				</p>
				<p>
					{t("AboutT3")}
					<a href="https://github.com/LukasKava/ft_transcendence" className="footer-link"
					target="_blank" rel="noopener noreferrer">Github</a>.
				</p>
			</div>
		</div>
	);
};

export default About;
