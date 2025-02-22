import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameContext } from "../../context/GameContext";
import { useTranslation } from "react-i18next";
import { authenticateUser } from '../../services/postAuthenticateUser';
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
        setPlayer1Id
    } = useContext(GameContext);

    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [isBeingSubmitted, setIsBeingSubmitted] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
		const personsLoggedInId = Number(localStorage.getItem('user_id'));
        const personsLoggedInDisplayName = localStorage.getItem('display_name');
        const params = new URLSearchParams(window.location.search);
        const userId = params.get('user_id');
        const displayName = params.get('display_name');
        const errorMessage = params.get('error');

		if (errorMessage) {
			if (errorMessage ==='User not found'){
				setError(t('User not found'));
			} else 
            	setError(decodeURIComponent(errorMessage));
			navigate('/play');
        } else if (userId && displayName) {
            // Set user context when returning from 42 OAuth
			setPlayer1Id(personsLoggedInId);
			setPlayer1DisplayName(personsLoggedInDisplayName);
            setPlayer2Id(userId);
            setPlayer2DisplayName(displayName);
            setIsOpponentAuthenticated(true);
            // Redirect to the play page after authentication
            navigate('/play');
        }else if (window.location.search.includes('user_id') || window.location.search.includes('display_name')) {
			// Only show error if the parameters exist but are invalid
			setError(t('Authentication failed or missing parameters'));
		}
    }, [navigate, setPlayer1Id, setPlayer1DisplayName, setIsOpponentAuthenticated]); // make sure to include navigate in the dependencies

    // Trigger the 42 login authentication flow
    const handle42Authentication = () => {
        const returnUrl = `${window.location.origin}/42-callback-match`;  // Adjust this URL
        window.location.href = `http://localhost:8000/42-login-match/?redirect_uri=${encodeURIComponent(returnUrl)}`;
    };

    // Handle standard user authentication
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
                    navigate('/play'); // Redirect after successful authentication
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
                <input
                    value={credentials.username}
                    className="inputFieldStyle1"
                    autoComplete="off"
                    style={scaleStyle}
                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                    required
                />
            </p>
            <p style={scaleStyle}>
                {t("Password")}
                <input
                    type="password"
                    className="inputFieldStyle1"
                    autoComplete="off"
                    value={credentials.password}
                    style={scaleStyle}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    required
                />
                <button
                    type="button"
                    className="buttonStyle1"
                    style={scaleStyle}
                    disabled={isOpponentAuthenticated || isBeingSubmitted}
                    onClick={handle42Authentication}
                >
                    {t("Or authenticate a player with 42")}
                </button>
                <button
                    type="submit"
                    className="buttonStyle1"
                    style={scaleStyle}
                    disabled={isOpponentAuthenticated || isBeingSubmitted}
                >
                    {isOpponentAuthenticated ? t("Ready") : t("Submit")}
                </button>
            </p>
            {error && <p className="text-red-500" style={scaleStyle}>{error}</p>}
        </form>
    );
};

export default AuthUserForm;
