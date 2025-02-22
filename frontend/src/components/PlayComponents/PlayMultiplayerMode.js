import React, {useContext} from 'react';
import { useTranslation } from "react-i18next";
import AuthUserForm from './AuthUserForm';
import { GameContext } from "../../context/GameContext";
import	'./PlayMultiplayerMode.css'

const PlayMultiplayerMode = ({ scaleStyle }) => {
    const { t } = useTranslation();
	const { setIsReadyToPlay, isOpponentAuthenticated } = useContext(GameContext);

	return (
		<>
			<div className="playCardHolderStyle" style={scaleStyle}> {/*card basic mode"*/}
				<h3 style={scaleStyle}>{t("PlayTitleMultiplayer")}</h3>
				<p style={scaleStyle} className="playCardDescription">{t("PlayDescriptionMultiplayer")}</p>
				<AuthUserForm scaleStyle={scaleStyle}/>
				<button className="playButtonStyle2"
						style={scaleStyle} 
						onClick={() => setIsReadyToPlay("multiplayer")} 
						disabled={!isOpponentAuthenticated}
				>
                	{t("PlayMultiplayer")}
            	</button>
			</div>
		</>
	);
};

export default PlayMultiplayerMode;
