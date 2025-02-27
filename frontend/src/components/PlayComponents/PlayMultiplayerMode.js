import React, {useContext} from 'react';
import { useTranslation } from "react-i18next";
import AuthUserForm from './AuthUserForm';
import { AuthContext } from '../../context/AuthContext';
import { GameContext } from "../../context/GameContext";
import	'./PlayMultiplayerMode.css'
import "../../pages/Play.css"

const PlayMultiplayerMode = ({ scaleStyle }) => {
    const { t } = useTranslation();
	const { setNavbarOff } = useContext(AuthContext);
	const { setIsReadyToPlay, isOpponentAuthenticated } = useContext(GameContext);

	return (
		<>
			<div className="playCardHolderStyle" style={scaleStyle}> {/*card basic mode"*/}
				<h3 style={scaleStyle}>{t("PlayTitleMultiplayer")}</h3>
				<p style={scaleStyle} className="playCardDescription">{t("PlayDescriptionMultiplayer")}</p>
				<AuthUserForm scaleStyle={scaleStyle}/>
				<button className="buttonStyle1"
						style={scaleStyle} 
						onClick={() => {
							setNavbarOff(true);
							setIsReadyToPlay("multiplayer")
						}} 
						disabled={!isOpponentAuthenticated}
						aria-label={t("Start multiplayer game button")}
				>
                	{t("PlayMultiplayer")}
            	</button>
			</div>
		</>
	);
};

export default PlayMultiplayerMode;
