import React from 'react';
import './Main.css';

const Main = ({children}) => {
	return (
		<main>
			<div className="d-flex justify-content-center align-items-center w-100 flex-wrap"> {/*container-fluid */}
				{children}
			</div>
		</main>
	);
};

export default Main;
