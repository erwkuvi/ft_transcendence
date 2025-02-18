import React from "react";
import { useTranslation } from "react-i18next";
import "./LeaveModal.css";

const LeaveModal = ({ isOpen, title, message, scaleStyle, onConfirm, onCancel }) => {
	const { t } = useTranslation();
	const userLoggedInID = localStorage.getItem('user_id');

	console.log("Is it open", isOpen);
    if (!isOpen) return null; // Don't render if modal is closed

	const handleConfirm = async () => {
		try {
			const response = await fetch("http://localhost:8000/user_management/exit-tournament/", {
				method: "POST", // or "DELETE" depending on your backend
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ user_id: userLoggedInID }),
			});

			if (!response.ok) {
				throw new Error("Failed to exit tournament");
			}

			const data = await response.json();
			console.log("Successfully exited tournament", data);

			onConfirm(); // Call the parent confirm function if needed
		} catch (error) {
			console.error("Error exiting tournament:", error);
		}
	};

    return (
		<div className="tfa-modal" style={scaleStyle}>
			<div className="modal-overlay" role="dialog" aria-modal="true">
				<form className="modal" onSubmit={(e) => { e.preventDefault(); handleConfirm(); }}>
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
		</div>
    );
};

export default LeaveModal;
