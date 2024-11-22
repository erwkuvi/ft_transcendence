import React from 'react';
import './Play.css';
import { useTranslation } from "react-i18next";

const Play = () => {
	const {t} = useTranslation();

	return (
		<div className="page-content play">
			<h1 className="title mt-5">
				{t("PlayTitle")}
			</h1>
			<div className="container modes mt-4">
				<div className="row justify-content-center">
					<div className="mode">
						<h3>{t("PlaySH1")}</h3>
						<p>{t("PlayT1")}</p>
						<button className="btn button">{t("PlayB1")}</button>
					</div>
					<div className="mode">
						<h3>{t("PlaySH2")}</h3>
						<p>{t("PlayT2")}</p>
						<button className="btn button">{t("PlayB2")}</button>
					</div>
					<div className="mode">
						<h3>{t("PlaySH3")}</h3>
						<p>{t("PlayT3")}</p>
						<button className="btn button">{t("PlayB3")}</button>
					</div>
					<div className="mode">
						<h3>{t("PlaySH4")}</h3>
						<p>{t("PlayT4")}</p>
						<button className="btn button">{t("PlayB4")}</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Play;
