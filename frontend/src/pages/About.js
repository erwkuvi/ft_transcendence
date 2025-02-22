import React, { useContext } from 'react';
import { useTranslation } from "react-i18next";
import { AccessibilityContext } from '../AccessibilityContext';

import './About.css'

const About = () => {
	const {t} = useTranslation();
	const { fontSize } = useContext(AccessibilityContext); 

	return (
		<div className="d-flex flex-column align-items-center aboutPContainer" style={{ fontSize: `${fontSize}px` }}>
			<h1 className="pageHeadingH1Style1 m-0 mb-5">{t("AboutTitle")}</h1>
			<div class=" mt-3">
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
