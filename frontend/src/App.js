//import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { AuthGuard } from './guards/authGuard';
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

function App() {
	return (
		<div className="App">
			<AuthGuard />
			<Header />
			<Main>
				<ScrollReset>
					<Switch>
						<Route path="/" exact component={Home} />
						<Route path="/play" exact component={Play} />
						<Route path="/profile" exact component={Profile} />
						<Route path="/about" exact component={About} />
						<Route path="/login" exact component={LogIn} />
					</Switch>
				</ScrollReset>
			</Main>
			<Footer />
		</div>
	);
}

export default App;


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
