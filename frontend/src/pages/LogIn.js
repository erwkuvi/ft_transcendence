import React, {useState, useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../services/axiosInstance';
import './Login.css';
import '../components/Button.css'
import LogInButton from '../components/LogInButton';
import { useTranslation } from "react-i18next";
import OTPModal from '../components/OTPModal';
import { AccessibilityContext } from '../AccessibilityContext';

const baseUrl = `http://localhost:8000/`;

const LogIn = () => {
	const {t} = useTranslation();
	const { fontSize } = useContext(AccessibilityContext); 

	const navigate = useNavigate();

	const [isSignUp, setIsSignUp] = useState(false);
  // State to control the visibility of the OTP modal for two-factor authentication
  const [showOTPModal, setShowOTPModal] = useState(false);
  // State to temporarily store login credentials while waiting for OTP verification
  // This prevents the user from having to re-enter their credentials when submitting the OTP
  const [loginCredentials, setLoginCredentials] = useState(null);

	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [email, setEmail] = useState('');
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	const handleCheckboxChange = () => {
		setIsSignUp(prevState => !prevState);
	}
  // Handler for OTP submission after the initial login attempt
  // This function is called when the user submits the OTP code in the modal
  const handleOTPSubmit = async (otp) => {
    try {
      // Send a new request with both the original credentials and the OTP code
      const response = await axiosInstance.post(baseUrl + 'otp-login/', {
        ...loginCredentials, // Include the stored username and password
        otp_code: otp // Add the OTP code provided by the user
      });

      // If OTP verification is successful, store the authentication tokens
      const { access, refresh } = response.data;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      console.log('Log in successful:', localStorage);
      // Close the OTP modal since verification is complete
      setShowOTPModal(false);
      // Redirect to the profile page after successful authentication
			navigate('/profile');
    } catch (error) {
      console.error('Error verifying OTP:', error);
      alert('Invalid OTP code. Please try again.');
    }
  };

	const handleSubmit = async (event) => {
		event.preventDefault();

		const signup_url = baseUrl + 'auth/users/' //api for new user registration
		const login_url = baseUrl + 'otp-login/' //api for user login

		//debugging purposes begin
		console.log('Form submitted with values:');
		console.log('Username:', username);
		console.log('Password:', password);
		if (isSignUp) {
			console.log('Email:', email);
			console.log('First Name:', firstName);
			console.log('Last Name:', lastName);
			console.log('Confirm Password:', confirmPassword);
		}
		//debugging purposes end

		if (isSignUp) {
			// Sign up
			try {
				const response = await axiosInstance.post(signup_url, {
					username,
					email,
					password,
				});
				console.log('Sign up successful:', response.data);
				setIsSignUp(false);
			} catch (error) {
				console.error('Error signing up:', error);
			}
		} else {
      // Handle login with potential two-factor authentication
      try {
        // Create credentials object for the initial login attempt
        const credentials = { username, password };
        const response = await axiosInstance.post(login_url, credentials);
        
        // If no OTP is required, proceed with normal login
        const { access, refresh } = response.data;
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
        console.log('Log in successful:', localStorage);
				navigate('/profile');
      } catch (error) {
        // Check if the error is specifically requesting an OTP code
        if (error.response && 
            error.response.status === 401 && 
            error.response.data.detail === "OTP code is required.") {
          // Store the credentials for use with OTP submission
          setLoginCredentials({ username, password });
          // Show the OTP modal to collect the verification code
          setShowOTPModal(true);
        } else {
          // Handle other types of login errors
          console.error('Error logging in:', error);
          alert('Login failed. Please check your credentials.');
        }
      }
		}
	};
	return (
		<div className="page-content login mt-5" style={{ fontSize: `${fontSize}px` }}>
			<h1 className="login-title">
				{t("LogInTitle")}
			</h1>
			<div className="container login-box p-4">
				<div className="login-toggle">
					<input
						id="status"
						type="checkbox"
						name="status"
						checked={isSignUp}
						onChange={handleCheckboxChange}
					/>
					<label htmlFor="status" className="status-label m-0">
						<div className="status-switch m-0 p-0">
							<div className="highlight"></div>
							<span className="text unchecked">{t("LogInText")}</span>
							<span className="text checked">{t("LogInText2")}</span>
						</div>
					</label>
				</div>
				<form onSubmit={handleSubmit}>
					<div className="login-field">
						<p className="field-name">
							{t("LogInText3")}
							<input
								className="text-field form-control"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								required
							/>
						</p>
						{isSignUp && (
							<p className="field-name">
								{t("LogInText6")}
								<input
									className="text-field form-control"
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
								/>
							</p>
						)}
						<p className="field-name">
							{t("LogInText4")}
							<input
								className="text-field form-control"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</p>
						{
							isSignUp && (
								<p className="field-name">
									{t("LogInText5")}
									<input
										className="text-field form-control"
										type="password"
										value={confirmPassword}
										onChange={(e) => setConfirmPassword(e.target.value)}
										required
									/>
								</p>
								)
						}
						<div className="login-buttons">
							<button type="submit" className="button login-button m-3 px-3 py-1" onClick={() => console.log('Submit button clicked')}>
								{isSignUp ? t("LogInText2") : t("LogInText")}
							</button>
							<LogInButton/>
						</div>
					</div>
				</form>
			</div>
      {/* Render the OTP Modal component when two-factor authentication is required */}
      {showOTPModal && (
        <OTPModal
          onSubmit={handleOTPSubmit}
          onClose={() => setShowOTPModal(false)}
        />
      )}
		</div>
	);
};

export default LogIn;

