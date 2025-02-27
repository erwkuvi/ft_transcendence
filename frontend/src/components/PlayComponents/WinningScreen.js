import React, { useContext } from 'react';
import { GameContext } from '../../context/GameContext';
import { AccessibilityContext } from '../../AccessibilityContext';
import PlayNextGame from './PlayNextGame';
import UltimateWinner from './UltimateWinner';
import BackButton from './BackButton';
import { useTranslation } from "react-i18next";
import useWindowDimensions from '../userWindowDimensions';

function WinningScreen({ player, score1, score2 }) {
    const { t } = useTranslation();
    const { player1DisplayName, player2DisplayName, matchIndex } = useContext(GameContext);

    const defaultDisplayName1 = t("Player 1");
    const defaultDisplayName2 = t("Player 2");
    const { width, height } = useWindowDimensions();
    
    const isLoggedIn = player1DisplayName !== defaultDisplayName1 && player2DisplayName !== defaultDisplayName2;
    return (
        <div id="winningScreen" className="w-100 d-flex justify-content-center align-items-center" style={{minHeight: `${height - 90}px`, overflowWrap: "anywhere", padding: "20px"}}>
            <div>
                <h2 style={{fontSize: "36px"}}>{t("Winner")} {player}</h2>
                <p style={{fontSize: "18px"}}>{player1DisplayName || defaultDisplayName1} {t("score")} {score1}</p>
                <p style={{fontSize: "18px"}}>{player2DisplayName || defaultDisplayName2} {t("score")} {score2}</p>

                {isLoggedIn ? (
                    matchIndex === 1 ? (
                        <PlayNextGame/>
                    ) : matchIndex === 0 ? (
                        <UltimateWinner player={player}/>
                    ) : (
                        <BackButton/>
                    )
                ) : (
                    <BackButton />
                )}
            </div>
        </div>
    );
}

export default WinningScreen;

