import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import './NotifMenu'
import NotifMenu from './NotifMenu';
import './LanguageDropdown'
import LanguageDropdown from './LanguageDropdown'
import { useTranslation } from "react-i18next";

const Header = () => {
	const {t} = useTranslation();

	return (
		<nav className="navbar navbar-expand-lg header m-0 p-0 pl-3">
			<div className="container-fluid menu_bar p-0">
				<Link to="/" className="navar-bran logo"><svg width="24" height="24	" xmlns="http://www.w3.org/2000/svg" fill="none"
					strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
					viewBox= "0 0 24 24" clipRule="evenodd" className="icon mr-2 p-0" stroke="currentColor">
						<path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z"/>
					</svg>
					{t("miniPong")}
				</Link>
				<LanguageDropdown/>
				<nav className="ml-auto menu custom-menu">
					<Link to="/">{t("Home")}</Link>
					<Link to="/play">{t("Play")}</Link>
					<Link to="/profile">{t("Profile")}</Link>
					<Link to="/about">{t("About")}</Link>
					<Link to="/login">{t("Log in")}</Link>
				</nav>
			</div>
			<div className="notif">
				<NotifMenu/>
			</div>
		</nav>
	);
};

export default Header;
