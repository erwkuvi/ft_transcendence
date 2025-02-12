import React from 'react';
import Pong from './Pong';
import BackButton from './BackButton';

const GameScreen = ({ scaleStyle }) => {
    return (
        <div>
            <Pong className="focus-pong" />
            <BackButton scaleStyle={scaleStyle} />
        </div>
    );
};

export default GameScreen;