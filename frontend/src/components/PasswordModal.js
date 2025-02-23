import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { AccessibilityContext } from '../AccessibilityContext';
import './PasswordModal.css';

const PasswordModal = ({ isOpen, onClose, onSubmit, onPasswordSuccess }) => {
    const [password, setPassword] = useState('');
	const { t } = useTranslation();
	const { fontSize } = useContext(AccessibilityContext);

	const scalestyle = {
        fontSize: `${fontSize}px`,
        lineHeight: '1.5'
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userId = localStorage.getItem('user_id');

        try {
            const response = await fetch('http://localhost:8000/user_management/otp-activate/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'JWT ' + localStorage.getItem('access_token')
                },
                body: JSON.stringify({
                    user_id: userId,
                    password: password
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                if (response.status === 400 && errorData.non_field_errors && errorData.non_field_errors.includes("OTP is already activated for this user.")) {
                    // Call the onPasswordSuccess callback if the specific error is encountered
                    if (onPasswordSuccess) onPasswordSuccess();
                    return;
                }
                throw new Error('Network response was not ok!');
            }

            const data = await response.json();
            console.log('Success:', data);
            localStorage.setItem('qr_code_url', data.qr_code_url);
            onSubmit(password);

            // Call the onPasswordSuccess callback
            if (onPasswordSuccess) onPasswordSuccess();
        } catch (error) {
            console.error('Error:', error);
        }

        setPassword('');
    };

    if (!isOpen) return null;

    return (
        <div className="tfa-box" style={scalestyle}>
            <div className="tfa-box-overlay" style={scalestyle}>
                <h2 className="tfa-title" style={scalestyle}>{t("Confirm Password")}</h2>
                <p className="tfa-message" style={scalestyle}>
                    {t("Please enter your password to confirm this action")}
                </p>
                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        value={password}
						autoComplete="off"
						style={scalestyle}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={t("Enter your password")}
                        className="tfa-input-password"
                        required
                    />
                    <div className="tfa-buttons" style={scalestyle}>
                        <button
                            type="button"
							style={scalestyle}
                            onClick={onClose}
                            className="tfa-button"
                        >
                            {t("Cancel")}
                        </button>
                        <button
                            type="submit"
							style={scalestyle}
                            className="tfa-button"
                        >
                            {t("Confirm")}
                        </button>
                    </div>
                </form>
            </div>
		</div>
    );
};

export default PasswordModal;
