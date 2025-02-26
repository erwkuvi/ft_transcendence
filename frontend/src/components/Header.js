import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import './NotifMenu'
import NotifMenu from './NotifMenu';
import LogoutButton from './LogOutButton'; 
import './LanguageDropdown'
import TextSizeControls from "./TextSizeControls";

import { useTranslation } from "react-i18next";
import { AuthContext } from '../context/AuthContext';
import { AccessibilityContext } from "../AccessibilityContext";
import useWindowDimensions from './userWindowDimensions';

const resetMenuOptionHolder = () => {
	let menuOptionHolder = document.getElementById("menuOptionHolderID");
	if (menuOptionHolder != null) {
		menuOptionHolder.style.display = "flex";
		menuOptionHolder.style.width = "100%";
		menuOptionHolder.style.justifyContent = "space-between";
		menuOptionHolder.style.flexDirection = "row";
	}

	let menuSecondPart = document.getElementById("menuSecondPart");
	if (menuSecondPart != null) {
		menuSecondPart.style.flexDirection = "row-reverse";
	}
}

const turnOfMenuOptionHolder = () => {
	let menuOptionHolder = document.getElementById("menuOptionHolderID");
	if (menuOptionHolder != null) {
		menuOptionHolder.style.display = "none";
	}
}


const Header = () => {
	const { t } = useTranslation();
	const { fontSize } = useContext(AccessibilityContext); 
	const { isLoggedIn } = useContext(AuthContext);

	// Get window dimensions from the custom hook
	const { width, height } = useWindowDimensions();
	if (width >= 700) {
		resetMenuOptionHolder();
	} else if (width < 700) {
		turnOfMenuOptionHolder();
	}

	const displayHamburgerMenu = () => {
		let menuOptionHolder = document.getElementById("menuOptionHolderID");
		if (menuOptionHolder.style.display === "none") {
			menuOptionHolder.style.display="flex";
			menuOptionHolder.style.flexDirection="column";
			menuOptionHolder.style.gap="20px";
	
			let	firstPartOfMenu = document.getElementById("menuFirstPart");
	
			firstPartOfMenu.style.display="flex";
			firstPartOfMenu.style.flexDirection="column";
			firstPartOfMenu.style.justifyContent="top";
	
			let	secondPartOfMenu = document.getElementById("menuSecondPart");
			secondPartOfMenu.style.display="flex";
			secondPartOfMenu.style.flexDirection="column";
			secondPartOfMenu.style.gap = "8px";
			// secondPartOfMenu.style.justifyContent="top";
		} else {
			menuOptionHolder.style.display = "none";
		}
	};

	return (
		<div>
			<nav className="navbar header mt-0 p-0" id="navbarID">
					<div className="menuMobileButtons">
						{/* <Link style={{ fontSize: `${fontSize}px` }} to="/"><div className="LOGO"></div></Link> */}
						<Link to="/"><div className="LOGO"></div></Link>
						<a className="hamburgerMenu" onClick={displayHamburgerMenu}>
							<i className="fa fa-bars"></i>
						</a>
					</div>
					<div className="menuOptionHolder" id="menuOptionHolderID">
						<nav className="menu" id="menuFirstPart">
							{/* <Link style={{ fontSize: `${fontSize}px` }} to="/">{t("HeaderHome")}</Link>
							<Link style={{ fontSize: `${fontSize}px` }} to="/play">{t("HeaderPlay")}</Link>
							<Link style={{ fontSize: `${fontSize}px` }} to="/profile">{t("HeaderProfile")}</Link>
							<Link style={{ fontSize: `${fontSize}px` }} to="/about">{t("HeaderAbout")}</Link> */}
							<Link to="/">{t("HeaderHome")}</Link>
							<Link to="/play">{t("HeaderPlay")}</Link>
							<Link to="/profile">{t("HeaderProfile")}</Link>
							<Link to="/about">{t("HeaderAbout")}</Link>
						</nav>
						<nav className="menu navLogingButtonHolder align-items-center" id="menuSecondPart">
							{isLoggedIn ? (
								<LogoutButton />
							) : (
								// <Link to="/login" className="login" style={{ fontSize: `${fontSize}px` }}>
								// 	{t("HeaderLogIn")}
								// </Link>
								<Link to="/login" className="login">
									{t("HeaderLogIn")}
								</Link>
							)}
							<TextSizeControls/>
						</nav>
					</div>
			</nav>
		</div>
	);
};

export default Header;
