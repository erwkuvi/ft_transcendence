import React from 'react';
import Pong from './Pong';
import BackButton from './BackButton';

const GameScreen = ({ setIsReadyToPlay, setIsOpponentAuthenticated, setIsSubmitting, scaleStyle }) => {
    return (
        <div>
            <Pong className="focus-pong" />
            <BackButton setIsReadyToPlay={setIsReadyToPlay} 
						setIsOpponentAuthenticated={setIsOpponentAuthenticated} 
						setIsSubmitting={setIsSubmitting}
						scaleStyle={scaleStyle} 
			/>
        </div>
    );
};

export default GameScreen;