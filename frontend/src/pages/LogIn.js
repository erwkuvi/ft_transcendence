import './Login.css';
import React, {useState} from 'react';
import axiosInstance from '../services/axiosInstance';
import '../components/Button.css'
import LogInButton from '../components/LogInButton';
import { useTranslation } from "react-i18next";
import { useHistory } from 'react-router-dom';

const baseUrl = `http://localhost:8000/`;

const LogIn = () => {
	const {t} = useTranslation();
	const history = useHistory();

	const [isSignUp, setIsSignUp] = useState(false);

	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [email, setEmail] = useState('');
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	const handleCheckboxChange = () => {
		setIsSignUp(prevState => !prevState);
	}
	const handleSubmit = async (event) => {
		event.preventDefault();

		const signup_url = baseUrl + 'auth/users/' //api for new user registration
		const login_url = baseUrl + 'api/token/' //api for user login

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
					first_name: firstName,
					last_name: lastName,
					email,
					password,
				});
				console.log('Sign up successful:', response.data);
				setIsSignUp(false);
			} catch (error) {
				console.error('Error signing up:', error);
			}
		} else {
			// Log in
			try {
				const response = await axiosInstance.post(login_url, {
					username,
					password,
				});
			  // Store tokens in localStorage
				const { access, refresh } = response.data;
				localStorage.setItem('access_token', access);
				localStorage.setItem('refresh_token', refresh);
				console.log('Log in successful:', localStorage);
				history.push('/profile');
			
			} catch (error) {
				console.error('Error logging in:', error);
			}
		}
	};
	return (
		<div className="page-content login mt-5">
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
		</div>
	);
};

export default LogIn;

