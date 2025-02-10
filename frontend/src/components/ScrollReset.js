import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollReset = ({ children }) => {
	const { pathname } = useLocation();

	
	useEffect(() => {
		if (!pathname.includes('play')) { 
			window.scrollTo(0, 0);
		  }
	}, [pathname]);


	return children;
};

export default ScrollReset;