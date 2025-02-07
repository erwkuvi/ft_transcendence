import React, { useContext } from "react";
import { AccessibilityContext } from "../AccessibilityContext"

const ContrastToggle = () => {
    const { highContrast, setHighContrast } = useContext(AccessibilityContext);

    return (
        <button 
            onClick={() => setHighContrast(!highContrast)}
            aria-pressed={highContrast}
            className="accessibility-btn"
        >
            {highContrast ? "Disable High Contrast" : "Enable High Contrast"}
        </button>
    );
};

export default ContrastToggle;
