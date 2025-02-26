import React, {useContext} from 'react';
import { useTranslation } from "react-i18next";
import { AuthContext } from '../../context/AuthContext';
import { GameContext } from "../../context/GameContext";

const UltimateWinner = ({ player, scaleStyle }) => {
	const { setNavbarOff } = useContext(AuthContext);
	const {t} = useTranslation();
	const { setgameTournamentStarted, 
			setTournamentPlayers,
			setIsReadyToPlay, 
			setIsOpponentAuthenticated, 
			setMatchIndex } = useContext(GameContext);

	return (
		<button
			id="tournamentButtonStyle"
			onClick={() => {
				setIsReadyToPlay(null);
				setIsOpponentAuthenticated(false);
				setgameTournamentStarted(false);
				setTournamentPlayers([]);
				setMatchIndex(null);
				setNavbarOff(false);
			}}
			aria-label={`${t("Congrats to the Ultimate Winner")} ${player}`}

		>
			{t("Congrats to the Ultimate Winner")} {player} !
		</button>
	);
};

export default UltimateWinner;