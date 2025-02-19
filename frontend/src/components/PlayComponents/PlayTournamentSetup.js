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
			setTournamentMatches,
			tournamentMatchID,
			setTournamentMatchID } = useContext(GameContext);
	const [shouldReload, setShouldReload] = useState(false);
	const [error, setError] = useState("");
	const userLoggedInId = localStorage.getItem('user_id');
	const userLoggedInDisplayName = localStorage.getItem('display_name');
	console.log("print the players", tournamentPlayers);
	console.log(tournamentPlayers.map(player => player.id));
	

	useEffect(() => {
        if (shouldReload && tournamentMatchID) {
            // Reset the flag first to prevent infinite reloads
			console.log("Is match id even saved: ", tournamentMatchID)
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
			const response = await fetch('http://localhost:8000/user_management/tournament-create/', {
				method: 'POST',
				headers: {
					"Content-Type": "application/json",
					Authorization: `JWT ${localStorage.getItem('access_token')}`,
				},
				body: JSON.stringify(createTournamentData),
			});
	
			const data = await response.json();
	
			// Log the data for debugging
			console.log("Data from backend:", data);
	
			// Check if the response is successful
			if (!response.ok) {
				let errorMessage = "An error occurred while creating the tournament.";
	
				if (response.status === 400) {
					// Backend sends an error message like "Lukas is already in the tournament"
					if (data.detail) {
						errorMessage = data.detail; // Use the error message from the backend
					} else if (typeof data === "object") {
						const firstKey = Object.keys(data)[0];
						errorMessage = data[firstKey] || errorMessage;
					} else if (typeof data === "string") {
						errorMessage = data;
					}
				}
	
				alert(errorMessage); // Show the error to the user
				setTournamentPlayers([]);  // Reset the players state
				return;
			}
	
			// If the response is ok, proceed with tournament creation
			if (Array.isArray(data) && data.length > 0) {
				console.log("Tournament created successfully:", data);
				const tournamentId = data[0].tournament; 
				setTournamentMatchID(tournamentId); 
				setStartTheTournament(true);
				window.location.reload(); // Refresh page or set state accordingly
			} else {
				console.error("Unexpected response format:", data);
			}
		} catch (error) {
			console.error("Error saving players to the tournament:", error);
			setTournamentPlayers([]);  // Reset the players state
			alert(error.message);  // Show the error message
		}
	};

    return (
        <>
            <div className="tournament-setup" style={scaleStyle}>
                    <div className="card basic mode">
                        <h3 style={scaleStyle}>{t("PlayTitleTournament")}</h3>
                        <p style={scaleStyle}>{t("PlayDescriptionTournament")}</p>
                        <AuthTournamentForm scaleStyle={scaleStyle}/>
                        <button className="btn button" 
							style={scaleStyle} 
							onClick={handleClick} 
							disabled={!isTournamentReady}
						>
                            {t("PlayTournament")}
                        </button>
                    </div>
            </div>
        </>
    );
};

export default PlayTournamentSetup;