// document.addEventListener('DOMContentLoaded', (event) => {
//     const socket = new WebSocket('ws://localhost:3000/ws/notifications/');
//     socket.onmessage = function(e) {
//         const data = JSON.parse(e.data);
//         console.log('Received notification:', data.message);
//         const notificationElement = document.createElement('div');
//         notificationElement.textContent = data.message;
//         document.getElementById('notifications').appendChild(notificationElement);
//     };
//     socket.onopen = function(e) {
//         console.log('WebSocket connection established.');
//     };
//     socket.onclose = function(e) {
//         console.log('WebSocket connection closed.');
//     };
//     function sendMessage(message) {
//         socket.send(JSON.stringify({ 'message': message }));
//     }
//     document.getElementById('sendButton').addEventListener('click', () => {
//         const message = document.getElementById('messageInput').value;
//         sendMessage(message);
//     });
// });

import React, { useEffect } from 'react';

const Notifications = () => {
    useEffect(() => {
        const socket = new WebSocket('ws://localhost:3000/ws/notifications/');

        socket.onopen = () => {
            console.log('WebSocket connection established');
        };

        socket.onmessage = (event) => {
            console.log('Message from server:', event.data);
        };

        socket.onclose = () => {
            console.log('WebSocket connection closed');
        };

        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        return () => {
            socket.close();
        };
    }, []);

    return (
        <div>
            <h1>Notifications</h1>
        </div>
    );
};

export default Notifications;