import React, { useState, useEffect } from "react";
import "./Footer.css";

const DarkModeToggle = () => {
	const [isDarkMode, setIsDarkMode] = useState(() => {
		return document.getElementById("htmlPage")?.getAttribute("data-bs-theme") === "dark";
	});

	useEffect(() => {
		const html = document.getElementById("htmlPage");
		html.setAttribute("data-bs-theme", isDarkMode ? "dark" : "light");
	}, [isDarkMode]);

	const toggleDarkMode = () => {
		setIsDarkMode((prevMode) => !prevMode);
	};

	return (
		<div>
			<button
				id="darkModeToggleButton"
				className="dark-mode-toggle"
				aria-label="Toggle dark mode"
				onClick={toggleDarkMode}
			>
				<i className="fas fa-circle-half-stroke dark-icon" />
			</button>
			<div 
				id="darkModeStatus" 
				aria-live="assertive" 
				style={{ position: "absolute", left: "-9999px" }}
			>
				{isDarkMode ? "Dark mode enabled" : "Dark mode disabled"}
			</div>
		</div>
	);
};

export default DarkModeToggle;
