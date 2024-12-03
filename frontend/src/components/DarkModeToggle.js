import React, {useEffect} from "react";
import './Footer.css'

const DarkModeToggle = () => {
	useEffect(() => {
		const html = document.getElementById("htmlPage");
		const toggle = document.getElementById("darkModeToggleButton");
		
		const handleToggle = () => {
			const isDarkMode = html.getAttribute("data-bs-theme") === "dark";
			html.setAttribute("data-bs-theme", isDarkMode ? "light" : "dark");
		};
		
		toggle.addEventListener("click", handleToggle);

		return () => {
			toggle.removeEventListener("click", handleToggle);
		};
	}, []);

	return (
		<button id="darkModeToggleButton" className="dark-mode-toggle">
			<i className="fas fa-circle-half-stroke dark-icon" />
		</button>
	);
}

export default DarkModeToggle;