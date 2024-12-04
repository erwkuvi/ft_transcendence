import React from 'react';
import PlayButton from '../components/PlayButton';
import './Home.css'
import { useTranslation } from "react-i18next";


const Home = () => {
	const { t } = useTranslation();

	return (
		<div className="page-content home">
			<h1 className="title">
				minipong
				<i class="fa-solid fa-circle ball px-1"></i>
			</h1>
			<div className="stuff">
				<p>{t("HomeText")}</p>
				<PlayButton/>
			</div>
		</div>
	);
};

export default Home;
