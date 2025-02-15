import React, { useState, useContext, useRef } from 'react';
import { GameContext } from "../../context/GameContext";
import { useTranslation } from "react-i18next";
import './AuthTournamentForm.css'

const AuthTournamentForm = ({scaleStyle}) => {
    const { t } = useTranslation();
    const { tournamentPlayers, setTournamentPlayers } = useContext(GameContext);
	const { setIsTournamentReady } = useContext(GameContext);
    const [credentials, setCredentials] = useState({ username: '', alias_name: '', password: '' });
    const [isBeingSubmitted, setIsBeingSubmitted] = useState(false);
    const [error, setError] = useState('');
	const usernameInputRef = useRef(null);

    const currentPlayerNumber = tournamentPlayers.length + 1;

    const handleAuthentication = async (e) => {
        e.preventDefault();
        setIsBeingSubmitted(true);

        try {
            const response = await fetch('http://localhost:8000/user_management/simple-auth/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            });
            const data = await response.json();
            
            if (response.ok && typeof data.user_id === 'number') {
                setTournamentPlayers([...tournamentPlayers, {
                    id: data.user_id,
					alias_name: '',
                    username: credentials.username
                }]);
                setCredentials({ username: '', password: '' });
				setError('');
				if (currentPlayerNumber == 3)
				{
					setIsTournamentReady(true);
				}
				if (usernameInputRef.current) {
                    usernameInputRef.current.focus();
                }
            } else {
                setError('Invalid credentials');
            }
        } catch {
            setError('Authentication failed');
        }
        setIsBeingSubmitted(false);
    };

    if (tournamentPlayers.length >= 3) {
        return (
            <div className="auth-form" style={scaleStyle}>
                <h4 style={scaleStyle}>{t("StartTheTournament")}</h4>
                <div className="players-list">
                    {tournamentPlayers.map((player, index) => (
                        <p key={player.id} style={scaleStyle}>
                            {t("Player")} {index + 1}: {player.username}
                        </p>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleAuthentication} className="auth-form" style={scaleStyle}>
            <h4 style={scaleStyle}>
                {t("Player")} {currentPlayerNumber} {t("of")} 3
            </h4>
            {tournamentPlayers.length > 0 && (
                <div className="authenticated-players" style={scaleStyle}>
                    {tournamentPlayers.map((player, index) => (
                        <p key={player.id} style={scaleStyle}>
                            {t("Player")} {index + 1}: {player.username} ✓
                        </p>
                    ))}
                </div>
            )}
            <p style={scaleStyle}>
                {t("Username")}
                <input 
					ref={usernameInputRef}
                    value={credentials.username}
                    style={scaleStyle}
                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                    required
                />
            </p>
			<p style={scaleStyle}>
                {t("alias name")}
                <input 
                    value={credentials.alias_name}
                    style={scaleStyle}
                    onChange={(e) => setCredentials({ ...credentials, alias_name: e.target.value })}
                    required
                />
            </p>
            <p style={scaleStyle}>
                {t("Password")}
                <input
                    type="password"
                    value={credentials.password}
                    style={scaleStyle}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    required
                />
                <button 
                    type="submit"
                    className="btn button"
                    style={scaleStyle}
                    disabled={isBeingSubmitted}
                >
                    {t("Submit")}
                </button>
            </p>
            {error && <p className="text-red-500" style={scaleStyle}>{error}</p>}
        </form>
    );
};

export default AuthTournamentForm;