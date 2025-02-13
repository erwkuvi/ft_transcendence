import React, { useState, useContext } from 'react';
import './Play.css';
import { useTranslation } from "react-i18next";
import { AccessibilityContext } from '../AccessibilityContext';
import PlayNotLoggedIn from '../components/PlayComponents/PlayNotLoggedIn';
import PlayTournamentSetup from '../components/PlayComponents/PlayTournamentSetup';
import PlayMultiplayerMode from '../components/PlayComponents/PlayMultiplayerMode';
import GameScreen from '../components/PlayComponents/GameScreen';
import { GameContext } from "../context/GameContext";

const Play = () => {
    const { t } = useTranslation();
    const { fontSize } = useContext(AccessibilityContext);
    const { isReadyToPlay } = useContext(GameContext);

    const scaleStyle = {
        fontSize: `${fontSize}px`,
        lineHeight: '1.5'
    };

    const personLoggedIn = localStorage.getItem('user_id');
    console.log("person logged in is: ", personLoggedIn);

    return (
        <div className="page-content play">
            {isReadyToPlay ? (
                <GameScreen scaleStyle={scaleStyle} />
            ) : (
                <>
                    {!personLoggedIn ? (
                        <PlayNotLoggedIn scaleStyle={scaleStyle}/>
                    ) : (
                        <>
							<div className="title-container">
								<h1 className="title mt-5">{t("PlayTitle")}</h1>
							</div>
                            <div className="play-modes-wrapper">
								<PlayMultiplayerMode scaleStyle={scaleStyle} />
								<PlayTournamentSetup scaleStyle={scaleStyle} />
							</div>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default Play;
