import React, {useContext} from 'react';
import { GameContext } from "../../context/GameContext";

const BackButton = ({ scaleStyle }) => {
	const { isOpponentAuthenticated, setIsOpponentAuthenticated } = useContext(GameContext); 
	const { isReadyToPlay, setIsReadyToPlay } = useContext(GameContext); 

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
            Back to Mode Selection
        </button>
    );
};

export default BackButton;