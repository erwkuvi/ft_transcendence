import React, { createContext, useState, useEffect } from "react";

export const AccessibilityContext = createContext();

export const AccessibilityProvider = ({ children }) => {
    const [fontSize, setFontSize] = useState(
        parseInt(localStorage.getItem("fontSize"), 10) || 16
    );

    useEffect(() => {
        document.documentElement.style.fontSize = `${fontSize}px`;
        localStorage.setItem("fontSize", fontSize);
    }, [fontSize]);

    return (
        <AccessibilityContext.Provider value={{ fontSize, setFontSize }}>
            {children}
        </AccessibilityContext.Provider>
    );
};
