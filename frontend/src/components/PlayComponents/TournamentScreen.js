import React, { useContext, useEffect, useState, useMemo } from 'react';
import { useTranslation } from "react-i18next";
import { GameContext } from "../../context/GameContext";
import LeaveModal from './LeaveModal'
import "./TournamentScreen.css";
import { getPlayersTournament } from '../../services/getPlayersTournament'

const TournamentScreen = ({ scaleStyle }) => {
    const { t } = useTranslation();
    const { tournamentPlayers, setTournamentPlayers, setStartTheTournament, setIsReadyToPlay } = useContext(GameContext);
    const [ showConfirmModal, setShowConfirmModal ] = useState(false);
	const [ allDataMatchTournament, setAllDataMatchTournament] = useState([]); //for now 

	useEffect(()=>{
		const fetchPlayersData = async () => {
			try {
				const data = await getPlayersTournament();
				setAllDataMatchTournament(data);
			} catch (error){
				console.log("Failed to get players of the tournament", error);
			}
		}
		fetchPlayersData();
	}, []);
	
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
	
	console.log("Extracted Tournament Data:", tournamentData);
	console.log("test player 1:", tournamentData.players[0])
	console.log("test player 2:", tournamentData.players[1])	
	console.log("test player 3:", tournamentData.players[2])
	console.log("test player 4:", tournamentData.players[3])

	const displayNames = tournamentData.players.map(id => {
		const player = tournamentPlayers.find(p => p.id === id);
		return player ? player.display_name : null; // 
	});
	
	console.log("Matching Display Names:", displayNames);

    const handleLeaveTournament = () => {
		setShowConfirmModal(true);
    };


	// console.log("and what about this", allDataMatchTournament[0].player1)


    const confirmLeave = () => {
        setIsReadyToPlay(null);
        setStartTheTournament(false);
        setTournamentPlayers([]);
        setShowConfirmModal(false);
    };

    return (
        <div className="tournament-matches" style={scaleStyle}>
            <h2 className="tournament-title" style={scaleStyle}>{t("TournamentBracket")}</h2>
            
            <div className="tournament-bracket">
                <div className="round round-1">
                    <div className="match-box">
                        <h3 style={scaleStyle}>{t("Match")} 1</h3>
                        <div className="players">
                            <div className="player">{tournamentData.players[0] || "Player 1"}</div>
                            <div className="vs">VS</div>
                            <div className="player">{tournamentData.players[1] || "Player 2"}</div>
                        </div>
                        <button className="btn button" style={scaleStyle}>
                            {t("StartMatch")}
                        </button>
                    </div>

                    <div className="match-box">
                        <h3 style={scaleStyle}>{t("Match")} 2</h3>
                        <div className="players">
                            <div className="player">{tournamentData.players[2] || "Player 3"}</div>
                            <div className="vs">VS</div>
                            <div className="player">{tournamentData.players[3] || "Player 4"}</div>
                        </div>
                        <button className="btn button" style={scaleStyle} disabled>
                            {t("StartMatch")}
                        </button>
                    </div>
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
};

export default TournamentScreen;
