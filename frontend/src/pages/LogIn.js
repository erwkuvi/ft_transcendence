import React, {useState} from 'react';
import './Login.css';
import '../components/Button.css'
import LogInButton from '../components/LogInButton';
import { useTranslation } from "react-i18next";

const LogIn = () => {
	const {t} = useTranslation();

	const [isSignUp, setIsSignUp] = useState(false);

	const handleCheckboxChange =() => {
		setIsSignUp(prevState => !prevState);
	}

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
				<div className="login-field">
					<p className="field-name">
						{t("LogInText3")}
						<input className="text-field form-control"/>
					</p>
					{isSignUp && (
						<p className="field-name">
							{t("LogInText6")}
							<input className="text-field form-control" type="email"/>
						</p>
					)}
					<p className="field-name">
						{t("LogInText4")}
						<input className="text-field form-control" type="password"/>
					</p>
					{
						isSignUp && (
							<p className="field-name">
								{t("LogInText5")}
								<input className="text-field form-control" type="password"/>
							</p>
							)
					}
					<div className="login-buttons">
						<div className="button login-button m-3 px-3 py-1">
							{
								isSignUp ? (
									<div>{t("LogInText2")}</div>
								) : (
									<div>{t("LogInText")}</div>
								)
							}
						</div>
						<LogInButton/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LogIn;
