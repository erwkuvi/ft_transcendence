import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './OTPModal.css';

// OTPModal component that handles the OTP input
// Props:
// - onSubmit: callback function to handle OTP submission
// - onClose: callback function to close the modal
const OTPModal = ({ onSubmit, onClose }) => {
  // State to store the OTP input value
  const { t } = useTranslation();
  const [otp, setOtp] = useState('');
	//console.log('I am in otpmodal')
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(otp);
  };

  return (
    <div className="otp-modal-overlay">
      <div className="otp-modal">
        <h2 className="text-xl font-bold mb-4">{t("Enter OTP Code")}</h2>
        <p className="text-gray-600 mb-4">
          {t("Please enter the one-time password sent to your device.")}
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="otp-input"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP code"
            required
          />
          <button type="submit" className="otp-submit">
            {t("Verify OTP")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OTPModal;
