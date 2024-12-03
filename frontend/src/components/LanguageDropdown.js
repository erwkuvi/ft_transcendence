import React, { useState } from 'react';
import './LanguageDropdown.css'
import { useTranslation } from "react-i18next";

const LanguageDropdown = () => {
	const { i18n, t } = useTranslation();
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
			<select
				value={language}
				onChange={handleChange}
				className="language-select"
			>
				{languages.map((lang) => (
					<option key={lang.code} value={lang.code}>
						{lang.name} 
					</option>
				))}
			</select>
		</div>
	);
};

export default LanguageDropdown