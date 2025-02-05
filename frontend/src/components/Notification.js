import React, { useEffect, useState } from 'react';

import './Notification.css'

const Notification = ({ onConfirm, onReject }) => {
	const [notification, setNotification] = useState(null);

	const [socket, setSocket] = useState(null);
	
	useEffect(() => {

		const user_id = localStorage.getItem('user_id'); // Get the token from localStorage
		console.log('user_id found: ', user_id);
		//const ws = new WebSocket('ws://localhost:8000/ws/notifications/?token=${token}');
		const ws = new WebSocket(`ws://localhost:8000/ws/notifications/?user_id=${user_id}`);
		ws.onopen = () => console.log('WebSocket for game connection established');

		setSocket(ws);

		ws.onmessage = (event) => {
			const data = JSON.parse(event.data);
			console.log('Data:', data);
			if (data.type === 'notification') {
				setNotification(data);
			}
		};

		ws.onerror = (error) => {
			console.error('WebSocket error:', error);
		};

		return () => {
			ws.close();
		};
	}, []);

	if (!notification) {
		return <div>No new notifications</div>;
	}

	return (
		<div className={`notification m-0 p-3 ${notification.read ? 'read' : 'unread'}`} onMouseEnter={onConfirm}>
			<div className="notification-text">
				<h4 className="notification-title">{notification.message}</h4>
				<p className="notification-description">{notification.body}</p>
			</div>
			<div className="notification-buttons">
				<button className="btn confirm-btn" onClick={onConfirm}>
					<i className="fas fa-check"></i>
				</button>
				<button className="btn reject-btn" onClick={onReject}>
					<i className="fas fa-times"></i>
				</button>
			</div>
		</div>
	);
};

export default Notification;
