import React, { useState, useContext, useRef} from 'react';
import { GameContext } from "../../context/GameContext";
import { useTranslation } from "react-i18next";
import { authenticateUser } from '../../services/postAuthenticateUser';
import './AuthTournamentForm.css'

const AuthTournamentForm = ({scaleStyle}) => {
    const { t } = useTranslation();
    const { tournamentPlayers, setTournamentPlayers } = useContext(GameContext);
	const { setIsTournamentReady } = useContext(GameContext);
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [isBeingSubmitted, setIsBeingSubmitted] = useState(false);
    const [error, setError] = useState('');
	const usernameInputRef = useRef(null);

    const currentPlayerNumber = tournamentPlayers.length + 1;

	
    const handleAuthentication = async (e) => {
        e.preventDefault();
        setIsBeingSubmitted(true);
		setError('');

        try {
            const data = await authenticateUser(credentials);
            
            if (typeof data.user_id === 'number') {
                setTournamentPlayers([...tournamentPlayers, {
                    id: data.user_id,
                    display_name: data.display_name
                }]);
                setCredentials({ username: '', password: '' });
				
				if (currentPlayerNumber == 3)
				{
					setIsTournamentReady(true);
				}
				if (usernameInputRef.current) {
                    usernameInputRef.current.focus();
                }
            } else {
                setError(t('Invalid credentials'));
            }
        } catch {
            setError(t('Authentication failed'));
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
                            {t("Player")} {index + 1}: {player.display_name}
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
                            {t("Player")} {index + 1}: {player.display_name} ✓
                        </p>
                    ))}
                </div>
            )}
            <p style={scaleStyle} className="AuthUser_and_TournamentFormInput_holder">
                {t("Username")}
                <input 
					ref={usernameInputRef} className="inputFieldStyle1"
                    value={credentials.username}
                    style={scaleStyle}
                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                    required
                />
            </p>
            <p style={scaleStyle}>
                {t("Password")}
                <input
                    type="password" className="inputFieldStyle1"
                    value={credentials.password}
                    style={scaleStyle}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    required
                />
                <button 
                    type="submit"
                    className="buttonStyle1"
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