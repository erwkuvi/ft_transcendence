import React, {useContext} from 'react';
import { useTranslation } from "react-i18next";
import { GameContext } from "../../context/GameContext";

const BackButton = ({ scaleStyle }) => {
	const {t} = useTranslation();
	const { setIsSubmitting } = useContext(GameContext);
	const { setIsOpponentAuthenticated } = useContext(GameContext); 
	const { setIsReadyToPlay } = useContext(GameContext); 

    return (
        <button
            className="btn button mt-4"
            style={scaleStyle}
            onClick={() => {
                setIsReadyToPlay(null);
                setIsOpponentAuthenticated(false);
				setIsSubmitting(false);
            }}
        >
            {t("Back to Mode Selection")}
        </button>
    );
};

export default BackButton;