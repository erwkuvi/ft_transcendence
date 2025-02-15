import React, { useState, useContext } from 'react';
import { GameContext } from "../../context/GameContext";
import { useTranslation } from "react-i18next";

const AuthUserForm = ({scaleStyle}) => {
	const { t } = useTranslation();
	const { isOpponentAuthenticated, setIsOpponentAuthenticated, setOpponentsId, setOpponentsUsername } = useContext(GameContext); 
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [isBeeingSubmitted, setIsBeeingSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleAuthentication = async (e) => {
        e.preventDefault();
        setIsBeeingSubmitted(true);


        try {
            const response = await fetch('http://localhost:8000/user_management/simple-auth/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            });
			const data = await response.json();
			console.log("response: ", data);
			
            if (response.ok && typeof data.user_id === 'number') {
                setIsOpponentAuthenticated(true);
				setOpponentsId(data.user_id);
				setOpponentsUsername(credentials.username);
                setError('');
            } else {
                setError('Invalid credentials');
                setIsOpponentAuthenticated(false);
            }
        } catch {
            setError('Authentication failed');
            setIsOpponentAuthenticated(false);
        }

        setIsBeeingSubmitted(false);
    };

    return (
        <form onSubmit={handleAuthentication} className="auth-form" style={scaleStyle}>
			<h4 style={scaleStyle}>
                {t("Add a player")}
            </h4>
            <p style={scaleStyle}>
				{t("Username")}
                <input 	value={credentials.username} 
						style={scaleStyle}
						onChange={(e) => setCredentials({ ...credentials, username: e.target.value })} 
						required 
				/>
            </p>
            <p style={scaleStyle}>
                {t("Password")}
                <input	type="password" 
						value={credentials.password} 
						style={scaleStyle}
						onChange={(e) => setCredentials({ ...credentials, password: e.target.value })} 
						required 
				/>
                <button type="submit" 
						className="btn button"
						style={scaleStyle}
						disabled={isOpponentAuthenticated || isBeeingSubmitted}>
                    {isOpponentAuthenticated ?  t("Ready")  : t("Submit")}
                </button>
            </p>
            {error && <p className="text-red-500" style={scaleStyle}>{error}</p>}
        </form>
    );
};

export default AuthUserForm;
