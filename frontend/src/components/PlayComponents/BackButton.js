import React from 'react';

const BackButton = ({ setIsReadyToPlay, setIsOpponentAuthenticated, setIsSubmitting, scaleStyle }) => {
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