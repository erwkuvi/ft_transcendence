import React, {useContext} from 'react';
import { useTranslation } from "react-i18next";
import AuthTournamentForm from './AuthTournamentForm';
import { GameContext } from "../../context/GameContext";
import "./PlayTournamentSetup.css";

const PlayTournamentSetup = ({ scaleStyle }) => {
    const { t } = useTranslation();
	const { isTournamentReady, setIsReadyToPlay } = useContext(GameContext);

    return (
        <>
            <div className="tournament-setup" style={scaleStyle}>
                    <div className="mode">
                        <h3 style={scaleStyle}>{t("PlayTitleTournament")}</h3>
                        <p style={scaleStyle}>{t("PlayDescriptionTournament")}</p>
                        <AuthTournamentForm scaleStyle={scaleStyle}/>
                        <button className="btn button" 
							style={scaleStyle} 
							onClick={() => setIsReadyToPlay("tournament")} 
							disabled={!isTournamentReady}
						>
                            {t("PlayTournament")}
                        </button>
                    </div>
            </div>
        </>
    );
};

export default PlayTournamentSetup;