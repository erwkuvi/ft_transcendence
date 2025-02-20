import React, { useEffect, useContext } from "react";
import "./Footer.css";
import { AuthContext } from '../context/AuthContext';
import updateUserProfile from '../services/patchUserProfile';

const DarkModeToggle = () => {
    const { modeDarkLight, setModeDarkLight } = useContext(AuthContext);

    useEffect(() => {
        const html = document.getElementById("htmlPage");
        if (html) {
            html.setAttribute("data-bs-theme", modeDarkLight ? "dark" : "light");
        }
    }, [modeDarkLight]); // ✅ Depend on `modeDarkLight` only

    const toggleDarkMode = async () => {
        const newMode = !modeDarkLight; // Toggle from global state
        setModeDarkLight(newMode); // ✅ Update global state

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
                {modeDarkLight ? "Dark mode enabled" : "Dark mode disabled"}
            </div>
        </div>
    );
};

export default DarkModeToggle;
