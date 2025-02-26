import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { GameContext } from "../../context/GameContext";
import { useTranslation } from "react-i18next";
import { authenticateUser } from '../../services/postAuthenticateUser';
import  handle42Authentication  from '../../services/auth42callback';
import './AuthUserForm.css';

const AuthUserForm = ({ scaleStyle }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const {
        isOpponentAuthenticated,
        setIsOpponentAuthenticated,
        setPlayer2DisplayName,
        setPlayer2Id,
        setPlayer1DisplayName,
        setPlayer1Id,
    } = useContext(GameContext);

    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [isBeingSubmitted, setIsBeingSubmitted] = useState(false);
    const [error, setError] = useState('');

	useEffect(() => {
        const storedError = localStorage.getItem('urlError');
        if (storedError) {
			if (storedError === 'User not found'){
				setError(t('User not found'))
			}else if(storedError === 'You cannot play against yourself'){
				setError(t('You cannot play against yourself'))
			}else
				setError('')
			
            localStorage.removeItem('urlError');
        }
    }, []);

    const handle42AuthClick = () => {
		setError('')
		sessionStorage.setItem('mode', 'match');

        handle42Authentication();
    };
	
    const handleAuthentication = async (e) => {
        e.preventDefault();
        setIsBeingSubmitted(true);
        setError('');

        try {
            const data = await authenticateUser(credentials);

            if (typeof data.user_id === 'number') {
                const personsLoggedInId = Number(localStorage.getItem('user_id'));
                const personsLoggedInDisplayName = localStorage.getItem('display_name');

                if (data.user_id === personsLoggedInId) {
                    setError(t('You cannot play against yourself'));
                    setIsOpponentAuthenticated(false);
                } else {
                    setIsOpponentAuthenticated(true);
                    setPlayer2Id(data.user_id);
                    setPlayer2DisplayName(data.display_name);
                    setPlayer1Id(personsLoggedInId);
                    setPlayer1DisplayName(personsLoggedInDisplayName);
                    navigate('/play'); 
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
        <form onSubmit={handleAuthentication} className="auth-form d-flex flex-column" style={scaleStyle}>
            <h4 style={scaleStyle}>
                {t("Add a player")}
            </h4>
            <label style={scaleStyle} className="AuthUser_and_TournamentFormInput_holder">
                {t("Username")}
                <input
                    value={credentials.username}
                    className="inputFieldStyle1"
                    autoComplete="off"
                    style={scaleStyle}
                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
					aria-label={t("Enter your username")}
                    required
                />
            </label>
            <label style={scaleStyle}>
                {t("Password")}
                <input
                    type="password"
                    className="inputFieldStyle1"
                    autoComplete="off"
                    value={credentials.password}
                    style={scaleStyle}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
					aria-label={t("Enter your password")}
                    required
                />
			</label>
            <button
                type="button"
                className="buttonStyle1"
                style={scaleStyle}
                disabled={isOpponentAuthenticated || isBeingSubmitted}
                onClick={handle42AuthClick}
				aria-label={t("Authenticate with 42")}

            >
                {t("Or authenticate a player with 42")}
            </button>
            <button
                type="submit"
                className="buttonStyle1"
                style={scaleStyle}
                disabled={isOpponentAuthenticated || isBeingSubmitted}
				aria-label={isOpponentAuthenticated ? t("Player is ready") : t("Submit credentials")}
            >
                {isOpponentAuthenticated ? t("Ready") : t("Submit")}
            </button>
            {error && <p className="text-red-500" style={scaleStyle}>{error}</p>}
        </form>
    );
};

export default AuthUserForm;
