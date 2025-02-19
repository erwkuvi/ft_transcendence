import React, { useContext } from 'react';
import { GameContext } from '../../context/GameContext';
import { AccessibilityContext } from '../../AccessibilityContext';
import PlayNextGame from './PlayNextGame';
import UltimateWinner from './UltimateWinner';
import BackButton from './BackButton';
import { useTranslation } from "react-i18next";

function WinningScreen({ player, score1, score2 }) {
    const { t } = useTranslation();
    const { player1DisplayName, player2DisplayName, matchIndex } = useContext(GameContext);
    const { fontSize } = useContext(AccessibilityContext);

    const scaleStyle = {
        fontSize: `${fontSize}px`,
        lineHeight: '1.5'
    };

    const defaultDisplayName1 = "Player 1";
    const defaultDisplayName2 = "Player 2";
    
    // Check if user is logged in (i.e., player names are not default values)
    const isLoggedIn = player1DisplayName !== defaultDisplayName1 && player2DisplayName !== defaultDisplayName2;

    return (
        <div id="winningScreen">
            <h2>{t("Winner")} {player}</h2>
            <p>{player1DisplayName || defaultDisplayName1} {t("score")} {score1}</p>
            <p>{player2DisplayName || defaultDisplayName2} {t("score")} {score2}</p>

            {/* Logic based on login status */}
            {isLoggedIn ? (
                matchIndex === 1 ? (
                    <PlayNextGame scaleStyle={scaleStyle} />
                ) : matchIndex === 0 ? (
                    <UltimateWinner player={player} scaleStyle={scaleStyle} />
                ) : (
                    <BackButton scaleStyle={scaleStyle} />
                )
            ) : (
                <BackButton scaleStyle={scaleStyle} />
            )}
        </div>
    );
}

export default WinningScreen;

