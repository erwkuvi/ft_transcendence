import React, { useContext } from 'react';
import { useTranslation } from "react-i18next";
import { GameContext } from "../../context/GameContext";
import { AuthContext } from '../../context/AuthContext';
import "./PlayNotLoggedIn.css";

const PlayNotLoggedIn = ({ scaleStyle }) => {
    const { t } = useTranslation();
	const { setNavbarOff } = useContext(AuthContext);
    const { setIsReadyToPlay, setPlayer1DisplayName, setPlayer2DisplayName} = useContext(GameContext);

    return (
        <div className="playNotLoggedInCardHolderPadding">
            <div className="playNotLoggedInCardHolderStyle" style={scaleStyle}>
                    <h3 style={scaleStyle}>{t("PlayTitleNotLoggedIn")}</h3>
                    <p style={scaleStyle}>{t("PlayDescriptionNotLoggedIn")}</p>
                    <button 
                        className="buttonStyle1"
                        style={scaleStyle} 
                        onClick={() => {
							setPlayer1DisplayName("Player 1");
							setPlayer2DisplayName("Player 2");
							setIsReadyToPlay("playNotLoggedIn");
							setNavbarOff(true)
						}}
                        aria-label={t("Start game button for not logged in users")}
                    >
                        {t("PlayNotLoggedIn")}
                    </button>
                    <p style={scaleStyle}> 
                        {t("AdditionalTextNotLoggedIn")}
                    </p>
            </div>
        </div>
    );
};

export default PlayNotLoggedIn;

