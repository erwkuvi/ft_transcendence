import React, { useEffect, useState } from 'react';

import './Notification.css'

const backendUrl = process.env.REACT_APP_BACKEND_URL;
const Notification = ({ userIdChanged, onConfirm, onReject }) => {
const [notification, setNotification] = useState(null);
const [socket, setSocket] = useState(null);
const [isAuthenticated, setIsAuthenticated] = useState(false);

	useEffect(() => {
		const user_id = localStorage.getItem('user_id'); // Get the user_id from localStorage
		
		// Check if the user is authenticated
		if (user_id) {
			setIsAuthenticated(true);
			// console.log('user_id found: ', user_id);
		} else {
			setIsAuthenticated(false);
		}
	}, [userIdChanged]);
	useEffect(() => {
		if (isAuthenticated) {
			const user_id = localStorage.getItem('user_id');
			const ws = new WebSocket(`ws://${backendUrl}/ws/notifications/?user_id=${user_id}`);
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
		}
	}, [isAuthenticated]);

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
