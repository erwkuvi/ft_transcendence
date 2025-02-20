import React, { useState, useContext, useEffect } from 'react';
import './LanguageDropdown.css'
import { useTranslation } from "react-i18next";
import { AccessibilityContext } from "../AccessibilityContext";
import { AuthContext } from '../context/AuthContext';
import  updateUserProfile  from '../services/patchUserProfile';

const LanguageDropdown = () => {
	const { i18n, t } = useTranslation();
	const { fontSize } = useContext(AccessibilityContext); 
	
	const {language, setLanguage} = useContext(AuthContext);

	useEffect(() => {
		i18n.changeLanguage(language);
	}, [language, i18n]);
	
	const handleChange = async (event) => {
		const lang_code = event.target.value;
		i18n.changeLanguage(lang_code);
		setLanguage(lang_code);

		try {
            await updateUserProfile({ language: lang_code});
        } catch (error) {
            console.error("Failed to update language on backend");
        }
	};

	const languages = [
		{ code: 'en', name: 'EN 🇬🇧'},
		{ code: 'pl', name: 'PL 🇵🇱'},
		{ code: 'es', name: 'ES 🇪🇸'},
		{ code: 'lt', name: 'LT 🇱🇹'},
	];

	return (
		<div className="language-dropdown" style={{ fontSize: `${fontSize}px` }}>
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