import React, { createContext, useState, useContext} from "react";
export const GameContext = createContext();
// import { AuthContext } from './AuthContext';

export const GameProvider = ({ children }) => {
	// const { personLoggedIn } = useContext(AuthContext);
	const [isSubmitting, setIsSubmitting] = useState(false);
    const [isReadyToPlay, setIsReadyToPlay] = useState(null);
    const [isOpponentAuthenticated, setIsOpponentAuthenticated] = useState(false);
	const [ isTournamentReady, setIsTournamentReady ] = useState(false);
	const [ startTheTournament, setStartTheTournament ] = useState(false);
	const [opponentsId, setOpponentsId] = useState('');
	const [tournamentPlayers, setTournamentPlayers] = useState([]);
	const [opponentsDisplayName, setOpponentsDisplayName] = useState('');

	const [ player1DisplayName, setPlayer1DisplayName ] = useState(null);
	const [ player1Id, setPlayer1Id ] = useState(null);
	const [ player2DisplayName, setPlayer2DisplayName ] = useState(null);
	const [ player2Id, setPlayer2Id ] = useState(null);
	const [ iDTournamentGame, setIDTournamentGame ] = useState(null);
	const [ gameTournamentStarted, setgameTournamentStarted ] = useState(false);
	const [ matchIndex, setMatchIndex ] = useState(null);
	const [ tournamentMatchID, setTournamentMatchID ] = useState(null);

    return (
        <GameContext.Provider value={{	isSubmitting,
										setIsSubmitting,
										isReadyToPlay, 
										setIsReadyToPlay, 
										isOpponentAuthenticated, 
										setIsOpponentAuthenticated,
										opponentsId,
										setOpponentsId,
										tournamentPlayers,
										setTournamentPlayers,
										isTournamentReady,
										setIsTournamentReady,
										startTheTournament,
										setStartTheTournament,
										opponentsDisplayName,
										setOpponentsDisplayName,
										player1DisplayName,
										setPlayer1DisplayName,
										player1Id,
										setPlayer1Id,
										player2DisplayName,
										setPlayer2DisplayName,
										player2Id,
										setPlayer2Id,
										matchIndex,
										setMatchIndex,
										iDTournamentGame,
										setIDTournamentGame,
										gameTournamentStarted,
										setgameTournamentStarted,
										tournamentMatchID,
										setTournamentMatchID
									}}
		>
            {children}
        </GameContext.Provider>
    );
};
