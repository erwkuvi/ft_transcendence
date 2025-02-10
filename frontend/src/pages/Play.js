import React, {useState, useContext, useEffect} from 'react';
import './Play.css';
import { useTranslation } from "react-i18next";
import Pong from '../components/game/Pong';
import { AccessibilityContext } from '../AccessibilityContext';

const baseUrl = `http://localhost:8000/`;

const Play = () => {
	const {t} = useTranslation();
	const { fontSize } = useContext(AccessibilityContext); 
	
	const [selectedMode, setSelectedMode] = useState(null);

	const handleModeSelect = (mode) => {
		setSelectedMode(mode);
	};

	const scaleStyle = {
		fontSize: `${fontSize}px`,
		lineHeight: '1.5'
	};
	
	return (
		<div className="page-content play">
			{selectedMode ? (
				<div>
				<Pong mode={selectedMode} className="focus-pong"/>
				<button className="btn button mt-4" style={scaleStyle} onClick={() => setSelectedMode(null)}>
					Back to Mode Selection
				</button>
				</div>
			) : (
				<>
					<h1 className="title mt-5">
						{t("PlayTitle")}
					</h1>
					<div className="modes mt-4">
						<div className="row justify-content-center" >
							<div className="mode" >
								<h3 style={scaleStyle}>{t("PlaySH1")}</h3>
								<p style={scaleStyle}>{t("PlayT1")}</p>
								<button className="btn button" style={scaleStyle} onClick={() => handleModeSelect("singleplayer")}>
									{t("PlayB1")}
								</button>
							</div>
							<div className="mode">
								<h3 style={scaleStyle}>{t("PlaySH2")}</h3>
								<p style={scaleStyle}>{t("PlayT2")}</p>
								<button className="btn button" style={scaleStyle} onClick={() => handleModeSelect("local")}>
									{t("PlayB2")}
								</button>
							</div>
							<div className="mode">
								<h3 style={scaleStyle}>{t("PlaySH3")}</h3>
								<p style={scaleStyle}>{t("PlayT3")}</p>
								<button className="btn button" style={scaleStyle}>
									{t("PlayB3")}
								</button>
							</div>
							<div className="mode">
								<h3 style={scaleStyle}>{t("PlaySH4")}</h3>
								<p style={scaleStyle}>{t("PlayT4")}</p>
								<button className="btn button" style={scaleStyle}>
									{t("PlayB4")}
								</button>
							</div>
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default Play;
