import React from 'react';
import PlayButton from '../components/PlayButton';
import './TextBox.css';
import { useTranslation } from "react-i18next";


const Home = () => {
	const { t } = useTranslation();

	return (
		<div className="page-content">
			<h1>{t("HOME")}</h1>
			<div className="text-box left">
				<p>{t("The timeless classic, Pong, with a modern twist.")}</p>
			</div>
			<div className="text-box middle">
				<p>{t("Play locally with a friend, vs our AI, or against another player in head-to-head online multiplayer.")}</p>
			</div>
			<div className="text-box left">
				<p>{t("But not right now, website is still under construction :)")}</p>
			</div>
			<div className="col d-flex justify-content-center align-items-center">
				<PlayButton />
			</div>
		</div>
	);
};

export default Home;
