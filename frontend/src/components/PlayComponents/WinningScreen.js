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

    const displayName1 = player1DisplayName || "Player 1";
    const displayName2 = player2DisplayName || "Player 2";

    return (
        <div id="winningScreen">
            <h2>{t("Winner")} {player}</h2>
            <p>{displayName1} {t("score")} {score1}</p>
            <p>{displayName2} {t("score")} {score2}</p>

            {(player1DisplayName && player2DisplayName) ? (
                matchIndex === 1 ? (
                    <PlayNextGame scaleStyle={scaleStyle} />
                ) : matchIndex === 0 ? (
                    <UltimateWinner scaleStyle={scaleStyle} />
                ) : null
            ) : (
                <BackButton scaleStyle={scaleStyle} />
            )}
        </div>
    );
}

export default WinningScreen;
