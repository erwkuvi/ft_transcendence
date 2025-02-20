import React, {useState, useContext, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../services/axiosInstance';
import './Login.css';
import '../components/Button.css'
import LogInButton from '../components/LogInButton';
import { useTranslation } from "react-i18next";
import OTPModal from '../components/OTPModal';
import { AccessibilityContext } from '../AccessibilityContext';
import { AuthContext } from '../context/AuthContext';

const baseUrl = `http://localhost:8000/`;

const LogIn = () => {
	const {t} = useTranslation();
	const { fontSize } = useContext(AccessibilityContext); 
	const { setIsLoggedIn } = useContext(AuthContext); 

	const navigate = useNavigate();
	const [isSignUp, setIsSignUp] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
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

  const handleOTPSubmit = async (otp) => {
    try {
      //console.log('Sending OTP verification request with the following data:');
      //console.log('Username:', loginCredentials.username);
      //console.log('Password:', loginCredentials.password);

      // Send a new request with both the original credentials and the OTP code
      const response = await axiosInstance.post(baseUrl + 'mfa/', {
        username: loginCredentials.username, // Include the stored username
        password: loginCredentials.password, // Include the stored password
        otp: otp // Add the OTP code provided by the user
      });

      // If OTP verification is successful, store the authentication tokens
      const { access, refresh } = response.data;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      console.log('Log in successful:', localStorage);
      // Mark OTP as successfully submitted
      setShowOTPModal(false);
			// Update AuthContext state
			setIsLoggedIn(true);
			
      // Redirect to the profile page after successful authentication
			navigate('/profile');
    } catch (error) {
      console.error('Error verifying OTP:', error);
      console.log('Error verifying OTP:', error);
			setOtp('');
      //alert('Invalid OTP code. Please try again.');
    }
  };

	const handleSubmit = async (event) => {
		event.preventDefault();

		const signup_url = baseUrl + 'auth/users/' //api for new user registration
		const login_url = baseUrl + 'mfa/' //api for user login

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
				if (error.response) {
					console.error('Error signing up:', error.response.data);
					
					if (error.response.data.username) {
						alert(t('Username already exists. Please choose a different one.'));
					} else {
						alert(t('Sign up failed. Please try again.'));
					}
				}
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

							// Update AuthContext state
							setIsLoggedIn(true);
							navigate('/profile');
							window.location.reload();
							
				} catch (error) {
					if (error.response && 
						error.response.status === 401 && 
						error.response.data.detail === "OTP code is required.") {

					setLoginCredentials({ username, password });
					setShowOTPModal(true);
					} else {
					// Handle other types of login errors
					console.error('Error logging in:', error);
					alert(t("Login failed. Please check your credentials."));
					}
				}
			}	
		}

	return (
		<div className="page-content login" style={{ fontSize: `${fontSize}px` }}>
			<h1 className="login-title">
				{t("LogInTitle")}
			</h1>
			<div className="loginCardHolderStyle"> {/*container login-box p-4 */}
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
				<form onSubmit={handleSubmit} className="w-100">
					<div className="login-field">
						<p className="field-name">
							{t("LogInText3")}
							<input
								className="inputFieldStyle1"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								required
							/>
						</p>
						{isSignUp && (
							<p className="field-name">
								{t("LogInText6")}
								<input
									className="inputFieldStyle1"
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
								className="inputFieldStyle1"
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
										className="inputFieldStyle1" /*text-field form-control*/
										type="password"
										value={confirmPassword}
										onChange={(e) => setConfirmPassword(e.target.value)}
										required
									/>
								</p>
								)
						}
						<div>
							<button type="submit" className="buttonStyle1" onClick={() => console.log('Submit button clicked')}> {/*btn button login-button py-2 px-5*/}
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
