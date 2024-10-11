import React, {useEffect} from "react";

const DarkModeToggle = () => {
	useEffect(() => {
		const html = document.getElementById("htmlPage");
		const checkbox = document.getElementById("checkbox");
		
		const handleCheckboxToggle = () => {
			if (checkbox.checked) {
				html.setAttribute("data-bs-theme", "light");
			}
			else {
				html.setAttribute("data-bs-theme", "dark");
			}
			console.log("Dark mode toggled");
		};
		
		checkbox.addEventListener("change", handleCheckboxToggle);

		return () => {
			checkbox.removeEventListener("change", handleCheckboxToggle);
		};
	}, []);

	return (
		<div className="dark-mode-toggle">
			<input type="checkbox" className="checkbox" id="checkbox" />
			<label htmlFor="checkbox" className="checkbox-label">
				<i className="fas fa-sun" />
				<i className="fas fa-moon" />
				<span className="ball" />
			</label>
		</div>
	);
}

export default DarkModeToggle;