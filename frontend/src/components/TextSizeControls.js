import React, { useContext } from "react";
import { AccessibilityContext } from "../AccessibilityContext";
import './TextSizeControls.css'

const TextSizeControls = () => {
    const { fontSize, setFontSize } = useContext(AccessibilityContext);

    return (
        <div className="text-size-controls">
            <button 
                onClick={() => setFontSize(Math.min(fontSize + 2, 48))}
                aria-label="Increase text size"
                className="accessibility-btn"
            >
                A+
            </button>
            
            <button 
                onClick={() => setFontSize(Math.max(fontSize - 2, 16))}
                aria-label="Decrease text size"
                className="accessibility-btn"
            >
                A-
            </button>
        </div>
    );
};

export default TextSizeControls;
