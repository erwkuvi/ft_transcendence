import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { fetchUsers } from '../services/fetchUsers';
import './Profile.css';
import ListUsers from './ProfileComponents/ListUsers';


const Profile = () => {
	// For the fetching data fron back
    const [profile, setProfile] = useState(null);

    const [allUsers, setAllUsers] = useState([]);
	const [personLoggedIn, setPersonLoggedIn] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
	// end

	const [message, setMessage] = useState('');
	const [socket, setSocket] = useState(null);

	const BASE_URL = 'http://localhost:8000'; // Base URL for the backend
  // Fetch data on component mount
	useEffect(() => {
        const fetchProfile = async () => {
            try {
				// Request from API
            const response = await axios.get(`${BASE_URL}/users/players/me/`);
				// Prepend BASE_URL to avatar if it's a relative URL
            const profileData = {
                ...response.data,
            avatar: response.data.avatar.startsWith('/')
                ? `${BASE_URL}${response.data.avatar}`
                : response.data.avatar,
            };
				console.log('Avatar URL:', profileData.avatar);

				console.log('profileData:', profileData);
        // Set the fetched profile data in the state
            setProfile(response.data);

			const users = await fetchUsers();
            const profile = users.find(user => user.username === profileData.username);
			setPersonLoggedIn(profile);

            const otherUsers = users.filter(user => user.username !== profileData.username);
            setAllUsers(otherUsers);

            } catch (err) {
        // Handle any errors
            setError(err.message || 'An error occurred');
            } finally {
        // Stop the loading indicator
            setLoading(false);
            }
	    }

		const ws = new WebSocket('ws://localhost:8000/ws/notifications/');
		setSocket(ws);

		ws.onopen = () => console.log('WebSocket connection established');

		ws.onmessage = (event) => {
			const data = JSON.parse(event.data);
			console.log('Message from server:', data.message);
		};

		ws.onclose = () => {
			console.log('WebSocket connection closed');
		};

		ws.onerror = (error) => {
			console.error('WebSocket error:', error);
		};

		fetchProfile();

		return () => {
			ws.close();
		};
	}, []);



	const sendMessage = () => {
		if (socket) {
			socket.send(JSON.stringify({ message }));
			setMessage('');
		}
	};

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>; 
  if (!profile) return <p>No profile data available</p>;

    

	return (
		<div className="page-content">
			<h1>PROFILE</h1>
			<div className='container-fluid cards mt-4'>
				<div className='card basic'>
					<h2>Basic Information</h2>
					<img src={profile.avatar} className='profilepic m-2' width='200' height='200' alt={`${profile.display_name}'s avatar`}/>
					<p>Username: <span>{profile.username}</span></p>
					<p>Email: <span>{profile.email}</span></p>
				</div>
				<div className='card basic'>
					<h2>Stats</h2>
					<p>Games played: <span>{profile.matches_id.join(', ')}</span></p>
					<p>Wins: <span>{profile.wins}</span></p>
				</div>
				<div className='card basic'>
					<h2>List of users</h2>
					<ListUsers allUsers={allUsers}
					           setAllUsers={setAllUsers}
							   personLoggedIn={personLoggedIn}/>
				</div>
				<div className='card basic notifications'>
					<h2>Friends list</h2>
					<input type="text"
						id="messageInput"
						placeholder="Enter a message"
						value={message}
						onChange={(e) => setMessage(e.target.value)}
					/>
					//<button id="sendButton" onClick={sendMessage}>Send Message</button>
				</div>
			</div>
		</div>
	);
};

export default Profile;
