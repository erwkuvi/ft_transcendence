import React, {useContext} from 'react';
import { useTranslation } from "react-i18next";
import AuthUserForm from './AuthUserForm';
import { GameContext } from "../../context/GameContext";

const PlayNotLoggedIn = ({ scaleStyle }) => {
    const { t } = useTranslation();
	const { setIsReadyToPlay } = useContext(GameContext);

    return (
        <>
            <h1 className="title mt-5">{t("PlayTitle")}</h1>
            <div className="modes mt-4">
                <div className="row justify-content-center">
                    <div className="mode">
                        <h3 style={scaleStyle}>{t("PlaySH1")}</h3>
                        <p style={scaleStyle}>{t("PlayT1")}</p>
                        <button className="btn button" style={scaleStyle} onClick={() => setIsReadyToPlay("singleplayer")}>
                            {t("PlayB1")}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PlayNotLoggedIn;
