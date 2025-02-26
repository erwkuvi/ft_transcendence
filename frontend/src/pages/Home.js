import React, { useContext, useRef, useEffect } from 'react';
import PlayButton from '../components/PlayButton';
import './Home.css'
import { useTranslation } from "react-i18next";
import { AccessibilityContext } from '../AccessibilityContext';
import useWindowDimensions from '../components/userWindowDimensions';


const Home = () => {
	const { t } = useTranslation();
	const { fontSize } = useContext(AccessibilityContext); 
	const { width, height } = useWindowDimensions();

	return (
		<div className="d-flex flex-wrap justify-content-center align-items-center flex-row homePageHeaderHolder" style={{ fontSize: `${fontSize}px`, height: `${height - 90}px`}}>
			<h1>
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
