import React, {useContext} from 'react';
import { useTranslation } from "react-i18next";
import AuthTournamentForm from './AuthTournamentForm';
import { GameContext } from "../../context/GameContext";
import { AuthContext } from "../../context/AuthContext";
import "./PlayTournamentSetup.css";

const PlayTournamentSetup = ({ scaleStyle }) => {
    const { t } = useTranslation();
	const { isTournamentReady, setStartTheTournament, tournamentPlayers, setTournamentPlayers  } = useContext(GameContext);

	
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
		
		const allPlayers = updatedPlayers.map(player => player.id);

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
				if (!response.ok) {
					const errorData = await response.json();
					
					console.error("Failed to post players: ", errorData);
				} else {
					console.log("Saved players to the tournament");
					setStartTheTournament(true);
				}

		}catch (error) {
			console.error("Error saving players to the tournament: ", error);
			setTournamentPlayers([]);
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
                        	<button className="btn button" 
								style={scaleStyle} 
								onClick={handleClick} 
								disabled={!isTournamentReady}
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