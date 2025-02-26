import React, {useContext, useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import AuthTournamentForm from './AuthTournamentForm';
import { GameContext } from "../../context/GameContext";
import { AuthContext } from "../../context/AuthContext";
import "./PlayTournamentSetup.css";
import { createTournament } from '../../services/postCreateTournament'; 

const PlayTournamentSetup = ({ setForceUpdate, scaleStyle }) => {
    const { t } = useTranslation();
	const navigate = useNavigate();
	const { isTournamentReady, 
			setStartTheTournament, 
			tournamentPlayers, 
			setTournamentPlayers,
			tournamentMatchID,
			setTournamentMatchID } = useContext(GameContext);
	const [shouldReload, setShouldReload] = useState(false);
	const userLoggedInId = localStorage.getItem('user_id');
	const userLoggedInDisplayName = localStorage.getItem('display_name');

	useEffect(() => {
        if (shouldReload && tournamentMatchID) {
            setShouldReload(false);
			navigate("/play")
			setForceUpdate(prev => prev + 1);
        }
    }, [shouldReload, tournamentMatchID]);

	const handleClick = async () => {

		 if (!userLoggedInId) {
			console.error("User ID is missing.");
			return;
    	}

    	const updatedPlayers = [...tournamentPlayers, { id: userLoggedInId, display_name: userLoggedInDisplayName }];
        setTournamentPlayers(updatedPlayers);
		
		const allPlayers = updatedPlayers.map(player => Number(player.id));

		const createTournamentData = {
			player_ids: allPlayers, 
			host: userLoggedInId,
		};

		try {
			const { success, data, error } = await createTournament(createTournamentData);
	
			if (!success) {
				console.error("Error creating tournament:", error);
				localStorage.removeItem('tournamentPlayers');
				setTournamentPlayers([]);
				alert(error);
				navigate("/play")
				setForceUpdate(prev => prev + 1);
				return;
			}
	
	
			if (Array.isArray(data) && data.length > 0) {
				const tournamentId = data[0].tournament;
				setTournamentMatchID(tournamentId);
				setStartTheTournament(true);
				navigate("/play")
				setForceUpdate(prev => prev + 1);
			} else {
				console.error("Unexpected response format:", data);
				localStorage.removeItem('tournamentPlayers');
				setTournamentPlayers([]);
				navigate("/play")
				setForceUpdate(prev => prev + 1);
			}
		} catch (error) {
			console.error("Error saving players to the tournament:", error);
			setTournamentPlayers([]);
			localStorage.removeItem('tournamentPlayers');
			alert(error.message);
			navigate("/play")
			setForceUpdate(prev => prev + 1);
		}
	};

    return (
        <>
            <div className="tournament-setup" style={scaleStyle}>
				<div className="play-content">
					<div className="modes mt-0">
                    	<div className="playCardHolderStyle">
                        	<h3 style={scaleStyle}>{t("PlayTitleTournament")}</h3>
                        	<p style={scaleStyle} className="playCardDescription">{t("PlayDescriptionTournament")}</p>
                        	<AuthTournamentForm scaleStyle={scaleStyle}/>
                        	<button className="playButtonStyle2" 
								style={scaleStyle} 
								onClick={handleClick} 
								disabled={!isTournamentReady}
								aria-label={t("Start tournament button")}
							>
                            	{t("PlayTournament")}
                        	</button>
                   		</div>
					</div>
            	</div>
			</div>
        </>
    );
};

export default PlayTournamentSetup;