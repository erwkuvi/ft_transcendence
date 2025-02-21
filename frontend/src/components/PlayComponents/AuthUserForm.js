import React, { useState, useContext } from 'react';
import { GameContext } from "../../context/GameContext";
import { useTranslation } from "react-i18next";
import { authenticateUser } from '../../services/postAuthenticateUser';
import './AuthUserForm.css'

const AuthUserForm = ({scaleStyle}) => {
	const { t } = useTranslation();
	const { isOpponentAuthenticated, 
			setIsOpponentAuthenticated, 
			setPlayer2DisplayName, 
			setPlayer2Id,
			setPlayer1DisplayName,
			setPlayer1Id } = useContext(GameContext); 
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [isBeingSubmitted, setIsBeingSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleAuthentication = async (e) => {
        e.preventDefault();
        setIsBeingSubmitted(true);
		setError('');

        try {
			const data = await authenticateUser(credentials);

            if (typeof data.user_id === 'number') {
				const personsLoggedInId = Number(localStorage.getItem('user_id'));
				const personsLoggedInDisplayName = localStorage.getItem('display_name');

				if (data.user_id === personsLoggedInId){
					setError(t('You can not play pong with yourself'));					
					setIsOpponentAuthenticated(false);
				}else{
					setIsOpponentAuthenticated(true);
					setPlayer2Id(data.user_id);
					setPlayer2DisplayName(data.display_name);
					setPlayer1Id(personsLoggedInId);
					setPlayer1DisplayName(personsLoggedInDisplayName);
				}
            } else {
                setError(t('Invalid credentials'));
                setIsOpponentAuthenticated(false);
            }
        } catch (error) {
            setError(t('Authentication failed'));
            setIsOpponentAuthenticated(false);
        } finally {
			setIsBeingSubmitted(false);
		}
    };

    return (
        <form onSubmit={handleAuthentication} className="auth-form" style={scaleStyle}>
			<h4 style={scaleStyle}>
                {t("Add a player")}
            </h4>
            <p style={scaleStyle} className="AuthUser_and_TournamentFormInput_holder">
				{t("Username")}
                <input 	value={credentials.username} className="inputFieldStyle1"
						autoComplete="off"
						style={scaleStyle}
						onChange={(e) => setCredentials({ ...credentials, username: e.target.value })} 
						required 
				/>
            </p>
            <p style={scaleStyle}>
                {t("Password")}
                <input	type="password" className="inputFieldStyle1"
						autoComplete="off"
						value={credentials.password} 
						style={scaleStyle}
						onChange={(e) => setCredentials({ ...credentials, password: e.target.value })} 
						required 
				/>
                <button type="submit" 
						className="buttonStyle1" /*btn button*/
						style={scaleStyle}
						disabled={isOpponentAuthenticated || isBeingSubmitted}>
                    {isOpponentAuthenticated ?  t("Ready")  : t("Submit")}
                </button>
            </p>
            {error && <p className="text-red-500" style={scaleStyle}>{error}</p>}
        </form>
    );
};

export default AuthUserForm;
