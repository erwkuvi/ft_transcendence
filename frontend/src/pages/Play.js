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
import	useWindowDimensions from '../components/userWindowDimensions'

import LeaveModal from '../components/PlayComponents/LeaveModal';
import { exitTournament } from '../services/postExitTournament';  
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';



const Play = () => {
	const { t } = useTranslation();
	const navigate = useNavigate()
    const { fontSize } = useContext(AccessibilityContext);
    const { isReadyToPlay, gameTournamentStarted, matchIndex } = useContext(GameContext);
	const [ isInTournament, setIsInTournament] = useState(false);
	const { width, height } = useWindowDimensions();
	const [ isTheHost, setIsTheHost ] = useState(false);
	const [ showConfirmModal, setShowConfirmModal ] = useState(false);
	const { isLoggedIn, navbarOff, setNavbarOff } = useContext(AuthContext);
	const [forceUpdate, setForceUpdate] = useState(0);

	const [loading, setLoading] = useState(true);

	const personLoggedIn = localStorage.getItem('user_id');

	const scaleStyle = {
		fontSize: `${fontSize}px`,
		lineHeight: '1.5'
	};

	useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                if (!isLoggedIn || !personLoggedIn) {
                    setIsInTournament(false);
                    setIsTheHost(false);
					setNavbarOff(false);

                    return;
                }else{
					const data = await getUserProfile();
                	setIsInTournament(data.in_tournament);
                	setIsTheHost(data.is_host);
					if (data.in_tournament === true)
						setNavbarOff(true);
					else if (data.in_tournament === false && data.is_host === true)
						setNavbarOff(true);
					else 
						setNavbarOff(false);
				}
            } catch (error) {
                console.error("Failed to get user profile", error);
                setIsInTournament(false);
                setIsTheHost(false);
				setNavbarOff(false);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [isLoggedIn, gameTournamentStarted, navigate, forceUpdate, matchIndex]);
	
	const handleLeaveTournament = () => {
		setShowConfirmModal(true);
    };

	const confirmLeave = async () => {
		const userId = localStorage.getItem("user_id");
		try {
			await exitTournament(userId);
			setShowConfirmModal(false);
			setNavbarOff(false);
			navigate("/play")
			setForceUpdate(prev => prev + 1);
		} catch (error) {
			console.error("Error exiting tournament:", error);
		}
	};
	
	if (loading) {
        return <div>Loading...</div>;
    }

	if (isTheHost){
		return (
			<>
				<TournamentScreen setForceUpdate={setForceUpdate} scaleStyle={scaleStyle} />
			</>
		)
	}else if (!isTheHost && isInTournament){
		return (
			<div className="d-flex justify-content-center align-items-center flex-column" id="currTournamentLeavePageID" style={{minHeight: `${height - 90}px`, overflowWrap: "anywhere" }}>
				<h3 className="page-content play" style={scaleStyle}>
					{t("You are currently in a tournament.")}
				</h3>
				<div>
					<button className="buttonStyle1" style={scaleStyle} onClick={handleLeaveTournament}>
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
			<div className="d-flex flex-column playPageHolder" id="pageContentID" style={{minHeight: `${height - 90}px` }}>
				<h1 className="pageHeadingH1Style1 typicalPadding" id="pongHeading" style={{display: navbarOff ? "none" : "flex",}}>{t("PlayTitle")}</h1>
				{isReadyToPlay ? (
					<Pong className="focus-pong" />
				) : !isLoggedIn ? (
					<PlayNotLoggedIn style={scaleStyle} />
				) : (
					<>
						<div className="d-flex flex-row flex-wrap playPageCardWrapper m-0">
							<PlayMultiplayerMode scaleStyle={scaleStyle} />
							<PlayTournamentSetup setForceUpdate={setForceUpdate} scaleStyle={scaleStyle}/>
						</div>
					</>
				)}
			</div>
		);
	}
};

export default Play;
