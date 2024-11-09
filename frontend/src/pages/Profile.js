import axios from 'axios';
import React, { useEffect, useState } from 'react';
// import userService from './userService';
import './Profile.css';

const changeStatus = async ({userId, senderId, status, url}) => {
	try {
		const response = await axios.post(
			url,
			{
				sender: senderId,
				receiver: userId,
				status: status
			}
		);

		if (response.status === 200 && response.data.success) {
			alert(response.data.success);
		} else {
			alert("Failed: " + (response.data.error || "Unknown error."));
		}
	} catch (error) {
		console.error("Error:", error);
		alert("Failed to change status. Please try again.");
	}
}

const ListUsers = ({allUsers, personLoggedIn, blocked, setBlocked}) => {
	const handleInvite = async (userId, senderId, option) => {
		console.log('User in handle invite:', userId)
		console.log('sender in handle invite:', senderId)
		console.log("picked option is", option)
        if (option === 'Invite') {
			const url = `http://localhost:8000/friends/users/send_invite/`
			const status = 'pending'
			await changeStatus({userId, senderId, status, url})
        } else if (option === 'Accept') {
            const url = `http://localhost:8000/friends/users/accept_invite/`
			const status = 'accepted'
			await changeStatus({userId, senderId, status, url})
        } else if (option === 'Reject') {
            const url = `http://localhost:8000/friends/users/reject_invite/`
			const status = 'rejected'
			await changeStatus({userId, senderId, status, url})
        }else if (option === 'Unfriend') {
            const url = `http://localhost:8000/friends/users/remove_friend/`
			const status = 'removed'
			await changeStatus({userId, senderId, status, url})
        }

    };

    const blockUser = async (userId, senderId) => {
		console.log('User in handle block:', userId)
		console.log('Person un/blocking:', senderId)
		const url = `http://localhost:8000/friends/users/block_user/`
		const status = 'blocked'
        await changeStatus({userId, senderId, status, url})
    };

	return (
		<p>{allUsers.map((user) => (
			<UserCard 
          		user={user}
          		personLoggedIn={personLoggedIn}
          		handleInvite={handleInvite}
          		blockUser={blockUser}/>
		))}</p>
	)
}

const UserCard = ({ user, personLoggedIn, handleInvite, blockUser }) => {
	// Local state for each user
	const [userState, setUserState] = useState({
	  status: user.status,
	  blocked: user.blocked || false,
	});
    const [selectedOption, setSelectedOption] = useState("");

	const handleOptionChange = async (option) => {
        switch (option) {
            case 'Invite':
                await handleInvite(user.id, personLoggedIn.id, option);
                setUserState(prev => ({ ...prev, status: 'pending' }));
                break;
            case 'Accept':
                await handleInvite(user.id, personLoggedIn.id, option);
                setUserState(prev => ({ ...prev, status: 'accepted' }));
                break;
            case 'Reject':
                await handleInvite(user.id, personLoggedIn.id, option);
                setUserState(prev => ({ ...prev, status: '' }));
                break;
            case 'Unfriend':
                await handleInvite(user.id, personLoggedIn.id, option);
                setUserState(prev => ({ ...prev, status: '' }));
                break;
            case 'Block':
				await blockUser(user.id, personLoggedIn.id);
                setUserState(prev => ({ ...prev, status: 'blocked', blocked: !prev.blocked }));
                break;
            case 'Unblock':
                await blockUser(user.id, personLoggedIn.id);
                setUserState(prev => ({ ...prev, status: 'unblocked', blocked: !prev.blocked }));
                break;
            default:
                break;
        }
		setSelectedOption("");
    };

    const getOptions = () => {
        if (userState.blocked) return ['Unblock'];
        switch (userState.status) {
            case 'invite':
                return ['Invite', 'Block'];
            case 'pending':
                return ['Block'];
            case 'invited':
                return ['Accept', 'Reject', 'Block'];
            case 'accepted':
                return ['Unfriend', 'Block'];
            default:
                return ['Invite', 'Block'];
        }
    };

	return (
	  <div>
		<div>{user.username} - Current status: {userState.status}</div>
            <select
                value={selectedOption}
                onChange={(e) => {
                    const option = e.target.value;
                    setSelectedOption(option);
                    handleOptionChange(option);
                }}>
                <option value="" disabled>Select an option</option>
                {getOptions().map((option) => (
                    <option key={option} value={option}>{option}</option>
                ))}
            </select>
	  </div>
	);
  };

const Profile = () => {
	// For the fetching data fron back
    const [profile, setProfile] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const [blocked, setBlocked] = useState({sender: null, user: null, blocked: false});
	const [personLoggedIn, setPersonLoggedIn] = useState(null)

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

			const usersResponse = await axios.get(`${BASE_URL}/api/users/`);
            const users = usersResponse.data;
            const profile = users.find(user => user.username === profileData.username);
			setPersonLoggedIn(profile);
            const otherUsers = users.filter(user => user.username !== profileData.username);
			console.log('what is profile.id; ', profileData.username)
			console.log('list of users:', users)
			console.log('Users without profile.id should be: ', otherUsers)
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
					  personLoggedIn={personLoggedIn}
					  blocked={blocked}
					  setBlocked={setBlocked}/>
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
