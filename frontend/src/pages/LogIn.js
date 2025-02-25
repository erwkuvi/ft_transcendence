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
import { useAuth } from '../hooks/useAuth'

const baseUrl = process.env.REACT_APP_BACKEND_URL;

const LogIn = () => {
	const {t} = useTranslation();
	const { fontSize } = useContext(AccessibilityContext); 
	const { setIsLoggedIn } = useContext(AuthContext); 
	const { handleLogout } = useAuth();

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

	useEffect(() => {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            handleLogout();  
        }
    }, [navigate, handleLogout]);

  const handleOTPSubmit = async (otp) => {
    try {
      	const response = await axiosInstance.post(baseUrl + '/mfa/', {
			username: loginCredentials.username, // Include the stored username
			password: loginCredentials.password, // Include the stored password
			otp: otp // Add the OTP code provided by the user
      	});

		const { access, refresh } = response.data;
		localStorage.setItem('access_token', access);
		localStorage.setItem('refresh_token', refresh);
    
			setShowOTPModal(false);
			setIsLoggedIn(true);
				
			navigate('/profile');
		} catch (error) {
			console.error('Error verifying OTP:', error);
			setOtp('');
		}
  	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		const signup_url = baseUrl + '/auth/users/' //api for new user registration
		const login_url = baseUrl + '/mfa/' //api for user login

		//debugging purposes begin
		// console.log('Form submitted with values:');
		// console.log('Username:', username);
		// console.log('Password:', password);
		if (isSignUp) {
			// console.log('Email:', email);
			// console.log('First Name:', firstName);
			// console.log('Last Name:', lastName);
			// console.log('Confirm Password:', confirmPassword);
		}
		//debugging purposes end

		if (isSignUp) {
			
			try {
				const response = await axiosInstance.post(signup_url, {
					username,
					email,
					password,
				});
				
				setIsSignUp(false);
			} catch (error) {
				if (error.response) {
					console.error('Error signing up:', error.response.data);
					
					if (error.response.data.username) {
						alert(t('Username already exists. Please choose a different one.'));
					}else if(error.response.data.email){
						alert(t('Email was already used. Please choose a different one.'));
					} else {
						alert(t('Sign up failed. Please try again.'));
					}
				}
			}
		} else {
				try {
					const credentials = { username, password };
					const response = await axiosInstance.post(login_url, credentials);
					
					const { access, refresh } = response.data;
					localStorage.setItem('access_token', access);
					localStorage.setItem('refresh_token', refresh);

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
			<div className="loginCardHolderStyle"> 
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
							<span className="text unchecked" aria-hidden="true">{t("LogInText")}</span>
							<span className="text checked" aria-hidden="true">{t("LogInText2")}</span>
						</div>
					</label>
				</div>
				<form onSubmit={handleSubmit} className="w-100">
					<div className="login-field">
						<p className="field-name">
							{t("LogInText3")}
							<input
								className="inputFieldStyle1"
								autoComplete="off"
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
								autoComplete="off"
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
										className="inputFieldStyle1"
										autoComplete="off"
										type="password"
										value={confirmPassword}
										onChange={(e) => setConfirmPassword(e.target.value)}
										required
									/>
								</p>
								)
						}
						<div>
							<button type="submit" className="buttonStyle1"aria-label={isSignUp ? t("SignUpButton") : t("LogInButton")} > 
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
