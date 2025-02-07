import React, {useEffect} from "react";
import './Footer.css'

const DarkModeToggle = () => {
	useEffect(() => {
		const html = document.getElementById("htmlPage");
		const toggle = document.getElementById("darkModeToggleButton");
		const status = document.getElementById("darkModeStatus");

		const handleToggle = () => {
			const isDarkMode = html.getAttribute("data-bs-theme") === "dark";
			html.setAttribute("data-bs-theme", isDarkMode ? "light" : "dark");
			status.textContent = `Dark mode ${newMode === "dark" ? "enabled" : "disabled"}`;
		};
		
		toggle.addEventListener("click", handleToggle);

		return () => {
			toggle.removeEventListener("click", handleToggle);
		};
	}, []);

	return (
		<button 
			id="darkModeToggleButton" 
			className="dark-mode-toggle" 
			aria-label="Toggle dark mode"
			aria-live="polite"
		>
			<i className="fas fa-circle-half-stroke dark-icon" />
		</button>
	);
}

export default DarkModeToggle;