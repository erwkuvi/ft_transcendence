import React, {useContext} from 'react';
import { useTranslation } from "react-i18next";
import AuthUserForm from './AuthUserForm';
import { GameContext } from "../../context/GameContext";

const TournamentSetup = ({ scaleStyle }) => {
    const { t } = useTranslation();
	const { setIsReadyToPlay, isOpponentAuthenticated } = useContext(GameContext);

    return (
        <>
            <div className="modes mt-4">
                    <div className="mode">
                        <h3 style={scaleStyle}>{t("PlaySH4")}</h3>
                        <p style={scaleStyle}>{t("PlayT4")}</p>
                        <AuthUserForm />
                        <button className="btn button" style={scaleStyle} onClick={() => setIsReadyToPlay("multiplayer")} disabled={!isOpponentAuthenticated}>
                            {t("PlayB4")}
                        </button>
                    </div>
            </div>
        </>
    );
};

export default TournamentSetup;