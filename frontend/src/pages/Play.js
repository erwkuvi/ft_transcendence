import React, {useState} from 'react';
import './Play.css';
import { useTranslation } from "react-i18next";
import Pong from '../components/game/Pong';

const Play = () => {
	const {t} = useTranslation();
	const [selectedMode, setSelectedMode] = useState(null);

	const handleModeSelect = (mode) => {
		setSelectedMode(mode);
	};

	return (
		<div className="page-content play">
			{selectedMode ? (
				<div>
				<h2>{t("PlayTitle")}</h2>
				<Pong mode={selectedMode} />
				<button className="btn button mt-4" onClick={() => setSelectedMode(null)}>
					Back to Mode Selection
				</button>
				</div>
			) : (
				<>
					<h1 className="title mt-5">
						{t("PlayTitle")}
					</h1>
					<div className="modes mt-4">
						<div className="row justify-content-center">
							<div className="mode">
								<h3>{t("PlaySH1")}</h3>
								<p>{t("PlayT1")}</p>
								<button className="btn button" onClick={() => handleModeSelect("singleplayer")}>
									{t("PlayB1")}
								</button>
							</div>
							<div className="mode">
								<h3>{t("PlaySH2")}</h3>
								<p>{t("PlayT2")}</p>
								<button className="btn button" onClick={() => handleModeSelect("local")}>
									{t("PlayB2")}
								</button>
							</div>
							<div className="mode">
								<h3>{t("PlaySH3")}</h3>
								<p>{t("PlayT3")}</p>
								<button className="btn button">
									{t("PlayB3")}
								</button>
							</div>
							<div className="mode">
								<h3>{t("PlaySH4")}</h3>
								<p>{t("PlayT4")}</p>
								<button className="btn button">
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
