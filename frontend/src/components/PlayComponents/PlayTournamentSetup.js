import React, {useContext} from 'react';
import { useTranslation } from "react-i18next";
import AuthTournamentForm from './AuthTournamentForm';
import { GameContext } from "../../context/GameContext";
import { AuthContext } from "../../context/AuthContext";
import "./PlayTournamentSetup.css";

const PlayTournamentSetup = ({ scaleStyle }) => {
    const { t } = useTranslation();
	const { isTournamentReady, setStartTheTournament, tournamentPlayers, setTournamentPlayers  } = useContext(GameContext);
	const { username } = useContext(AuthContext);

	const userLoggedInId = localStorage.getItem('user_id');
	console.log("print the players", tournamentPlayers);
	console.log(tournamentPlayers.map(player => player.id));
	
	const handleClick = async () => {
		 if (!userLoggedInId || !username) {
        console.error("User ID or username is missing.");
        return;
    }

    const numericUserId = Number(userLoggedInId); // Convert to number
    if (isNaN(numericUserId)) {
        console.error("Invalid user ID, not a number:", userLoggedInId);
        return;
    }

    const updatedPlayers = [...tournamentPlayers, { id: numericUserId, username }];

    console.log("Updated Players:", updatedPlayers);
        setTournamentPlayers(updatedPlayers);

		try{
			const response = await fetch('http://localhost:8000/game_management/tournament-create/', {
				method: 'POST',
				headers: {
					"Content-Type": "application/json",
                    Authorization: `JWT ${localStorage.getItem('access_token')}`,
				},
				body: JSON.stringify({
					players: { ids: updatedPlayers.map(player => Number(player.id)) }
				}),
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
                    <div className="mode">
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