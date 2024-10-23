import React, { useEffect, useState } from 'react';
import './Profile.css';

const Profile = () => {
	const [message, setMessage] = useState('');
	const [socket, setSocket] = useState(null);

	useEffect(() => {
		const ws = new WebSocket('ws://localhost:8000/ws/notifications/');
		setSocket(ws);

		ws.onopen = () => {
			console.log('WebSocket connection established');
		};

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

		return () => {
			ws.close();
		};
	}, []);

	const sendMessage = () => {
		if (socket) {
			socket.send(JSON.stringify({ message }));
		}
	};

	return (
		<div className="page-content">
			<h1>PROFILE</h1>
			<div className='container-fluid cards mt-4'>
				<div className='card basic'>
					<h2>Basic Information</h2>
					<img src={require('../assets/blank.png')} className='profilepic m-2' width='200' height='200' alt='profile'/>
					<p>Username: <span>johnsmith11</span></p>
					<p>Email: <span>johnsmith11@mail.com</span></p>
				</div>
				<div className='card basic'>
					<h2>Stats</h2>
					<p>Games played: <span>0</span></p>
					<p>Wins: <span>0</span></p>
				</div>
				<div className='card basic notifications'>
					<h2>Friends list</h2>
					<input type="text"
						id="messageInput"
						placeholder="Enter a message"
						value={message}
						onChange={(e) => setMessage(e.target.value)}
					/>
					<button id="sendButton">Send Message</button>
				</div>
			</div>
		</div>
	);
};

export default Profile;
