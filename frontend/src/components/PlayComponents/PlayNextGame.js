import React, {useContext} from 'react';
import { useTranslation } from "react-i18next";
import { GameContext } from "../../context/GameContext";

const PlayNextGame = ({ scaleStyle }) => {
	const {t} = useTranslation();
	const { setgameTournamentStarted, setIsReadyToPlay, setIsOpponentAuthenticated } = useContext(GameContext);

	return (
		<button
			className="btn button mt-4"
			style={scaleStyle}
			onClick={() => {
				setIsReadyToPlay(null);
				setIsOpponentAuthenticated(false);
				setgameTournamentStarted(false);
			}}
			aria-label={t("Play next game button")}
		>
			{t("Play next game")}
		</button>
	);
};

export default PlayNextGame;