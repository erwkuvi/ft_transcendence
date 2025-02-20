import React, { useState, useContext, useEffect } from 'react';
import './Play.css';
import { useTranslation } from "react-i18next";
import { AccessibilityContext } from '../AccessibilityContext';
import PlayNotLoggedIn from '../components/PlayComponents/PlayNotLoggedIn';
import PlayTournamentSetup from '../components/PlayComponents/PlayTournamentSetup';
import PlayMultiplayerMode from '../components/PlayComponents/PlayMultiplayerMode';
import Pong from '../components/PlayComponents/Pong'
import TournamentScreen from '../components/PlayComponents/TournamentScreen';
import { GameContext } from "../context/GameContext";
import { getUserProfile } from '../services/getProfile';
import LeaveModal from '../components/PlayComponents/LeaveModal';

const Play = () => {
    const { t } = useTranslation();
    const { fontSize } = useContext(AccessibilityContext);
    const { isReadyToPlay, gameTournamentStarted } = useContext(GameContext);
	const [ isInTournament, setIsInTournament] = useState(false);
	const [ isTheHost, setIsTheHost ] = useState(false);
	const [ showConfirmModal, setShowConfirmModal ] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getUserProfile();
                setIsInTournament(data.in_tournament);
				setIsTheHost(data.is_host);
            } catch (error) {
				console.log("Failed to get user profile", error);
            }
        };
		
        fetchProfile();
    }, [gameTournamentStarted]);
	
	const handleLeaveTournament = () => {
		setShowConfirmModal(true);
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
			setShowConfirmModal(false);
			window.location.reload(); // Or another way to update state
		} catch (error) {
			console.error("Error exiting tournament:", error);
		}
	};
	

	console.log("in tournament", isInTournament)
	console.log("is the host", isTheHost)

    const scaleStyle = {
        fontSize: `${fontSize}px`,
        lineHeight: '1.5'
    };

    const personLoggedIn = localStorage.getItem('user_id');
    console.log("person logged in is: ", personLoggedIn);


	if (isTheHost){
		return (
			<>
				<TournamentScreen scaleStyle={scaleStyle} />
			</>
		)
	}else if (!isTheHost && isInTournament){
		return (
			<div>
				<h3 className="page-content play" style={scaleStyle}>
					{t("You are currently in a tournament.")}
				</h3>
				<div>
					<button className="btn button mt-4" style={scaleStyle} onClick={handleLeaveTournament}>
						{t("leave the tournament")}
					</button>
            	</div>
				<LeaveModal
					isOpen={showConfirmModal}
					title={t("Are you sure you want to leave?")}
					message={t("This means you will officially lose the tournament match and you can't come back to this tournament.")}
					style={scaleStyle}
					onConfirm={confirmLeave}
					onCancel={() => setShowConfirmModal(false)}
				/>
			</div>
		)
	}else {
		return (
			<div className="page-content play">
				{isReadyToPlay ? (
					<Pong className="focus-pong" />
				) : !personLoggedIn ? (
					<PlayNotLoggedIn style={scaleStyle} />
				) : (
					<div className="play-wrapper">
						<div className="title-container">
							<h1 className="title mt-5">{t("PlayTitle")}</h1>
						</div>
						<div className="play-modes-wrapper">
							<PlayMultiplayerMode scaleStyle={scaleStyle} />
							<PlayTournamentSetup scaleStyle={scaleStyle} />
						</div>
					</div>
				)}
			</div>
		);
	}
};

export default Play;
