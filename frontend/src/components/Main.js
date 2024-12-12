import React from 'react';
import './Main.css';

const Main = ({children}) => {
	return (
		<main>
			<div className="container-fluid">
				{children}
			</div>
		</main>
	);
};

export default Main;
