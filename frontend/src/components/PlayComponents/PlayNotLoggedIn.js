import React, { useContext } from 'react';
import { useTranslation } from "react-i18next";
import { GameContext } from "../../context/GameContext";
import "./PlayNotLoggedIn.css";

const PlayNotLoggedIn = ({ scaleStyle }) => {
    const { t } = useTranslation();
    const { setIsReadyToPlay, setPlayer1DisplayName, setPlayer2DisplayName} = useContext(GameContext);

    return (
        <>
            <div className="title-container">
                <h1 className="title mt-0">{t("PlayTitle")}</h1>
            </div>
            <div className="play-not-logged-in" style={scaleStyle}>
                <div className="play-content">
                    <div className="modes mt-4">
                        <div className="mode" >
                            <h3 style={scaleStyle}>{t("PlayTitleNotLoggedIn")}</h3>
                            <p style={scaleStyle}>{t("PlayDescriptionNotLoggedIn")}</p>
                            <button 
                                className="buttonStyle1"
                                style={scaleStyle} 
                                onClick={() => {
									setPlayer1DisplayName("Player 1");
									setPlayer2DisplayName("Player 2");
									setIsReadyToPlay("playNotLoggedIn");
								}}
                            >
                                {t("PlayNotLoggedIn")}
                            </button>
                        </div>
                    </div>
                </div>
                <div className="extra-text">
                    <p style={scaleStyle}> 
                        {t("AdditionalTextNotLoggedIn")}
                    </p>
                </div>
            </div>
        </>
    );
};

export default PlayNotLoggedIn;

