import React, {useContext} from 'react';
import { useTranslation } from "react-i18next";
import { GameContext } from "../../context/GameContext";

function turnOnFooterNavbar() {
    let footer = document.getElementById("footerID");
    if (footer && footer.style.display === "none") {
        footer.style.display = "flex";
    }

    let navbar = document.getElementById("navbarID");
    if (navbar && navbar.style.display === "none") {
        navbar.style.display = "flex";
    }

	let pongHeading  = document.getElementById("pongHeading");
	if (pongHeading && pongHeading.style.display === "none") {
		pongHeading.style.display = "flex";
	}
}


const UltimateWinner = ({ player, scaleStyle }) => {
	const {t} = useTranslation();
	const { setgameTournamentStarted, 
			setIsReadyToPlay, 
			setIsOpponentAuthenticated, 
			setMatchIndex } = useContext(GameContext);

	turnOnFooterNavbar();
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