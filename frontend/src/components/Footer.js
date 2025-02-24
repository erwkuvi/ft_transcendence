import React from 'react';
import './Footer.css';
import DarkModeToggle from './DarkModeToggle';
import LanguageDropdown from './LanguageDropdown';
import ContrastToggle from "./ContrastToggle";
import { useTranslation } from "react-i18next";

const Footer = () => {
	const {t} = useTranslation();

	return (
		<footer className="footer" id="footerID">
				<div className="d-flex footerItemHolders">
					<a	href="https://github.com/LukasKava/ft_transcendence"
						target="_blank" 
						rel="noopener noreferrer"
						aria-label="Link to the GitHub repository for ft_transcendence (opens in a new tab)"
					>GitHub</a>
					<a	href="https://42wolfsburg.de/" 
						className="footer-link"
						target="_blank" 
						rel="noopener noreferrer"
						aria-label="Link to learn more about 42 Wolfsburg (opens in a new tab)"
					>{t("About 42")}</a>
				</div>
				<div className="d-flex footerItemHolders">
					<LanguageDropdown/>
					<DarkModeToggle />
				</div>
		</footer>
	);
};

export default Footer;
