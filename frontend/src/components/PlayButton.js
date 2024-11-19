import React from 'react';
import { useHistory } from 'react-router-dom';
import './PlayButton.css';
import { useTranslation } from "react-i18next";

const PlayButton = () => {
	const history = useHistory();
	const {t} = useTranslation();

	const handleClick = () => {
		history.push('/play');
	}

	return (
		<button className="btn play-button py-3 px-5 mt-5"onClick={handleClick}>
			{t("PLAY NOW")}
		</button>
	);
};

export default PlayButton;
