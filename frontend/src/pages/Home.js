import React, { useContext, useRef, useEffect } from 'react';
import PlayButton from '../components/PlayButton';
import './Home.css'
import { useTranslation } from "react-i18next";
import { AccessibilityContext } from '../AccessibilityContext';


const Home = () => {
	const { t } = useTranslation();
	const { fontSize } = useContext(AccessibilityContext); 

	return (
		<div className="page-content home" style={{ fontSize: `${fontSize}px` }}>
			<h1 className="title">
				minipong
				<i className="fa-solid fa-circle ball px-1" 
					style={{ fontSize: `${fontSize}px` }}
					aria-hidden="true"
				></i>
			</h1>
		</div>
	);
};

export default Home;
