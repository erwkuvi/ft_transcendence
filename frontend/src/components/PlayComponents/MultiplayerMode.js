import React, {useContext} from 'react';
import { useTranslation } from "react-i18next";
import AuthUserForm from './AuthUserForm';
import { GameContext } from "../../context/GameContext";

const MultiplayerMode = ({ scaleStyle }) => {
    const { t } = useTranslation();
	const { setIsReadyToPlay, isOpponentAuthenticated } = useContext(GameContext);

    return (
        <>
            <h1 className="title mt-5">{t("PlayTitle")}</h1>
            <div className="modes mt-4">
                    <div className="mode">
                        <h3 style={scaleStyle}>{t("PlaySH2")}</h3>
                        <p style={scaleStyle}>{t("PlayT2")}</p>
                        <AuthUserForm />
                        <button className="btn button" style={scaleStyle} onClick={() => setIsReadyToPlay("multiplayer")} disabled={!isOpponentAuthenticated}>
                            {t("PlayB2")}
                        </button>
                    </div>
            </div>
        </>
    );
};

export default MultiplayerMode;