import React from 'react';
import './TextBox.css';

const Play = () => {
	return (
		<div className="page-content">
			<h1>PLAY</h1>
			<div className="text-box left">
				<p>Ready to play some Pong?</p>
			</div>
			<div className="text-box middle">
				<p>Too bad, because we're not ready :(</p>
			</div>
			<div className="text-box left">
				<p>Please wait until we've finished building our site!</p>
			</div>
		</div>
	);
};

export default Play;
