import React, {useContext, useState, useEffect} from 'react';
import { useTranslation } from "react-i18next";
import AuthTournamentForm from './AuthTournamentForm';
import { GameContext } from "../../context/GameContext";
import { AuthContext } from "../../context/AuthContext";
import "./PlayTournamentSetup.css";
import { createTournament } from '../../services/postCreateTournament'; 

const PlayTournamentSetup = ({ scaleStyle }) => {
    const { t } = useTranslation();
	const { isTournamentReady, 
			setStartTheTournament, 
			tournamentPlayers, 
			setTournamentPlayers,
			tournamentMatchID,
			setTournamentMatchID } = useContext(GameContext);
	const [shouldReload, setShouldReload] = useState(false);
	const [error, setError] = useState("");
	const userLoggedInId = localStorage.getItem('user_id');
	const userLoggedInDisplayName = localStorage.getItem('display_name');
	// console.log("print the players", tournamentPlayers);
	// console.log(tournamentPlayers.map(player => player.id));
	

	useEffect(() => {
        if (shouldReload && tournamentMatchID) {
            // Reset the flag first to prevent infinite reloads
			// console.log("Is match id even saved: ", tournamentMatchID)
            setShouldReload(false);
            // Force a page refresh after the state has been updated
            window.location.reload();
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
				setTournamentPlayers([]);  // Reset players if creation fails
				alert(error);  // Show backend error message
				window.location.reload();
				return;
			}
	
			// console.log("Tournament Data:", data);
	
			if (Array.isArray(data) && data.length > 0) {
				// console.log("Tournament created successfully:", data);
				const tournamentId = data[0].tournament;
				setTournamentMatchID(tournamentId);
				setStartTheTournament(true);
				window.location.reload();
			} else {
				console.error("Unexpected response format:", data);
				localStorage.removeItem('tournamentPlayers');
				setTournamentPlayers([]);  // Reset players if creation fails
				window.location.reload();

			}
		} catch (error) {
			console.error("Error saving players to the tournament:", error);
			setTournamentPlayers([]);
			localStorage.removeItem('tournamentPlayers');
			alert(error.message);
			window.location.reload();

		}
	};

    return (
        <>
            <div className="playCardHolderStyle" style={scaleStyle}>
            	<h3 style={scaleStyle}>{t("PlayTitleTournament")}</h3>
            	<p style={scaleStyle} className="playCardDescription">{t("PlayDescriptionTournament")}</p>
            	<AuthTournamentForm scaleStyle={scaleStyle}/>
            	<button className="playButtonStyle2" 
					style={scaleStyle} 
					onClick={handleClick} 
					disabled={!isTournamentReady}
				>
                	{t("PlayTournament")}
            	</button>
            </div>
        </>
    );
};

export default PlayTournamentSetup;