import React from "react";
import { useTranslation } from "react-i18next";
import "./LeaveModal.css";

const LeaveModal = ({ isOpen, title, message, scaleStyle, onConfirm, onCancel }) => {
	const { t } = useTranslation();

	console.log("Is it open", isOpen);
    if (!isOpen) return null; // Don't render if modal is closed

    return (
        <div className="modal-overlay" role="dialog" aria-modal="true">
            <form className="modal" onSubmit={(e) => { e.preventDefault(); onConfirm(); }}>
                <h3 className="title" style={scaleStyle}>{title}</h3>
                <p className="message" style={scaleStyle}>{message}</p>
                <div className="modal-buttons">
                    <button type="button" style={scaleStyle} className="btn cancel" onClick={onCancel}>
                        {t("Cancel")}
                    </button>
                    <button type="submit" style={scaleStyle} className="btn confirm">
                        {t("Yes, Leave")}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LeaveModal;
