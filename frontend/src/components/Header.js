import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import './NotifMenu'
import NotifMenu from './NotifMenu';
import LogoutButton from './LogOutButton'; 
import './LanguageDropdown'
import TextSizeControls from "./TextSizeControls";

import { useTranslation } from "react-i18next";
import { AccessibilityContext } from "../AccessibilityContext";

const Header = () => {
	const {t} = useTranslation();
	const { fontSize } = useContext(AccessibilityContext); 
	
	const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('user_id'));

	// Effect to listen for changes in localStorage
	useEffect(() => {
		const handleStorageChange = () => {
			setIsLoggedIn(!!localStorage.getItem('user_id'));
		};

		window.addEventListener('storage', handleStorageChange);

		return () => {
			window.removeEventListener('storage', handleStorageChange);
		};
	}, []);


	return (
		<div>
			<nav className="navbar header m-0 p-0">
				<div className="container-fluid p-0">
					<nav className="menu custom-menu" >
						<Link style={{ fontSize: `${fontSize}px` }} to="/">{t("HeaderHome")}</Link>
						<Link style={{ fontSize: `${fontSize}px` }} to="/play">{t("HeaderPlay")}</Link>
						<Link style={{ fontSize: `${fontSize}px` }} to="/profile">{t("HeaderProfile")}</Link>
						<Link style={{ fontSize: `${fontSize}px` }} to="/about">{t("HeaderAbout")}</Link>
					</nav>
					<nav className="menu right-menu">
						<TextSizeControls/>
						<div className="notif" >
		{/*/<NotifMenu/>/*/}
						</div>
						{isLoggedIn ? (
                            <LogoutButton />
                        ) : (
                            <Link to="/login" className="login" style={{ fontSize: `${fontSize}px` }}>
                                {t("HeaderLogIn")}
                            </Link>
                        )}
					</nav>
				</div>
			</nav>
		</div>
	);
};

export default Header;
