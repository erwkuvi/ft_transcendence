import axiosInstance from './axiosInstance';


const baseUrl = process.env.REACT_APP_BACKEND_URL;
const GAME_URL = `${baseUrl}/user_management/matches/`;


export const fetchGames = async () => {
    try {
        const response = await axiosInstance.get(GAME_URL, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'JWT ' + localStorage.getItem('access_token'),
            },
        });

        const games = response.data;
        const oneVOneGames = games.filter(game => game.mode === "regular");
        const tournamentGames = games.filter(game => game.mode === "tournament");

        return { oneVOneGames, tournamentGames };
    } catch (error) {
        console.error("Error fetching games:", error);
        throw error;
    }
};

export default { fetchGames };
