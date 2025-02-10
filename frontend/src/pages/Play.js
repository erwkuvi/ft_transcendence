import React, { useState, useContext } from 'react';
import './Play.css';
import { useTranslation } from "react-i18next";
import { AccessibilityContext } from '../AccessibilityContext';
import ModeSelection from '../components/PlayComponents/ModeSelection';
import GameScreen from '../components/PlayComponents/GameScreen';

const Play = () => {
    const { t } = useTranslation();
    const { fontSize } = useContext(AccessibilityContext);

    const [isReadyToPlay, setIsReadyToPlay] = useState(null);
    const [isOpponentAuthenticated, setIsOpponentAuthenticated] = useState(false);

    const scaleStyle = {
        fontSize: `${fontSize}px`,
        lineHeight: '1.5'
    };

    return (
        <div className="page-content play">
            {isReadyToPlay ? (
                <GameScreen 
                    setIsReadyToPlay={setIsReadyToPlay} 
                    setIsOpponentAuthenticated={setIsOpponentAuthenticated} 
                    scaleStyle={scaleStyle}
                />
            ) : (
                <ModeSelection 
                    setIsReadyToPlay={setIsReadyToPlay} 
                    isOpponentAuthenticated={isOpponentAuthenticated}
                    setIsOpponentAuthenticated={setIsOpponentAuthenticated}
                    scaleStyle={scaleStyle}
                />
            )}
        </div>
    );
};

export default Play;
