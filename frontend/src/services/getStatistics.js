import axiosInstance from './axiosInstance';

const GAME_URL = `http://localhost:8000/user_management/matches/`;

export const fetchGames = async () => {
    try {
        const response = await axiosInstance.get(GAME_URL, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'JWT ' + localStorage.getItem('access'),
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
