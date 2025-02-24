import React, { useState, useContext } from 'react';
import './LanguageDropdown.css'
import { useTranslation } from "react-i18next";
import { AccessibilityContext } from "../AccessibilityContext";

const LanguageDropdown = () => {
	const { i18n, t } = useTranslation();
	const { fontSize } = useContext(AccessibilityContext); 
	
	const [language, setLanguage] = useState('en');

	const handleChange = (event) => {
		const lang_code = event.target.value;
		i18n.changeLanguage(lang_code);
		setLanguage(lang_code);
	};

	const languages = [
		{ code: 'en', name: 'EN 🇬🇧'},
		{ code: 'pl', name: 'PL 🇵🇱'},
		{ code: 'es', name: 'ES 🇪🇸'},
		{ code: 'lt', name: 'LT 🇱🇹'},
	];

	return (
		<div className="language-dropdown">
			<label id="language-label" htmlFor="language-select" className="sr-only">
				{t("Select language")} ({t("currently")} {languages.find((l) => l.code === language)?.name})
			</label>
			<select
        		aria-live="polite"
				id="language-select"
				value={language}
				onChange={handleChange}
				className="language-select"
				aria-labelledby="language-label"
			>
				{languages.map((lang) => (
					<option key={lang.code} value={lang.code}>
						{lang.name} 
					</option>
				))}
			</select>
			<div aria-live="assertive" style={{ position: "absolute", left: "-9999px" }}>
        		{t("Language changed to")}: {languages.find((l) => l.code === language)?.name}
      		</div>
		</div>
	);
};

export default LanguageDropdown;