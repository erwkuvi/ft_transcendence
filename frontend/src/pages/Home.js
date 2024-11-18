import React from 'react';
import PlayButton from '../components/PlayButton';
import './Home.css'

const Home = () => {
	return (
		<div className="page-content main-container">
			<h1 className="title">minipong</h1>
			<div className="stuff">
				<p>Available to play vs CPU, Local Versus and Online</p>
				<PlayButton/>
			</div>
		</div>
	);
};

export default Home;
