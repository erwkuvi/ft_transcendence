import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import './NotifMenu'
import NotifMenu from './NotifMenu';
import './LanguageDropdown'
import { useTranslation } from "react-i18next";

const Header = () => {
	const {t} = useTranslation();

	return (
		<div>
			<nav className="navbar header m-0 p-0">
				<div className="container-fluid p-0">
					<nav className="menu custom-menu">
						<Link to="/">{t("HeaderHome")}</Link>
						<Link to="/play">{t("HeaderPlay")}</Link>
						<Link to="/profile">{t("HeaderProfile")}</Link>
						<Link to="/about">{t("HeaderAbout")}</Link>
					</nav>
					<nav className="menu right-menu">
						<div className="notif">
							<NotifMenu/>
						</div>
						<Link to="/login" className="login">{t("HeaderLogIn")}</Link>
					</nav>
				</div>
			</nav>
		</div>
	);
};

export default Header;
