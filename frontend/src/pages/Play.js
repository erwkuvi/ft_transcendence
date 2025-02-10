import React, {useState, useContext, useEffect} from 'react';
import './Play.css';
import { useTranslation } from "react-i18next";
import Pong from '../components/game/Pong';
import { AccessibilityContext } from '../AccessibilityContext';
import AuthUser from '../components/game/AuthUser' 

const baseUrl = `http://localhost:8000/`;

const Play = () => {
	const {t} = useTranslation();
	const { fontSize } = useContext(AccessibilityContext); 
	
	const [isReadyToPlay, setIsReadyToPlay] = useState(null);
	const [showAuthModal, setShowAuthModal] = useState(false);
	const [isOpponentAuthenticated, setIsOpponentAuthenticated] = useState(false);
	const [credentials, setCredentials] = useState({
		username: '',
		password: ''
	  });
	const [error, setError] = useState('');

	// const handleModeSelect = (mode) => {
	// 	setIsReadyToPlay(mode);
	// };

	const handleModeSelect = (mode) => {
		setIsReadyToPlay(mode);
	  };
	
	const handleAuthentication = async (e) => {
		e.preventDefault();
		try {
		  const response = await fetch('http://localhost:8000/user_management/simple-auth/', {
			method: 'POST',
			headers: {
			  'Content-Type': 'application/json',
			},
			body: JSON.stringify(credentials),
		  });
	
		  if (response.ok) {
			setIsOpponentAuthenticated(true);
			setError('');
		  } else {
			setError('Invalid credentials');
			setIsOpponentAuthenticated(false);
		  }
		} catch (err) {
		  setError('Authentication failed');
		  setIsOpponentAuthenticated(false);
		}
	};

	const scaleStyle = {
		fontSize: `${fontSize}px`,
		lineHeight: '1.5'
	};

	//check if user is logged in 
	//check if second player is authenticated 
	//this is the endpoint to check the passowrd: localhost:8000/user_management/simple-auth/
	//if so I can click on the button, if not button doesnt work

	return (
		<div className="page-content play">
			{isReadyToPlay ? (
			<div>
				<Pong className="focus-pong"/>
				<button className="btn button mt-4" 
					style={scaleStyle} 
					onClick={() => {
						setSelectedMode(null);
						setIsOpponentAuthenticated(false);
					}}
					>
					Back to Mode Selection
				</button>
				</div>
			) : (
				<>
					<h1 className="title mt-5">
						{t("PlayTitle")}
					</h1>
					<div className="modes mt-4">
						<div className="row justify-content-center" >
							<div className="mode" >
								<h3 style={scaleStyle}>{t("PlaySH1")}</h3>
								<p style={scaleStyle}>{t("PlayT1")}</p>
								
								<button className="btn button" style={scaleStyle} onClick={() => handleModeSelect("singleplayer")}>
									{t("PlayB1")}
								</button>
							</div>
							<div className="mode">
								<h3 style={scaleStyle}>{t("PlaySH2")}</h3>
								<p style={scaleStyle}>{t("PlayT2")}</p>
								<div className="auth-form">
								<form onSubmit={handleAuthentication} className="space-y-4">
									<div>
									<p>Opponent's Username: 
										<input 
										value={credentials.username}
										onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
										required
										/>
									</p>
  									<p>Opponent's Password: <input 
										value={credentials.password}
										onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
										required
										/>
  									<button type="submit">submit</button>
									</p>
									</div>
									{error && <p className="text-red-500">{error}</p>}
								</form>
								</div>
								<button className="btn button" 
										style={scaleStyle} 
										onClick={() => handleModeSelect("multiplayer")} 
										disabled={!isOpponentAuthenticated}
									>
									{t("PlayB2")}
								</button>
							</div>
							<div className="mode">
								<h3 style={scaleStyle}>{t("PlaySH3")}</h3>
								<p style={scaleStyle}>{t("PlayT3")}</p>
								<button className="btn button" style={scaleStyle}>
									{t("PlayB3")}
								</button>
							</div>
							<div className="mode">
								<h3 style={scaleStyle}>{t("PlaySH4")}</h3>
								<p style={scaleStyle}>{t("PlayT4")}</p>
								<button className="btn button" style={scaleStyle}>
									{t("PlayB4")}
								</button>
							</div>
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default Play;
