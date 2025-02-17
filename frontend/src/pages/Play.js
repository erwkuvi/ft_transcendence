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
	if (isInTournament){
		return (
			<div className="page-content play">
				<TournamentScreen scaleStyle={scaleStyle} />
			</div>
		)
	}

    return (
        <div className="page-content play">
            {startTheTournament? (
                <TournamentScreen scaleStyle={scaleStyle} />
            ) : isReadyToPlay ? (
                <GameScreen scaleStyle={scaleStyle} />
            ) : !personLoggedIn ? (
                <PlayNotLoggedIn scaleStyle={scaleStyle} />
            ) : (
                <>
					<div className="play-wrapper">
						<div className="title-container">
							<h1 className="title mt-5">{t("PlayTitle")}</h1>
						</div>
						<div className="play-modes-wrapper">
							<PlayMultiplayerMode scaleStyle={scaleStyle} />
							<PlayTournamentSetup scaleStyle={scaleStyle} />
						</div>
					</div>
                </>
            )}
        </div>
    );
};

export default Play;
