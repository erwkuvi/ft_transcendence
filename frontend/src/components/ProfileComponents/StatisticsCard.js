import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchGames } from '../../services/getStatistics';

const StatisticsCard = ({ losses, wins, fontSize }) => {
  const { t } = useTranslation();
  const [oneVOneGames, setOneVOneGames] = useState([]);
  const [tournamentGames, setTournamentGames] = useState([]);
  
  const userLoggedInID = parseInt(localStorage.getItem('user_id'), 10);
  const userDisplayName = localStorage.getItem("display_name");

  useEffect(() => {
    const loadGames = async () => {
      try {
		const data = await fetchGames();
        const { oneVOneGames, tournamentGames } = data;

        const filteredOneVOneGames = oneVOneGames.filter(
          game => game.player1 === userLoggedInID || game.player2 === userLoggedInID
        );

        const filteredTournamentGames = tournamentGames.filter(
          game => game.player1 === userLoggedInID || game.player2 === userLoggedInID
        );

        setOneVOneGames(filteredOneVOneGames);
        setTournamentGames(filteredTournamentGames);
		
      } catch (error) {
        console.error("Failed to fetch games:", error);
      }
    };

    loadGames();
  }, []);


  const renderGameInfo = (game) => {
    const isPlayer1 = game.player1 === userLoggedInID;
    const userScore = isPlayer1 ? game.score_player1 : game.score_player2;
    const opponentScore = isPlayer1 ? game.score_player2 : game.score_player1;

    const result = userScore > opponentScore ? t("Won") : t("Lost");

    const opponentID = isPlayer1 ? game.player2 : game.player1;
    const opponentData = game.stats.find(stat => stat.player.user_id === opponentID);

    const gameDate = new Date(game.date);
    const formattedDate = gameDate.toLocaleDateString();
    const formattedTime = gameDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	const opponentDisplayName = opponentData?.player.display_name || "Unknown";

    return (
      <p key={game.id}>
        <strong>{result}</strong> - {formattedDate} {formattedTime} - {userDisplayName} - {userScore} : {opponentScore} - {opponentDisplayName}
      </p>
    );
  };


  return (
    <div className='card basic' style={{ fontSize: `${fontSize}px`, textAlign: 'center' }}>
      <h2>{t("Stats")}</h2>

      <div>
        <h3>{t("Overall Record")}</h3>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
			<p>{t("Wins")} <span>{wins}</span></p>
			<p>{t("Losses")} <span>{losses}</span></p>
      	</div>
      </div>
	
      <div>
        <h3>{t("1v1 Games")}</h3>
        <div style={{ maxHeight: '170px', overflowY: 'auto', border: '1px solid #ccc', padding: '8px' }}>
          {oneVOneGames.length > 0 ? oneVOneGames.map(renderGameInfo) : <p>{t("No 1v1 games played")}</p>}
        </div>
      </div>

      <div>
        <h3>{t("Tournament Games")}</h3>
        <div style={{ maxHeight: '170px', overflowY: 'auto', border: '1px solid #ccc', padding: '8px' }}>
          {tournamentGames.length > 0 ? tournamentGames.map(renderGameInfo) : <p>{t("No tournament games played yet")}</p>}
        </div>
      </div>

    </div>
  );
};

export default StatisticsCard;