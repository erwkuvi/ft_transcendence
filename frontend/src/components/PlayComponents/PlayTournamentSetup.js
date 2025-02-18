import React, {useContext, useState} from 'react';
import { useTranslation } from "react-i18next";
import AuthTournamentForm from './AuthTournamentForm';
import { GameContext } from "../../context/GameContext";
import { AuthContext } from "../../context/AuthContext";
import "./PlayTournamentSetup.css";

const PlayTournamentSetup = ({ scaleStyle }) => {
    const { t } = useTranslation();
	const { isTournamentReady, 
			setStartTheTournament, 
			tournamentPlayers, 
			setTournamentPlayers,
			setTournamentMatches,
			setTournamentMatchID } = useContext(GameContext);

	const userLoggedInId = localStorage.getItem('user_id');
	const userLoggedInDisplayName = localStorage.getItem('display_name');
	console.log("print the players", tournamentPlayers);
	console.log(tournamentPlayers.map(player => player.id));
	
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

		try{
			const response = await fetch('http://localhost:8000/user_management/tournament-create/', {
				method: 'POST',
				headers: {
					"Content-Type": "application/json",
                    Authorization: `JWT ${localStorage.getItem('access_token')}`,
				},
				body: JSON.stringify(createTournamentData),
			});
			const data = await response.json();
			console.log("What is in data, tournament create", data)

			if (!response.ok) {
				let errorMessage = "An error occurred while creating the tournament.";
	
				if (response.status === 400) {
					if (data.detail) {
						errorMessage = data.detail; 
					} else if (typeof data === "object") {

						const firstKey = Object.keys(data)[0];
						errorMessage = data[firstKey] || errorMessage;
					} else if (typeof data === "string") {

						errorMessage = data;
					}
				}
	
					alert(errorMessage);
					setTournamentPlayers([]);
					return;
				}
				if (Array.isArray(data)) {
					console.log("Tournament created successfully:", data);
					setTournamentMatches(data); 
					setStartTheTournament(true);
					window.location.reload();
				
				} else {
					console.error("Unexpected response format:", data);

				}

		}catch (error) {
			console.error("Error saving players to the tournament: ", error);
			setTournamentPlayers([]);
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