document.addEventListener('DOMContentLoaded', (event) => {
    // Establish the WebSocket connection
	const socket = new WebSocket('ws://localhost:3000/ws/notifications/');

    // Event handler when a message is received from the server
    socket.onmessage = function(e) {
        const data = JSON.parse(e.data);
        console.log('Received notification:', data.message);

        // You can update the DOM or handle the message as needed
        const notificationElement = document.createElement('div');
        notificationElement.textContent = data.message;
        document.getElementById('notifications').appendChild(notificationElement);
    };

    // Event handler when the connection is established
    socket.onopen = function(e) {
        console.log('WebSocket connection established.');
    };

    // Event handler when the connection is closed
    socket.onclose = function(e) {
        console.log('WebSocket connection closed.');
    };

    // Function to send a message to the server
    function sendMessage(message) {
        socket.send(JSON.stringify({ 'message': message }));
    }

    // Example of sending a message when a button is clicked
    document.getElementById('sendButton').addEventListener('click', () => {
        const message = document.getElementById('messageInput').value;
        sendMessage(message);
    });
});
