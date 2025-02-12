import React, { createContext, useState, useContext} from "react";
export const GameContext = createContext();
// import { AuthContext } from './AuthContext';

export const GameProvider = ({ children }) => {
	// const { personLoggedIn } = useContext(AuthContext);
    const [isReadyToPlay, setIsReadyToPlay] = useState(null);
    const [isOpponentAuthenticated, setIsOpponentAuthenticated] = useState(false);
	const [opponentsId, setOpponentsId] = useState('');

    return (
        <GameContext.Provider value={{	isReadyToPlay, 
										setIsReadyToPlay, 
										isOpponentAuthenticated, 
										setIsOpponentAuthenticated,
										opponentsId,
										setOpponentsId }}>
            {children}
        </GameContext.Provider>
    );
};
