import React, { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameContext } from "../../context/GameContext";
import { useTranslation } from "react-i18next";
import { authenticateUser } from '../../services/postAuthenticateUser';
import handle42Authentication from '../../services/auth42callback';
import './AuthTournamentForm.css';

const AuthTournamentForm = ({ scaleStyle }) => {
    const { t } = useTranslation();
    // const navigate = useNavigate();
    const { tournamentPlayers, setTournamentPlayers, setIsTournamentReady, setMode } = useContext(GameContext);
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [isBeingSubmitted, setIsBeingSubmitted] = useState(false);
    const [errorTrnm, setErrorTrnm] = useState('');
    const usernameInputRef = useRef(null);
    // const [is42AuthTriggered, setIs42AuthTriggered] = useState(false);
    const [localStoragePlayers, setLocalStoragePlayers] = useState([]);

    const currentPlayerNumber = (localStoragePlayers.length + tournamentPlayers.length) + 1;

    // Load players from localStorage when the component mounts
    useEffect(() => {

		const savedPlayers = JSON.parse(localStorage.getItem('tournamentPlayers')) || [];
		setLocalStoragePlayers(savedPlayers);

		if (currentPlayerNumber === 3) {
			const personsLoggedInId = Number(localStorage.getItem('user_id'));
			const personsLoggedInDisplayName = localStorage.getItem('display_name');

			setIsTournamentReady(true);
			const newPlayers = [...localStoragePlayers, { id: personsLoggedInId, display_name: personsLoggedInDisplayName }];
			setTournamentPlayers(newPlayers);
			localStorage.removeItem('tournamentPlayers');
		}

		const storedError = localStorage.getItem('urlTournamentError');
		console.log("stored reero: ", storedError)

        if (storedError) {
			if (storedError === 'User not found'){
				setErrorTrnm(t('User not found'))
			}else if(storedError === 'You cannot play against yourself'){
				setErrorTrnm(t('You cannot play against yourself'))
			}else if(storedError === 'This player is already in the tournament'){
				setErrorTrnm(t('This player is already in the tournament'))
			}else
				setErrorTrnm('')
			
            localStorage.removeItem('urlTournamentError');
        }
    }, []);


    const handle42AuthClick = () => {
		setErrorTrnm('')
		sessionStorage.setItem('mode', 'tournament');
		handle42Authentication();
	};

    const handleAuthentication = async (e) => {
        e.preventDefault();
        setIsBeingSubmitted(true);
        setErrorTrnm('');

        try {
            const data = await authenticateUser(credentials);
            
            if (typeof data.user_id === 'number') {
                // Add player to localStorage
                const newPlayers = [...localStoragePlayers, { id: data.user_id, display_name: data.display_name }];
                setLocalStoragePlayers(newPlayers);
                localStorage.setItem('tournamentPlayers', JSON.stringify(newPlayers));

                setCredentials({ username: '', password: '' });

                if (currentPlayerNumber === 3) {
                    setIsTournamentReady(true);
                    // Once we have all 3 players, move to useState and clear localStorage
                    setTournamentPlayers(newPlayers);
                    localStorage.removeItem('tournamentPlayers');
                }

                if (usernameInputRef.current) {
                    usernameInputRef.current.focus();
                }
            } else {
                setErrorTrnm(t('Invalid credentials'));
            }
        } catch {
            setErrorTrnm(t('Authentication failed'));
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
            {/* Display players from localStorage while still authenticating */}
            {localStoragePlayers.length > 0 && (
                <div className="authenticated-players" style={scaleStyle}>
                    {localStoragePlayers.map((player, index) => (
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
                    autoComplete="off"
                    style={scaleStyle}
                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                    required
                />
            </p>
            <p style={scaleStyle}>
                {t("Password")}
                <input
                    type="password" className="inputFieldStyle1"
                    autoComplete="off"
                    value={credentials.password}
                    style={scaleStyle}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    required
                />
            </p>
            <button
                type="button"
                className="buttonStyle1"
                style={scaleStyle}
                onClick={handle42AuthClick}
                disabled={isBeingSubmitted}
            >
                {t("Or authenticate a player with 42")}
            </button>
            <button 
                type="submit"
                className="buttonStyle1"
                style={scaleStyle}
                disabled={isBeingSubmitted}
            >
                {t("Submit")}
            </button>
            {errorTrnm && <p className="text-red-500" style={scaleStyle}>{errorTrnm}</p>}
        </form>
    );
};

export default AuthTournamentForm;
