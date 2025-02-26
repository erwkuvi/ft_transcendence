import React, {useContext} from 'react';
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../context/AuthContext";
import { GameContext } from "../../context/GameContext";


const PlayNextGame = ({ scaleStyle }) => {
	const {t} = useTranslation();
	const { setNavbarOff } = useContext(AuthContext);
	const { setgameTournamentStarted, setIsReadyToPlay, setIsOpponentAuthenticated } = useContext(GameContext);

	return (
		<button
			className="buttonStyle1"
			onClick={() => {
				setIsReadyToPlay(null);
				setIsOpponentAuthenticated(false);
				setgameTournamentStarted(false);
				// setNavbarOff(false);
			}}
			aria-label={t("Play next game button")}
		>
			{t("Play next game")}
		</button>
	);
};

export default PlayNextGame;