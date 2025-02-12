import React, { useState, useContext } from 'react';
import './Play.css';
import { useTranslation } from "react-i18next";
import { AccessibilityContext } from '../AccessibilityContext';
import PlayNotLoggedIn from '../components/PlayComponents/PlayNotLoggedIn';
import TournamentSetup from '../components/PlayComponents/TournamentSetup';
import MultiplayerMode from '../components/PlayComponents/MultiplayerMode';
import GameScreen from '../components/PlayComponents/GameScreen';
import { GameContext } from "../context/GameContext";

const Play = () => {
    const { t } = useTranslation();
    const { fontSize } = useContext(AccessibilityContext);
    const { isReadyToPlay, setIsReadyToPlay } = useContext(GameContext);

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
                            <MultiplayerMode scaleStyle={scaleStyle} />
                            <TournamentSetup scaleStyle={scaleStyle} />
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default Play;
