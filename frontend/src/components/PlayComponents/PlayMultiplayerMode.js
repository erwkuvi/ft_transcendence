import React, {useContext} from 'react';
import { useTranslation } from "react-i18next";
import AuthUserForm from './AuthUserForm';
import { GameContext } from "../../context/GameContext";
import "./PlayMultiplayerMode.css";

const PlayMultiplayerMode = ({ scaleStyle }) => {
    const { t } = useTranslation();
	const { setIsReadyToPlay, isOpponentAuthenticated } = useContext(GameContext);

	return (
		<>
			<div className="play-multiplayer" style={scaleStyle}>
				<div className="play-content">
					<div className="modes mt-4">
						<div className="mode">
							<h3 style={scaleStyle}>{t("PlayTitleMultiplayer")}</h3>
							<p style={scaleStyle}>{t("PlayDescriptionMultiplayer")}</p>
							<AuthUserForm scaleStyle={scaleStyle}/>
							<button className="btn button" 
									style={scaleStyle} 
									onClick={() => setIsReadyToPlay("multiplayer")} 
									disabled={!isOpponentAuthenticated}
							>
                            	{t("PlayMultiplayer")}
                        </button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default PlayMultiplayerMode;
