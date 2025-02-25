import React, { useContext, useEffect, useState, useMemo } from 'react';
import { useTranslation } from "react-i18next";
import { GameContext } from "../../context/GameContext";
import LeaveModal from './LeaveModal'
import "./TournamentScreen.css";
import Pong from './Pong'
import { getTournamentData } from '../../services/getInfoTorunamentId';
import { getAllPlayers } from '../../services/getAllUsers';
import { exitTournament } from '../../services/postExitTournament';  

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
			setTournamentMatchID,
			tournamentMatchID } = useContext(GameContext);
    const [ showConfirmModal, setShowConfirmModal ] = useState(false);
	const [ playersData, setPlayersData] = useState([]);
	const [fetchedTournamentData, setFetchedTournamentData] = useState([]);

	
	useEffect(()=>{
		const fetchPlayersData = async () => {
			try {
				const players = await getAllPlayers();

				// console.log("Players data", players);

				setPlayersData(players)
				const loggedInUserId = parseInt(localStorage.getItem("user_id"), 10);
				const host = players.find(player => player.user_id === loggedInUserId);
				if (host && host.tournament) {
					let tournamentId = parseInt(host.tournament, 10);
					setTournamentMatchID(tournamentId);
				  }
			} catch (error){
				console.error("Failed to get players of the tournament", error);
			}
		}
		fetchPlayersData();
	}, []);
	
	useEffect(() => {
		const fetchTournamentData = async () => {
			if (!tournamentMatchID) return; 
			
			try {
				const data = await getTournamentData(tournamentMatchID);
				setFetchedTournamentData(data);
			} catch (error) {
				console.error("Error fetching tournament data:", error);
			}
		};
		
		fetchTournamentData();
	}, [gameTournamentStarted, tournamentMatchID]);
	
	const playerNameMap = useMemo(() => {
		return playersData.reduce((map, player) => {
			map[player.user_id] = player.display_name;
			return map;
		}, {});
	}, [playersData]);

	const tournamentData = useMemo(() => {
		// console.log("Computing tournamentData from fetchedTournamentData:", fetchedTournamentData);
		
		let players = new Set();  
		let matches = [];         
		let matchWinners = {};   
		
		fetchedTournamentData.forEach((match) => {
			if (match.player1) players.add(match.player1);
			if (match.player2) players.add(match.player2);
			
			matches.push({
				id: match.id,
				player1: match.player1,
				player2: match.player2,
				winner: match.winner,
			});
	
			if (match.winner !== null) {
				matchWinners[match.id] = match.winner;
			}
		});
	
		const result = {
			players: Array.from(players),  
			matches,                       
			matchWinners,                 
		};
	
		// console.log("Computed tournamentData:", result);
		return result;
	}, [fetchedTournamentData]);	
	
    const handleLeaveTournament = () => {
		setShowConfirmModal(true);
    };

	const handleStartMatch = ( player1DisplayName, player1Id, player2DisplayName, player2Id, matchIndex, matchId) => {
		// console.log("Starting match between:", player1DisplayName, player1Id, "and", player2DisplayName, player2Id);
		// console.log("Index of match", matchIndex, "and id of match", matchId)
		setPlayer1DisplayName(player1DisplayName);
		setPlayer1Id(player1Id);
		setPlayer2DisplayName(player2DisplayName);
		setPlayer2Id(player2Id);
		setMatchIndex(matchIndex)
		setIDTournamentGame(matchId);
		setgameTournamentStarted(true);    
	};
	
	const confirmLeave = async () => {
		const userId = localStorage.getItem("user_id");

		try {
			await exitTournament(userId);
			setIsReadyToPlay(null);
			setStartTheTournament(false);
			setTournamentPlayers([]);
			setShowConfirmModal(false);
			window.location.reload(); // Or another way to update state
		} catch (error) {
			console.error("Error exiting tournament:", error);
		}
	};

	if (gameTournamentStarted) {
			return <Pong className="focus-pong" />
	}else{
		return (
			<div className="tournament-matches" style={scaleStyle}>
            <h2 className="tournament-title" style={scaleStyle}>{t("TournamentBracket")}</h2>
            
            <div className="tournament-bracket d-flex flex-row flex-wrap">
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
                        <button className="btn button " 
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
