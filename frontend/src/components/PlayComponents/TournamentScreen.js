import React, { useContext, useEffect, useState, useMemo } from 'react';
import { useTranslation } from "react-i18next";
import { GameContext } from "../../context/GameContext";
import LeaveModal from './LeaveModal'
import "./TournamentScreen.css";
import Pong from './Pong'
import { getTournamentData } from '../../services/getInfoTorunamentId';
import { getAllPlayers } from '../../services/getAllUsers';
import { exitTournament } from '../../services/postExitTournament';  

import useWindowDimensions from '../userWindowDimensions';

function disableNavigationButtons() {
	let pageContent = document.getElementById("pageContentID");
	let pongHeading = document.getElementById("pongHeading");

	if (pongHeading) {
		pongHeading.style.display = 'none';
	}

	if (pageContent) {
		pageContent.style.padding  = '0px';
		pageContent.style.margin   = '0px';
		pageContent.style.position = 'relative';
		pageContent.style.zIndex   = '1000';
	}

	let navbar = document.getElementById("navbarID");
	if (navbar) {
		navbar.style.display = 'none';
	}

	let footer = document.getElementById("footerID");
	if (footer) {
		footer.style.display = 'none';
	}
}

function turnOnFooterNavbar() {
	console.log("IN the function");
    let footer = document.getElementById("footerID");
	console.log(footer);
    if (footer && footer.style.display === "none") {
        footer.style.display = "flex";
    }

    let navbar = document.getElementById("navbarID");
    if (navbar && navbar.style.display === "none") {
        navbar.style.display = "flex";
    }

	let pongHeading  = document.getElementById("pongHeading");
	if (pongHeading && pongHeading.style.display === "none") {
		pongHeading.style.display = "flex";
	}
}


const TournamentScreen = ({ scaleStyle }) => {
	disableNavigationButtons();
    const { t } = useTranslation();
    const { setTournamentPlayers, 
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
	const { width, height } = useWindowDimensions();

	
	useEffect(()=>{
		const fetchPlayersData = async () => {
			try {
				const players = await getAllPlayers();

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
	
		return result;
	}, [fetchedTournamentData]);	
	
    const handleLeaveTournament = () => {
		setShowConfirmModal(true);
    };

	const handleStartMatch = ( player1DisplayName, player1Id, player2DisplayName, player2Id, matchIndex, matchId) => {
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
			window.location.reload();
		} catch (error) {
			console.error("Error exiting tournament:", error);
		}
	};

	window.addEventListener('popstate', () => {
		console.log('User clicked back button');
		turnOnFooterNavbar();
	});

	if (gameTournamentStarted) {
			return <Pong className="focus-pong" />
	}else{
		return (
			<div className="tournament-matches d-flex flex-column w-100" style={{height: `${height - 90}px`}}>
            <h2 className="tournament-title">{t("TournamentBracket")}</h2>
            
            <div className="tournament-bracket d-flex flex-row flex-wrap">
                <div className="round d-flex flex-column">
					{tournamentData.matches.length >= 2 && ( <>
					
                    <div className="match-box d-flex flex-column justify-content-center align-items-center">
                        <h3>{t("Match")} 1</h3>
                        <div className="players d-flex flex-column">
                            <div className="player">{playerNameMap[tournamentData.matches[0].player1] || "Player 1"}</div>
                            <div className="vs">VS</div>
                            <div className="player">{playerNameMap[tournamentData.matches[0].player2] || "Player 2"}</div>
                        </div>
                        <button id="tournamentButtonStyle"
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
								aria-label={t("Start Match 1")}
						>
                            {t("StartMatch")}
                        </button>
                    </div>

                    <div className="match-box d-flex flex-column justify-content-center align-items-center">
                        <h3>{t("Match")} 2</h3>
                        <div className="players d-flex flex-column">
                            <div className="player">{playerNameMap[tournamentData.matches[1].player1] || "Player 3"}</div>
                            <div className="vs">VS</div>
                            <div className="player">{playerNameMap[tournamentData.matches[1].player2] || "Player 4"}</div>
                        </div>
                        <button id="tournamentButtonStyle"  
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
								aria-label={t("Start Match 2")}
						>
                            {t("StartMatch")}
                        </button>
                    </div>
					</>
					)}
                </div>

				<div className="round d-flex flex-column">
					<div className="match-box final d-flex flex-column justify-content-center align-items-center">
						<h3>{t("FinalMatch")}</h3>
						<div className="players d-flex flex-column">
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
						<button id="tournamentButtonStyle"
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
								aria-label={t("Start Final Match")}
						>
							{t("StartMatch")}
						</button>
					</div>
				</div>


            </div>

            <div>
                <button id="tournamentButtonStyle" 
						onClick={handleLeaveTournament}
						aria-label={t("Leave Tournament")}
				>
                    {t("leave the tournament")}
                </button>
            </div>

            <LeaveModal
                isOpen={showConfirmModal}
                title={t("Are you sure you want to leave?")}
                message={t("This means you will officially end the tournament.")}
                onConfirm={confirmLeave}
                onCancel={() => setShowConfirmModal(false)}
            />
			
        </div>
		
    );
}
};

export default TournamentScreen;
