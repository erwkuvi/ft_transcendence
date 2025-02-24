//import React from 'react';
import React, { useContext, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { NotFound, Unauthorized, ServerError, BadGateway, GatewayTimeout, RequestTimeout } from './pages/ErrorPages';
import { GameProvider } from "./context/GameContext"; 
import { AuthGuard } from './guards/authGuard';
import { OAuth42CallbackHandler } from './guards/intraPlayerGuard';
import Header from './components/Header';
import Footer from './components/Footer'
import Main from './components/Main';
import Home from './pages/Home';
import Play from './pages/Play';
import Profile from './pages/Profile';
import About from './pages/About';
import LogIn from './pages/LogIn';
import './App.css';
import ScrollReset from './components/ScrollReset';
import { AccessibilityProvider } from "./AccessibilityContext";
import { AuthContext } from './context/AuthContext';
import PrivateRoute from "./components/PrivateRoute";

function ScrollToTop() {
	const location = useLocation();
	
	React.useEffect(() => {
	  window.scrollTo(0, 0);
	}, [location.pathname]);
	
	return null;
  }
  

function App() {
	const { isLoggedIn } = useContext(AuthContext);
	const navigate = useNavigate();

	useEffect(() => {
		if (isLoggedIn && location.pathname === '/login') {
			navigate('/profile');
		}
		
	}, [isLoggedIn, navigate]);

	// useEffect(() => {
	// 	handleGlobalError = (error) => {
	// 		if (error.response && error.response.status === 401)
	// 			navigate('/401')
	// 	}

	// 	window.addEventListener('unauthorized', handleGlobalError);

	// 	return () => {
	// 		window.removeEventListener('unauthorized', handleGlobalError);
	// 	};
	// }, [navigate])

	return (
		<AccessibilityProvider>
			<ScrollToTop />
			<Header />
			<div className="App">
				<AuthGuard />
				<Main>
					<ScrollReset>
						<Routes>
							{/* Error Pages */}
							<Route path="*" element={<NotFound />} />
							<Route path="/404" element={<NotFound />} />
							<Route path="/401" element={<Unauthorized />} />
							<Route path="/500" element={<ServerError />} />
							<Route path="/502" element={<BadGateway />} />
							<Route path="/504" element={<GatewayTimeout />} />
							<Route path="/408" element={<RequestTimeout />} />

							<Route path="/" element={<Home />} />
							<Route path="/about" element={<About />} />
							<Route path="/login" element={isLoggedIn ? <Profile /> : <LogIn />} />
							<Route path="/play" element={<GameProvider><Play /></GameProvider>} />

							{/* 🔒 Protected Routes */}
							<Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
						</Routes>
					</ScrollReset>
				</Main>
			</div>
			<Footer />
		</AccessibilityProvider>
	);
}

export default App;
// <Route path="*" exact component={<NotFound} />Consider defining a not found site
//  <Route path="/404" exact component={<NotFound} /> Consider defining a not found site


//import { Switch, Route } from 'react-router-dom';
//import Header from './components/Header';
//import Footer from './components/Footer';
//import Main from './components/Main';
//import Home from './pages/Home';
//import Play from './pages/Play';
//import Profile from './pages/Profile';
//import About from './pages/About';
//import LogIn from './pages/LogIn';
//import './App.css';
//import ScrollReset from './components/ScrollReset';
//
//import axios from 'axios';
//import React, { useEffect, useState } from 'react';
//
//const UserProfile = () => {
//  const [profile, setProfile] = useState(null);
//  const [loading, setLoading] = useState(true);
//  const [error, setError] = useState(null);
//
//  // Fetch data on component mount
//  useEffect(() => {
//    const fetchProfile = async () => {
//      try {
//        // Make the GET request to the Django API
//        const response = await axios.get('http://localhost:8000/users/players/1/');
//        
//        // Set the fetched profile data in the state
//        setProfile(response.data);
//      } catch (err) {
//        // Handle any errors
//        setError(err.message || 'An error occurred');
//      } finally {
//        // Stop the loading indicator
//        setLoading(false);
//      }
//    };
//
//    // Call the fetch function
//    fetchProfile();
//  }, []); // Empty dependency array means this runs once on mount
//
//  // Render loading, error, or profile details
//  if (loading) return <p>Loading...</p>;
//  if (error) return <p>Error: {error}</p>;
//
//  return (
//    <div>
//      <h1>User Profile</h1>
//      {profile && (
//        <div>
//          <img src={profile.avatar} alt={`${profile.display_name}'s avatar`} width="100" height="100" />
//          <h2>{profile.display_name}</h2>
//          <p><strong>User ID:</strong> {profile.user_id}</p>
//          <p><strong>Wins:</strong> {profile.wins}</p>
//          <p><strong>Losses:</strong> {profile.losses}</p>
//          <p><strong>Profile ID:</strong> {profile.profile_id}</p>
//          <p><strong>Friends:</strong> {profile.friends.length}</p>
//          <p><strong>Matches:</strong> {profile.matches_id.join(', ')}</p>
//        </div>
//      )}
//    </div>
//  );
//};
//
//export default UserProfile;
