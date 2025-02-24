import React, { useEffect, useState, useRef } from 'react';
import axiosInstance from '../services/axiosInstance';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Otp = () => {
	const {t} = useTranslation();
	const navigate = useNavigate();
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
			alert(t("2FA successfully activated"));
			navigate('/profile');
		} catch (error) {
			console.error('Error:', error);
			// Handle error response
		}
	};

	return (
		<div className="page-content">
			<h1>{t("2FA Activation")}</h1>
			<div className='container-fluid cards mt-4' >
				<div className='card basic' style={{ height: '800px'}}>
					<div className="mt-4">
						<p>{t("You need to set up Mobile Authenticator to activate your account.")}</p>
						<ol>
							<li>{t("Install one of the following applications on your mobile:")}
								<ul>
									<li>{t("FreeOTP")}</li>
									<li>{t("Google Authenticator")}</li>
									<li>{t("Microsoft Authenticator")}</li>
								</ul>
							</li>
							<li>{t("Open the application and scan the barcode:")}
								<ul>
									<li>
										<img src={qrCodeImageUrl} alt="QR Code" style={{ maxWidth: '200px', minWidth: '120px' }} />
									</li>
								</ul>
							</li>
							<li>{t("Enter the one-time code provided by the application and click Submit to finish the setup.")}</li>
						</ol>
						<form onSubmit={handleCodeSubmition}>
							<div className="form-group">
								<label htmlFor="otpCode">{t("Enter OTP Code:")}</label>
								<input
									type="text"
									id="otpCode"
									className="form-control"
									value={otpCode}
									onChange={(e) => setOtpCode(e.target.value)}
									required
								/>
							</div>
							<button type="submit" className="btn btn-primary mt-2">{t("Submit")}</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Otp;
