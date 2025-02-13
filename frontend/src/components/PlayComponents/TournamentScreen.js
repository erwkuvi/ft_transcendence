import React, { useContext } from 'react';
import { useTranslation } from "react-i18next";
import { GameContext } from "../../context/GameContext";
import "./TournamentScreen.css";

const TournamentScreen = ({ scaleStyle }) => {
    const { t } = useTranslation();
    const { tournamentPlayers } = useContext(GameContext);

    return (
        <div className="tournament-matches" style={scaleStyle}>
            <h2 className="tournament-title" style={scaleStyle}>{t("TournamentBracket")}</h2>
            
            <div className="tournament-bracket">
                {/* First round matches */}
                <div className="round round-1">
                    <div className="match-box">
                        <h3 style={scaleStyle}>{t("Match")} 1</h3>
                        <div className="players">
                            <div className="player">{tournamentPlayers[0]?.username || "Player 1"}</div>
                            <div className="vs">VS</div>
                            <div className="player">{tournamentPlayers[1]?.username || "Player 2"}</div>
                        </div>
                        <button className="btn button" style={scaleStyle}>
                            {t("StartMatch")}
                        </button>
                    </div>

                    <div className="match-box">
                        <h3 style={scaleStyle}>{t("Match")} 2</h3>
                        <div className="players">
                            <div className="player">{tournamentPlayers[2]?.username || "Player 3"}</div>
                            <div className="vs">VS</div>
                            <div className="player">{"???"}</div>
                        </div>
                        <button className="btn button" style={scaleStyle} disabled>
                            {t("StartMatch")}
                        </button>
                    </div>
                </div>

                {/* Final match */}
                <div className="round round-2">
                    <div className="match-box final">
                        <h3 style={scaleStyle}>{t("FinalMatch")}</h3>
                        <div className="players">
                            <div className="player">{"???"}</div>
                            <div className="vs">VS</div>
                            <div className="player">{"???"}</div>
                        </div>
                        <button className="btn button" style={scaleStyle} disabled>
                            {t("StartMatch")}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TournamentScreen;