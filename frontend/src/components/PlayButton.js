import React from 'react';
import { useHistory } from 'react-router-dom';
import './PlayButton.css';

const PlayButton = () => {
	const history = useHistory();

	const handleClick = () => {
		history.push('/play');
	}

	return (
		<button className="btn play-button py-3 px-5 mt-5"onClick={handleClick}>
			PLAY NOW
		</button>
	);
};

export default PlayButton;
