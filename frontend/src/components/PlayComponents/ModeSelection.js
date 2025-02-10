import React from 'react';
import { useTranslation } from "react-i18next";
import AuthUserForm from './AuthUserForm';

const ModeSelection = ({ setIsReadyToPlay, isOpponentAuthenticated, setIsOpponentAuthenticated, scaleStyle }) => {
    const { t } = useTranslation();

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
                    <div className="mode">
                        <h3 style={scaleStyle}>{t("PlaySH2")}</h3>
                        <p style={scaleStyle}>{t("PlayT2")}</p>
                        <AuthUserForm isOpponentAuthenticated={isOpponentAuthenticated} setIsOpponentAuthenticated={setIsOpponentAuthenticated} />
                        <button className="btn button" style={scaleStyle} onClick={() => setIsReadyToPlay("multiplayer")} disabled={!isOpponentAuthenticated}>
                            {t("PlayB2")}
                        </button>
                    </div>
					<div className="mode">
						<h3 style={scaleStyle}>{t("PlaySH3")}</h3>
						<p style={scaleStyle}>{t("PlayT3")}</p>
						<button className="btn button" style={scaleStyle}>
							{t("PlayB3")}
						</button>
					</div>
					<div className="mode">
						<h3 style={scaleStyle}>{t("PlaySH4")}</h3>
						<p style={scaleStyle}>{t("PlayT4")}</p>
						<button className="btn button" style={scaleStyle}>
							{t("PlayB4")}
						</button>
					</div>
                </div>
            </div>
        </>
    );
};

export default ModeSelection;
