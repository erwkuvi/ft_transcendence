import React, {useContext} from 'react';
import { useHistory } from 'react-router-dom';
import './PlayButton.css';
import { useTranslation } from "react-i18next";
import { AccessibilityContext } from '../AccessibilityContext';

const PlayButton = () => {
	const history = useHistory();
	const {t} = useTranslation();
	const { fontSize } = useContext(AccessibilityContext); 

	const handleClick = () => {
		history.push('/play');
	}

	return (
		<button className="btn button play-button py-3 px-5 mt-5" style={{ fontSize: `${fontSize}px` }} onClick={handleClick}>
			{t("HomeButton")}
		</button>
	);
};

export default PlayButton;
