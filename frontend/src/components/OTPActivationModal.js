import axiosInstance from '../services/axiosInstance';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './OTPActivationModal.css';

const Otp = ({ onSuccess }) => { // Accept onSuccess prop
	const { t } = useTranslation();
	const qr_code_url = localStorage.getItem('qr_code_url');
	const BASE_URL = 'http://localhost:8000'; // Base URL for the backend
	const qrCodeImageUrl = `${BASE_URL}${qr_code_url}`; // Construct the image URL

	const [otpCode, setOtpCode] = useState('');

	const handleCodeSubmition = async (event) => {
		event.preventDefault();
		const userId = localStorage.getItem('user_id');
		const token = localStorage.getItem('token');

		try {
			const response = await axiosInstance.post(
				`${BASE_URL}/user_management/otp-active-to-true/`,
				{
					user_id: userId,
					otp_code: otpCode
				},
				{
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `JWT ${token}`
					}
				}
			);
			// Handle successful response
			console.log('Response:', response.data);
			// Remove qr_code_url from local storage
			localStorage.removeItem('qr_code_url');
			alert('2FA successfully activated');
			if (onSuccess) onSuccess(); // Call onSuccess callback
		} catch (error) {
			console.error('Error:', error);
			// Handle error response
		}
	};

	return (
		<div className="otp-modal-overlay">
			<div className="otp-modal">
        <h2 className="text-xl font-bold mb-4">{t("2FA Activation")}</h2>
				<div className="mt-4">
					<p>You need to set up Mobile Authenticator to activate your account.</p>
					<ol>
						<li>Install one of the following applications on your mobile:
							<ul>
								<li>FreeOTP</li>
								<li>Google Authenticator</li>
								<li>Microsoft Authenticator</li>
							</ul>
						</li>
						<li>Open the application and scan the barcode:
						</li>
						<img className="otp-image" src={qrCodeImageUrl} alt="QR Code"/>
						<li>Enter the one-time code provided by the application and click Submit to finish the setup.
						</li>
					</ol>
					<form onSubmit={handleCodeSubmition}>
						<div className="form-group">
							<label htmlFor="otpCode">Enter OTP Code:</label>
							<input
								type="text"
								id="otpCode"
								className="form-control"
								value={otpCode}
								onChange={(e) => setOtpCode(e.target.value)}
								required
							/>
						</div>
						<button type="submit" className="otp-input">Submit</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Otp;
