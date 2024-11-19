import React from 'react';
import './Play.css';

const Play = () => {
	return (
		<div className="page-content play">
			<h1 className="title mt-5">
				play
			</h1>
			<div className="container modes mt-4">
				<div className="row justify-content-center">
					<div className="mode">
						<h3>Singleplayer</h3>
						<p>Go head-to-head with our cutting-edge minipongAI, powered by Django and sheer willpower.</p>
						<button className="btn button">Play vs AI</button>
					</div>
					<div className="mode">
						<h3>Multiplayer Local</h3>
						<p>Grab a friend, pull up a chair, and decide who's the better miniponger once and for all.</p>
						<button className="btn button">Play local</button>
					</div>
					<div className="mode">
						<h3>Multiplayer Online</h3>
						<p>Play minipong with anyone, from anywhere, at any time.</p>
						<button className="btn button">Play online</button>
					</div>
					<div className="mode">
						<h3>Tournament</h3>
						<p>Create a tournament with up to X players and battle it out to find the ultimate champion.</p>
						<button className="btn button">Host a tournament</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Play;
