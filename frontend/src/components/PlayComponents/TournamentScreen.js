import React, { useContext, useEffect, useState, useMemo } from 'react';
import { useTranslation } from "react-i18next";
import { GameContext } from "../../context/GameContext";
import LeaveModal from './LeaveModal'
import "./TournamentScreen.css";
import GameScreen from './GameScreen';
import Pong from './Pong';
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
			setIndexTournament } = useContext(GameContext);
    const [ showConfirmModal, setShowConfirmModal ] = useState(false);
	const [ allDataMatchTournament, setAllDataMatchTournament] = useState([]);   
	const [ isGameStarted, setIsGameStarted ] = useState(false);
	const [ playersData, setPlayersData] = useState([]);


	useEffect(()=>{
		const fetchMatchesData = async () => {
			try {
				const matchData = await getInfoTournament();
				console.log("Match data", matchData)
				setAllDataMatchTournament(matchData);
			} catch (error){
				console.log("Failed to get matches of the tournament", error);
			}
		}
		const fetchPlayersData = async () => {
			try {
				const players = await getAllPlayers();
				setPlayersData(players)
				// console.log("Players data", players);
			} catch (error){
				console.log("Failed to get players of the tournament", error);
			}
		}
		fetchMatchesData();
		fetchPlayersData();
	}, []);
	
	const playerNameMap = useMemo(() => {
		return playersData.reduce((map, player) => {
			map[player.user_id] = player.display_name;
			return map;
		}, {});
	}, [playersData]);

	const tournamentData = useMemo(() => {
		let players = new Set();
		let matches = [];
	
		allDataMatchTournament.forEach(match => {
			players.add(match.player1);
			players.add(match.player2);
			matches.push({
				idx: match.idx,
				player1: match.player1,
				player2: match.player2,
				winner: match.winner
			});
		});
	
		return {
			players: Array.from(players),
			matches
		};
	}, [allDataMatchTournament]);
	
    const handleLeaveTournament = () => {
		setShowConfirmModal(true);
    };

	const handleStartMatch = ( player1DisplayName, player1Id, player2DisplayName, player2Id, idx) => {
		console.log("Starting match between:", player1DisplayName, player1Id, "and", player2DisplayName, player2Id);
		setPlayer1DisplayName(player1DisplayName);
		setPlayer1Id(player1Id);
		setPlayer2DisplayName(player2DisplayName);
		setPlayer2Id(player2Id);
		setIndexTournament(idx);
		setIsGameStarted(true);    
	};

    const confirmLeave = () => {
        setIsReadyToPlay(null);
        setStartTheTournament(false);
        setTournamentPlayers([]);
        setShowConfirmModal(false);
    };

	if (isGameStarted) {
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
								onClick={() => 
									handleStartMatch(
                                        playerNameMap[tournamentData.matches[0].player1] || "Player 3",
                                        tournamentData.matches[0].player1,
                                        playerNameMap[tournamentData.matches[0].player2] || "Player 4",
                                        tournamentData.matches[0].player2,
										tournamentData.matches[0].idx
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
								onClick={() => 
									handleStartMatch(
                                        playerNameMap[tournamentData.matches[1].player1] || "Player 3",
                                        tournamentData.matches[1].player1,
                                        playerNameMap[tournamentData.matches[1].player2] || "Player 4",
                                        tournamentData.matches[1].player2,
										tournamentData.matches[1].idx
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
                            <div className="player">{"???"}</div>
                            <div className="vs">VS</div>
                            <div className="player">{"???"}</div>
                        </div>
                        <button className="btn button" style={scaleStyle} disabled>
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
                message={t("This means you will officially lose the tournament match and you can't come back to this tournament.")}
				scaleStyle={scaleStyle}
                onConfirm={confirmLeave}
                onCancel={() => setShowConfirmModal(false)}
            />
			
        </div>
		
    );
}
};

export default TournamentScreen;
