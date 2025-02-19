import React, { useContext, useEffect, useState, useMemo } from 'react';
import { useTranslation } from "react-i18next";
import { GameContext } from "../../context/GameContext";
import LeaveModal from './LeaveModal'
import "./TournamentScreen.css";
import Pong from './Pong'
import { getInfoTournament } from '../../services/getInfoTournament'
import { getAllPlayers } from '../../services/getAllUsers';
import { createTournament } from '../../services/postCreateTournament';  // Import your service

const TournamentScreen = ({ scaleStyle }) => {
    const { t } = useTranslation();
    const { tournamentPlayers, 
			setTournamentPlayers, 
			setStartTheTournament, 
			setIsReadyToPlay, 
			setPlayer1DisplayName, 
			setPlayer2DisplayName, 
			setPlayer1Id,
			setPlayer2Id,
			gameTournamentStarted,
			setgameTournamentStarted,
			setMatchIndex,
			setIDTournamentGame,
			tournamentMatches,
			tournamentMatchID } = useContext(GameContext);
    const [ showConfirmModal, setShowConfirmModal ] = useState(false);
	const [ playersData, setPlayersData] = useState([]);
	const [fetchedTournamentData, setFetchedTournamentData] = useState([]);

	
	useEffect(()=>{
		const fetchPlayersData = async () => {
			try {
				const players = await getAllPlayers();
				setPlayersData(players)
				// console.log("Players data", players);
			} catch (error){
				console.log("Failed to get players of the tournament", error);
			}
		}
		fetchPlayersData();
	}, []);
	
	useEffect(() => {
		const fetchTournamentData = async () => {
			console.log("The id of the tournament is now: ", tournamentMatchID)
			// if (!tournamentMatchID) return; // Prevent fetching if ID is undefined
			
			try {
				const response = await fetch(`http://localhost:8000/user_management/tournaments/1/`);
				if (!response.ok) throw new Error("Failed to fetch tournament data");
				
				const data = await response.json();
				setFetchedTournamentData(data); // Update state with fetched matches
			} catch (error) {
				console.error("Error fetching tournament data:", error);
			}
		};
		
		fetchTournamentData();
	}, [gameTournamentStarted]);
	
	const playerNameMap = useMemo(() => {
		return playersData.reduce((map, player) => {
			map[player.user_id] = player.display_name;
			return map;
		}, {});
	}, [playersData]);

	const tournamentData = useMemo(() => {
		console.log("Computing tournamentData from fetchedTournamentData:", fetchedTournamentData);
		
		let players = new Set();  // For unique players
		let matches = [];         // To hold the matches
		let matchWinners = {};    // To track winners by match ID
		
		fetchedTournamentData.forEach((match) => {
			// Add player1 and player2 to the players set (unique list of players)
			if (match.player1) players.add(match.player1);
			if (match.player2) players.add(match.player2);
			
			// Add match details
			matches.push({
				id: match.id,
				player1: match.player1,
				player2: match.player2,
				winner: match.winner,
			});
	
			// If a winner exists, store it
			if (match.winner !== null) {
				matchWinners[match.id] = match.winner;
			}
		});
	
		// Return the structure with players, matches, and match winners
		const result = {
			players: Array.from(players),  // List of unique players
			matches,                       // All matches with player1, player2, and winner
			matchWinners,                 // Map of match winners
		};
	
		console.log("Computed tournamentData:", result);
		return result;
	}, [fetchedTournamentData]);  // Only recompute when fetchedTournamentData changes
	// Only recompute when fetchedTournamentData changes
	
	
	console.log("What is the id of the tournament: ", tournamentMatchID)
	console.log("Tournament Matches:", fetchedTournamentData);
	
	// console.log("Tournament Data:",  tournamentData.matches[0].player1 );
	

	console.log("tournamet data", tournamentData)
    const handleLeaveTournament = () => {
		setShowConfirmModal(true);
    };

	const handleStartMatch = ( player1DisplayName, player1Id, player2DisplayName, player2Id, matchIndex, matchId) => {
		console.log("Starting match between:", player1DisplayName, player1Id, "and", player2DisplayName, player2Id);
		console.log("Index of match", matchIndex, "and id of match", matchId)
		setPlayer1DisplayName(player1DisplayName);
		setPlayer1Id(player1Id);
		setPlayer2DisplayName(player2DisplayName);
		setPlayer2Id(player2Id);
		setMatchIndex(matchIndex)
		setIDTournamentGame(matchId);
		setgameTournamentStarted(true);    
	};
	

	const confirmLeave = async () => {
		try {
			const response = await fetch("http://localhost:8000/user_management/exit-tournament/", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ user_id: localStorage.getItem("user_id") }),
			});
	
			if (!response.ok) throw new Error("Failed to exit tournament");
	
			console.log("Successfully exited tournament");
			setIsReadyToPlay(null);
			setStartTheTournament(false);
			setTournamentPlayers([]);
			setShowConfirmModal(false);
			window.location.reload(); // Or another way to update state
		} catch (error) {
			console.error("Error exiting tournament:", error);
		}
	};


	// if (!tournamentData) {
		//     return <div>Loading tournament data...</div>;
		// }
		
		
	if (gameTournamentStarted) {
			return (
				<>
				<Pong className="focus-pong" />
			</>
		)	
	}else{
		return (
			<div className="tournament-matches" style={scaleStyle}>
            <h2 className="tournament-title" style={scaleStyle}>{t("TournamentBracket")}</h2>
            
            <div className="tournament-bracket">
                <div className="round round-1">
					{tournamentData.matches.length >= 2 && ( <>
					
                    <div className="match-box">
                        <h3 style={scaleStyle}>{t("Match")} 1</h3>
                        <div className="players">
                            <div className="player">{playerNameMap[tournamentData.matches[0].player1] || "Player 1"}</div>
                            <div className="vs">VS</div>
                            <div className="player">{playerNameMap[tournamentData.matches[0].player2] || "Player 2"}</div>
                        </div>
                        <button className="btn button" 
								style={scaleStyle} 
								disabled={tournamentData.matches[0].winner !== null}
								onClick={() => 
									handleStartMatch(
                                        playerNameMap[tournamentData.matches[0].player1] || "Player 1",
                                        tournamentData.matches[0].player1,
                                        playerNameMap[tournamentData.matches[0].player2] || "Player 2",
                                        tournamentData.matches[0].player2,
										1,
										tournamentData.matches[0].id
                                    )
                                }
						>
                            {t("StartMatch")}
                        </button>
                    </div>

                    <div className="match-box">
                        <h3 style={scaleStyle}>{t("Match")} 2</h3>
                        <div className="players">
                            <div className="player">{playerNameMap[tournamentData.matches[1].player1] || "Player 3"}</div>
                            <div className="vs">VS</div>
                            <div className="player">{playerNameMap[tournamentData.matches[1].player2] || "Player 4"}</div>
                        </div>
                        <button className="btn button" 
								style={scaleStyle} 
								disabled={tournamentData.matches[1].winner !== null}
								onClick={() => 
									handleStartMatch(
                                        playerNameMap[tournamentData.matches[1].player1] || "Player 1",
                                        tournamentData.matches[1].player1,
                                        playerNameMap[tournamentData.matches[1].player2] || "Player 2",
                                        tournamentData.matches[1].player2,
										1,
										tournamentData.matches[1].id
                                    )
                                }
						>
                            {t("StartMatch")}
                        </button>
                    </div>
					</>
					)}
                </div>

				<div className="round round-2">
					<div className="match-box final">
						<h3 style={scaleStyle}>{t("FinalMatch")}</h3>
						<div className="players">
							<div className="player">
								{/* Ensure matches has 3 elements and that player1 is defined */}
								{tournamentData.matches.length > 2 && tournamentData.matches[2] && tournamentData.matches[2].player1
									? playerNameMap[tournamentData.matches[2].player1] || "???"
									: "???"}
							</div>
							<div className="vs">VS</div>
							<div className="player">
								{/* Ensure matches has 3 elements and that player2 is defined */}
								{tournamentData.matches.length > 2 && tournamentData.matches[2] && tournamentData.matches[2].player2
									? playerNameMap[tournamentData.matches[2].player2] || "???"
									: "???"}
							</div>
						</div>
						<button className="btn button" 
								style={scaleStyle} 
								disabled={!tournamentData.matches[2] || !tournamentData.matches[2].player1 || !tournamentData.matches[2].player2} 
								onClick={() => {
									if (tournamentData.matches[2] && tournamentData.matches[2].player1 && tournamentData.matches[2].player2) {
										handleStartMatch(
											playerNameMap[tournamentData.matches[2].player1] || "Player 1",
											tournamentData.matches[2].player1,
											playerNameMap[tournamentData.matches[2].player2] || "Player 2",
											tournamentData.matches[2].player2,
											0,
											tournamentData.matches[2].id
										);
									}
								}}
						>
							{t("StartMatch")}
						</button>
					</div>
				</div>


            </div>

            <div>
                <button className="btn button mt-4" style={scaleStyle} onClick={handleLeaveTournament}>
                    {t("leave the tournament")}
                </button>
            </div>

            <LeaveModal
                isOpen={showConfirmModal}
                title={t("Are you sure you want to leave?")}
                message={t("This means you will officially end the tournament.")}
				style={scaleStyle}
                onConfirm={confirmLeave}
                onCancel={() => setShowConfirmModal(false)}
            />
			
        </div>
		
    );
}
};

export default TournamentScreen;
