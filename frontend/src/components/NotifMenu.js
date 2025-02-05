import React, { useState, useEffect } from 'react'
import './NotifMenu.css'
import Notification from './Notification'
import { openDropdown } from './NotifMenuScript'

const NotifMenu = () => {
	const [notifications, setNotifications] = useState([]);
	const [hasUnread, setHasUnread] = useState(false);

	useEffect(() => {
		// Check if there are any unread notifications
		setHasUnread(notifications.some(notification => !notification.read));
	}, [notifications]);

	const handleNotificationRead = (index) => {
		const updatedNotifications = [...notifications];
		updatedNotifications[index].read = true;
		setNotifications(updatedNotifications);
	};

	// -------------------------- Channels test -------------------------- //
	
//		let url = 'ws://${window.location.host}/ws/socket-server/'
//	 const notifSocket = new Websocket(url)
//	 notifSocket.onmessage = function(e){
//	 	let data = JSON.parse(e.data)
//	 	console.log('Data:', data)
//	 };



	// -------------------------- Channels test -------------------------- //

	const addTestNotification = () => {
		const newNotification = {
			title: 'Test notification',
			description: 'Lukas wants to be your friend',
			read: false
		};
		setNotifications(prevNotifications => [...prevNotifications, newNotification]);
	};

	useEffect(() => {
		// Add a test notification when the component mounts
 		addTestNotification();
// 		addTestNotification();

	}, []);

	return (
		<div className="dropdown">
			<button onClick={openDropdown} className="btn btn-secondary dropbtn">
				<i className={`fas fa-bell bell-icon ${hasUnread ? 'ringing' : ''}`}></i>
			</button>
			<div id="drop" className="dropdown-content mt-1">
				{notifications.length === 0 ? (
					<p className="no-notifications">No new notifications</p>
				) : (
					notifications.map((notification, index) => (
						<Notification
							key={index}
							title={notification.title}
							description={notification.description}
							onConfirm={() => handleNotificationRead(index)}
							onReject={() => handleNotificationRead(index)}
							read={notification.read}
						/>
					))
				)}
			</div>
		</div>
	);
};

export default NotifMenu;
