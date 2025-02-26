import React, { useEffect, useContext } from "react";
import "./Footer.css";
import { AuthContext } from '../context/AuthContext';
import updateUserProfile from '../services/patchUserProfile';
import { useTranslation } from "react-i18next";

const DarkModeToggle = () => {
    const { modeDarkLight, setModeDarkLight } = useContext(AuthContext);
	const { t } = useTranslation();

    useEffect(() => {
        const html = document.getElementById("htmlPage");
        if (html) {
            html.setAttribute("data-bs-theme", modeDarkLight ? "dark" : "light");
        }
    }, [modeDarkLight]); 

    const toggleDarkMode = async () => {
        const newMode = !modeDarkLight;
        setModeDarkLight(newMode); 

        try {
            await updateUserProfile({ mode: newMode });
        } catch (error) {
            console.error("Failed to update the dark/light mode on backend");
        }
    };

    return (
        <div>
            <button
                id="darkModeToggleButton"
                className="dark-mode-toggle"
                aria-label={modeDarkLight ? t("Disable high contrast mode") : t("Enable high contrast mode")} 
                onClick={toggleDarkMode}
            >
                <i className="fas fa-circle-half-stroke dark-icon" />
            </button>
            <div 
                id="darkModeStatus" 
                aria-live="assertive" 
                style={{ position: "absolute", left: "-9999px" }}
            >
                {modeDarkLight ? t("DarkModeEnabled") : t("DarkModeDisabled")}
            </div>
        </div>
    );
};

export default DarkModeToggle;
