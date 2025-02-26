import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './OTPModal.css';

const OTPModal = ({ onSubmit, onClose }) => {
  const { t } = useTranslation();
  const [otp, setOtp] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(otp);
  };

  return (
    <div className="otp-modal-overlay">
      <div className="otp-modal-version-two">
        <h2 className="text-xl font-bold mb-4">{t("Enter OTP Code")}</h2>
        <p className="text-gray-600 mb-4">
          {t("Please enter the one-time password sent to your device.")}
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
			autoComplete="off"
            className="otp-input"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder={t("Enter OTP code")}
            required
			aria-describedby="otpError"
            aria-label={t("Enter the OTP code sent to your device")}
          />
          <button type="submit" className="otp-submit" aria-label={t("Verify OTP")}>
            {t("Verify OTP")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OTPModal;
