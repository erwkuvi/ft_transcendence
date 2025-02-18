import React, { useContext, useEffect, useState, useMemo } from 'react';
import { useTranslation } from "react-i18next";
import { GameContext } from "../../context/GameContext";
import LeaveModal from './LeaveModal'
import "./TournamentScreen.css";
import Pong from './Pong'
import { getInfoTournament } from '../../services/getInfoTournament'
import { getAllPlayers } from '../../services/getAllUsers';

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
			setTournamentMatches } = useContext(GameContext);
    const [ showConfirmModal, setShowConfirmModal ] = useState(false);
	const [ playersData, setPlayersData] = useState([]);

	useEffect(() => {
		console.log("Updated tournamentMatches:", tournamentMatches);
	}, [tournamentMatches]);
	

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
	
	const playerNameMap = useMemo(() => {
		return playersData.reduce((map, player) => {
			map[player.user_id] = player.display_name;
			return map;
		}, {});
	}, [playersData]);

	const tournamentData = useMemo(() => {
		console.log("Computing tournamentData from tournamentMatches:", tournamentMatches);
		let players = new Set();
		let matches = [];
		let matchWinners = {};
	
		tournamentMatches.forEach(match => {
			players.add(match.player1);
			players.add(match.player2);
			matches.push({
				idx: match.idx,
				level: match.level,
				player1: match.player1,
				player2: match.player2,
				winner: match.winner
			});
			if (match.winner) {
				matchWinners[match.idx] = match.winner;
			}
		});
	
		const result = {
			players: Array.from(players),
			matches,
			match1Winner: matchWinners[0] || null,
			match2Winner: matchWinners[1] || null,
		};
		
		console.log("Computed tournamentData:", result);
		return result;
	}, [tournamentMatches]);

	console.log("Tournament Matches:", tournamentMatches);

	console.log("Tournament Data:", JSON.stringify(tournamentData, null, 2));

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

    const confirmLeave = () => {
        setIsReadyToPlay(null);
        setStartTheTournament(false);
        setTournamentPlayers([]);
        setShowConfirmModal(false);
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
								{tournamentData.match1Winner ? playerNameMap[tournamentData.match1Winner] || "???" : "???"}
							</div>
							<div className="vs">VS</div>
							<div className="player">
								{tournamentData.match2Winner ? playerNameMap[tournamentData.match2Winner] || "???" : "???"}
							</div>
						</div>
						<button className="btn button" 
								style={scaleStyle} 
								disabled={!tournamentData.match1Winner || !tournamentData.match2Winner} 
								onClick={() => {
									if (tournamentData.match1Winner && tournamentData.match2Winner) {
										handleStartMatch(
											playerNameMap[tournamentData.match1Winner] || "Player 1",
											tournamentData.match1Winner,
											playerNameMap[tournamentData.match2Winner] || "Player 2",
											tournamentData.match2Winner,
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
