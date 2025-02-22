import React, { useState, useContext, useEffect } from 'react';
import './Play.css';
import { useTranslation } from "react-i18next";
import { AccessibilityContext } from '../AccessibilityContext';
import PlayNotLoggedIn from '../components/PlayComponents/PlayNotLoggedIn';
import PlayTournamentSetup from '../components/PlayComponents/PlayTournamentSetup';
import PlayMultiplayerMode from '../components/PlayComponents/PlayMultiplayerMode';
import GameScreen from '../components/PlayComponents/GameScreen';
import TournamentScreen from '../components/PlayComponents/TournamentScreen';
import { GameContext } from "../context/GameContext";
import { getUserProfile } from '../services/getProfile';


const Play = () => {
    const { t } = useTranslation();
    const { fontSize } = useContext(AccessibilityContext);
    const { isReadyToPlay, startTheTournament } = useContext(GameContext);
	const [ isInTournament, setIsInTournament] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getUserProfile();
                setIsInTournament(data.in_tournament);
            } catch (error) {
				console.log("Failed to get user profile", error);
            }
        };
		
        fetchProfile();
    }, []);
	
	console.log("in tournament", isInTournament)

    const scaleStyle = {
        fontSize: `${fontSize}px`,
        lineHeight: '1.5'
    };

    const personLoggedIn = localStorage.getItem('user_id');
    console.log("person logged in is: ", personLoggedIn);

	//some check if the tournament is over 
	//also startTheTournament is temp for leaving I need to get it from backend later

	if (isInTournament ){
		return (
		<>
			<TournamentScreen scaleStyle={scaleStyle} />
		</>
		)
	}else {
		return (
			<div className="d-flex flex-column playPageHolder" id="pageContentID">
				<h1 className="pageHeadingH1Style1 typicalPadding mb-5" id="pongHeading">{t("PlayTitle")}</h1>
				{isReadyToPlay ? (
					<GameScreen scaleStyle={scaleStyle} />
				) : !personLoggedIn ? (
					<PlayNotLoggedIn scaleStyle={scaleStyle} />
				) : (
					<>
						<div className="d-flex flex-row flex-wrap playPageCardWrapper m-0 mt-3">
							<PlayMultiplayerMode scaleStyle={scaleStyle} />
							<PlayTournamentSetup scaleStyle={scaleStyle} />
						</div>
					</>
				)}
			</div>
		);
	}
};

export default Play;
