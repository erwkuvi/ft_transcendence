import { useEffect, useState, useContext } from 'react';
import { useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import { GameContext } from "../context/GameContext";
import { useTranslation } from "react-i18next";

export const IntraPlayerGuard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const {
    setIsOpponentAuthenticated,
    setPlayer2Id,
    setPlayer2DisplayName,
    setPlayer1Id,
    setPlayer1DisplayName
  } = useContext(GameContext);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Only run guard if we're on the callback URL (e.g., '/42-callback-match')
    if (location.pathname === "/42-callback-match") {
      const userId = searchParams.get('user_id');
      const displayName = searchParams.get('display_name');

      if (userId && displayName) {
        // Handle successful authentication and set the game state
        const personsLoggedInId = Number(localStorage.getItem('user_id'));
        const personsLoggedInDisplayName = localStorage.getItem('display_name');

        if (Number(userId) === personsLoggedInId) {
          // Prevent player from playing against themselves
          setError(t('You cannot play against yourself'));
          setIsOpponentAuthenticated(false);
        } else {
          setIsOpponentAuthenticated(true);
          setPlayer2Id(userId);
          setPlayer2DisplayName(displayName);
          setPlayer1Id(personsLoggedInId);
          setPlayer1DisplayName(personsLoggedInDisplayName);

          // Redirect to the game page after authentication
          navigate('/play');
        }
      } else {
        // Handle missing parameters in the callback
        setError(t('Authentication failed'));
        setIsOpponentAuthenticated(false);
      }
    }
  }, [location, searchParams, setIsOpponentAuthenticated, setPlayer2Id, setPlayer2DisplayName, setPlayer1Id, setPlayer1DisplayName, t, navigate]);

  return error ? <p className="text-red-500 text-center mt-4">{error}</p> : null;
};

// export const IntraPlayerGuard = () => {
//     const location = useLocation();
//     const { t } = useTranslation();
//     const { setIsOpponentAuthenticated, 
// 			setPlayer2Id, 
// 			setPlayer2DisplayName, 
// 			setPlayer1Id, 
// 			setPlayer1DisplayName } = useContext(GameContext);

//     const [authError, setAuthError] = useState(null);
//     const [isChecking, setIsChecking] = useState(true);

//     useEffect(() => {
//         if (location.pathname === "/play") {
//             const fetchUserInfo = async () => {
//                 try {
//                     const response = await fetch("http://localhost:8000/42-callback-match/", {
//                         method: "GET",
//                         headers: { "Content-Type": "application/json" },
//                     });

//                     if (!response.ok) throw new Error(t("Authentication failed"));

//                     const data = await response.json();

//                     if (data?.user_id && data?.display_name) {
//                         setIsOpponentAuthenticated(true);
//                         setPlayer2Id(data.user_id);
//                         setPlayer2DisplayName(data.display_name);

//                         const personsLoggedInId = Number(localStorage.getItem("user_id"));
//                         setPlayer1Id(personsLoggedInId);
//                         setPlayer1DisplayName(localStorage.getItem("display_name"));

//                         setIsChecking(false);
//                     } else {
//                         throw new Error(t("User not found"));
//                     }
//                 } catch (error) {
//                     console.error("Auth error:", error);
//                     setAuthError(t("Authentication failed"));
//                     setIsChecking(false);
//                 }
//             };

//             fetchUserInfo();
//         }
//     }, [location, t, setIsOpponentAuthenticated, setPlayer2Id, setPlayer2DisplayName, setPlayer1Id, setPlayer1DisplayName]);

//     if (isChecking) {
//         return <p>{t("Checking authentication...")}</p>;
//     }

//     if (authError) {
//         return <p className="text-red-500">{authError}</p>;
//     }

//     return null;
// };
