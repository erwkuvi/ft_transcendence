import React, { useContext, useState } from "react";
import { AccessibilityContext } from "../AccessibilityContext";
import './TextSizeControls.css';

const TextSizeControls = () => {
    const { fontSize, setFontSize } = useContext(AccessibilityContext);
    const [intervalId, setIntervalId] = useState(null);

    const handleMouseDownIncrease = () => {
        const id = setInterval(() => {
            setFontSize((prev) => Math.min(prev + 2, 48));
        }, 200); 
        setIntervalId(id);

        const handleMouseUp = () => {
            clearInterval(id);
            document.removeEventListener("mouseup", handleMouseUp);
        };
        document.addEventListener("mouseup", handleMouseUp);
    };

    const handleMouseDownDecrease = () => {
        const id = setInterval(() => {
            setFontSize((prev) => Math.max(prev - 2, 16));
        }, 200); 
        setIntervalId(id);

        const handleMouseUp = () => {
            clearInterval(id);
            document.removeEventListener("mouseup", handleMouseUp);
        };
        document.addEventListener("mouseup", handleMouseUp);
    };

    return (
        <div className="text-size-controls">
            <button
                onClick={() => setFontSize(Math.min(fontSize + 2, 48))}
                onMouseDown={handleMouseDownIncrease}
                aria-label={t("Increase text size")}
                className="accessibility-btn"
            >
                A+
            </button>

            <button
                onClick={() => setFontSize(Math.max(fontSize - 2, 16))}
                onMouseDown={handleMouseDownDecrease}
                aria-label={t("Decrease text size")}
                className="accessibility-btn"
            >
                A-
            </button>
        </div>
    );
};

export default TextSizeControls;

