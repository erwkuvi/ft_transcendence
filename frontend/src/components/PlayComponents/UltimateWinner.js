import React, {useContext} from 'react';
import { useTranslation } from "react-i18next";
import { GameContext } from "../../context/GameContext";

const UltimateWinner = ({ player, scaleStyle }) => {
	const {t} = useTranslation();
	const { setgameTournamentStarted, 
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
				setMatchIndex(null);
			}}
			aria-label={`${t("Congrats to the Ultimate Winner")} ${player}`}

		>
			{t("Congrats to the Ultimate Winner")} {player} !
		</button>
	);
};

export default UltimateWinner;