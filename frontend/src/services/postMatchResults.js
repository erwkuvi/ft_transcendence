import axiosInstance from './axiosInstance';
const baseUrl = process.env.REACT_APP_BACKEND_URL;

export const postTournamentMatchResults = async (tournamentMatchData) => {
    const endpoint = `${baseUrl}/user_management/score-upload/`;
    
    try {
        const response = await axiosInstance.post(endpoint, tournamentMatchData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'JWT ' + localStorage.getItem('access_token')
            }
        });
        return response.data;  // Return data for any further processing if needed
    } catch (error) {
        console.error("Error posting tournament match results:", error);
        throw error;
    }
};

export const postRegularMatchResults = async (matchData) => {
    const endpoint = `${baseUrl}/user_management/matches/`;
    
    try {
        const response = await axiosInstance.post(endpoint, matchData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'JWT ' + localStorage.getItem('access_token')
            }
        });
        return response.data;  // Return data for any further processing if needed
    } catch (error) {
        console.error("Error posting regular match results:", error);
        throw error;
    }
};

export const postMatchResults = async (winnerId, scores, iDTournamentGame, player1Id, player2Id) => {
	// console.log('Saving match results...');
    // console.log({ winnerId, scores, iDTournamentGame, player1Id, player2Id });
    const isGuestMode = !player1Id || !player2Id;
    if (isGuestMode) {
        // console.log("Guest mode, skipping posting match results.");
        return;
    }

    const matchData = {
        mode: "regular",
        player1: player1Id, 
        player2: player2Id,
        winner: winnerId,       
        score_player1: scores.p1_f_score,
        score_player2: scores.p2_f_score,
    };

    const tournamentMatchData = {
        id: iDTournamentGame || null,
        score_player1: scores.p1_f_score,
        score_player2: scores.p2_f_score,
        winner: winnerId || null
    };

    if (iDTournamentGame) {
        await postTournamentMatchResults(tournamentMatchData);
    } else {
        await postRegularMatchResults(matchData);
    }
};

export default { postMatchResults, postTournamentMatchResults, postRegularMatchResults };
