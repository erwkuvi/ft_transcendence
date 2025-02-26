import React, { useEffect, useContext, useRef  } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { GameContext } from '../context/GameContext';

export const OAuth42CallbackHandler = () => {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const location = useLocation();
	const hasHandledError = useRef(false); 
	const {
		setPlayer1Id,
		setPlayer1DisplayName,
		setPlayer2Id,
		setPlayer2DisplayName,
		setIsOpponentAuthenticated
	} = useContext(GameContext);

	const handleError = (message) => {
		if (hasHandledError.current) return; 
		hasHandledError.current = true; 

		const mode = sessionStorage.getItem('mode');
		if (mode === 'tournament')
			localStorage.setItem('urlTournamentError', message);
		else
        	localStorage.setItem('urlError', message);
        navigate('/play', { replace: true });
    };

	useEffect(() => {
		
		const urlError = searchParams.get('error') ? decodeURIComponent(searchParams.get('error')) : null;
		
		if (urlError) {		
			handleError('User not found');
			return;
		}
		if (hasHandledError.current) return;
		const handleCallback = () => {
		
			const urlId = searchParams.get('user_id');
			const urlDisplayName = searchParams.get('display_name');
					
			if (!urlId || !urlDisplayName) {
				handleError('Authentication failed: Missing user data');
				return;
			}
			
			const personsLoggedInId = Number(localStorage.getItem('user_id'));
			const personsLoggedInDisplayName = localStorage.getItem('display_name');

			if (!personsLoggedInId || !personsLoggedInDisplayName){
				handleError('User session not found');
				return;
			}

			const numericUrlId = Number(urlId);

			if (numericUrlId === personsLoggedInId) {
				handleError('You cannot play against yourself');
				return;
			}
			
			const mode = sessionStorage.getItem('mode');
			if (mode === 'tournament') {

				const savedTournamentPlayers = JSON.parse(localStorage.getItem('tournamentPlayers') || '[]');
				
				if (savedTournamentPlayers.some(player => player.id === numericUrlId)){
					handleError('This player is already in the tournament');
					return;
				}
			
				const newPlayers = [...savedTournamentPlayers, { 
				id: numericUrlId, 
				display_name: urlDisplayName 
				}];
				
				localStorage.setItem('tournamentPlayers', JSON.stringify(newPlayers));

			}if (mode === 'match'){
				setPlayer1Id(personsLoggedInId);
				setPlayer1DisplayName(personsLoggedInDisplayName);
				setPlayer2Id(numericUrlId);
				setPlayer2DisplayName(urlDisplayName);
				setIsOpponentAuthenticated(true);
			}
			sessionStorage.removeItem('mode');

			navigate('/play', { replace: true });
		};

		handleCallback();
	}, [searchParams]);

	return null;
	};

	export default OAuth42CallbackHandler;