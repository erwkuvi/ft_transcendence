import React, { createContext, useState, useContext} from "react";
export const GameContext = createContext();
// import { AuthContext } from './AuthContext';

export const GameProvider = ({ children }) => {
	// const { personLoggedIn } = useContext(AuthContext);
	const [isSubmitting, setIsSubmitting] = useState(false);
    const [isReadyToPlay, setIsReadyToPlay] = useState(null);
    const [isOpponentAuthenticated, setIsOpponentAuthenticated] = useState(false);
	const [ isTournamentReady, setIsTournamentReady ] = useState(false);
	const [opponentsId, setOpponentsId] = useState('');
	const [tournamentPlayers, setTournamentPlayers] = useState([]);

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
										setIsTournamentReady }}>
            {children}
        </GameContext.Provider>
    );
};
