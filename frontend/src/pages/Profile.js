import axiosInstance from '../services/axiosInstance';
import React, { useEffect, useState, useRef } from 'react';
import { fetchUsers } from '../services/fetchUsers';
import './Profile.css';
import ListUsers from './ProfileComponents/ListUsers';
import Filter from './ProfileComponents/Filter';
import ListFriends from './ProfileComponents/ListFriends';
import { useTranslation } from 'react-i18next';
import Notification from '../components/Notification';
import PasswordModal from '../components/PasswordModal';

const Profile = () => {
	const {t} = useTranslation();
	// Reference to hidden file input
	const fileInputRef = useRef(null);

	// For the fetching data fron back
    const [profile, setProfile] = useState(null);
	const [friends, setFriends] = useState([]);

    const [allUsers, setAllUsers] = useState([]);
	const [query, setQuery] = useState('');
	const [filterUsers, setFilterUsers] = useState([]);
	const [personLoggedIn, setPersonLoggedIn] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
	// State for managing display name editing
	const [isEditingDisplayName, setIsEditingDisplayName] = useState(false);
	const [newDisplayName, setNewDisplayName] = useState('');
	// end

	const [message, setMessage] = useState('');
	const [userIdChanged, setUserIdChanged] = useState(false);
	const [socket, setSocket] = useState(null);
	// State to track if 2FA status is being saved
	const [isSaving2FA, setIsSaving2FA] = useState(false);
	// State for password confirmation modal
	const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
	const BASE_URL = 'http://localhost:8000'; // Base URL for the backend
  // Fetch data on component mount
	useEffect(() => {
		const fetchProfile = async () => {
			try {
			// Request from API
			const response = await axiosInstance.get('/user_management/players/me/');
			// Prepend BASE_URL to avatar if it's a relative URL
			const profileData = {
				...response.data,
				avatar: response.data.avatar.startsWith('/')
					? `${BASE_URL}${response.data.avatar}`
					: response.data.avatar,
			};
			//console.log('Avatar URL:', profileData.avatar);
			console.log('profileData:', profileData);
			
			localStorage.setItem('user_id', profileData.user_id);
			setUserIdChanged(true);
			// Set the fetched profile data in the state
      setProfile(response.data);
      // Initialize the newDisplayName state with current display name
      setNewDisplayName(response.data.display_name);

			const users = await fetchUsers();
			const profile = users.find(user => user.username === profileData.username);
			setPersonLoggedIn(profile);

			const otherUsers = users.filter(user => user.username !== profileData.username);
			setAllUsers(otherUsers);

			const friendsList = otherUsers.filter(user =>
				profileData.friends.some(friend => friend === user.id)
			);
			setFriends(friendsList);

		} catch (err) {
  	// Handle any errors
			setError(err.message || 'An error occurred');
		} finally {
		// Stop the loading indicator
			setLoading(false);
			}
		};
            
		fetchProfile();
	}, []);

	const handleSearch = (event) => {
		const currFiltered = event.target.value
		setQuery(currFiltered)

		if (!currFiltered) {
			setFilterUsers([]);
		} else {
			const filteredUsers = allUsers.filter(user =>
				user.username.toLowerCase().includes(currFiltered.toLowerCase())
			)
			setFilterUsers(filteredUsers)
		}
	}
	// Handler to enable display name editing mode
	const handleEditDisplayName = () => {
		setIsEditingDisplayName(true);
	};

	// Handler to save the new display name
	const handleSaveDisplayName = async () => {
		try {
			// Send PUT request to update display name on the server
			const response = await fetch(`${BASE_URL}/user_management/players/me/`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'JWT ' + localStorage.getItem('access_token')
				},
				body: JSON.stringify({ display_name: newDisplayName })
			});
			const data = await response.json();
			// Update local state with new display name
			setProfile(prev => ({
				...prev,
				display_name: data.display_name
			}));
			// Exit editing mode
			setIsEditingDisplayName(false);
		} catch (err) {
			console.error('Error updating display name:', err);
		}
	};

	// Handler to cancel display name editing
	const handleCancelEdit = () => {
		// Reset the new display name to the current one
		setNewDisplayName(profile.display_name);
		// Exit editing mode
		setIsEditingDisplayName(false);
	};

	// Handler to trigger file input click
	const handleEditAvatar = () => {
		fileInputRef.current.click();
	};

	// Handler for avatar file change
	const handleAvatarChange = async (event) => {
		const file = event.target.files[0];
		if (!file) return;

		// Validate file type
		if (!file || !file.type.startsWith('image/')) {
			alert('Please select an image file');
			return;
		}

		try {
			// Create form data for file upload
			const formData = new FormData();
			formData.append('avatar', file);

				// Send PUT request to update avatar
				const response = await fetch(`${BASE_URL}/user_management/players/me/`, {
					method: 'PATCH',
					headers: {
						Authorization: 'JWT ' + localStorage.getItem('access_token')
					},
					body: formData
				});

				if (!response.ok) {
					const errorData = await response.json();
					console.error('Error response from server:', errorData);
					alert(`Failed to update avatar: ${JSON.stringify(errorData)}`);
					throw new Error('Failed to update avatar');
				}

				const data = await response.json();

				// Check if the avatar property exists in the response
				if (!data.avatar) {
					throw new Error('Avatar property is missing in the response');
				}

				// Update local state with new avatar URL
				setProfile(prev => ({
					...prev,
					avatar: data.avatar.startsWith('/')
						? `${BASE_URL}${data.avatar}`
						: data.avatar
				}));
		} catch (err) {
			console.error('Error updating avatar:', err);
			alert('Failed to update avatar');
		}
	};

	// Handler for initiating 2FA toggle
	// Opens password confirmation modal instead of immediately toggling
	const handleInitiateToggle2FA = () => {
		if (!profile.otp_active) {
			setPasswordModalOpen(true);
		} else {
			handleToggle2FA();
		}
	};

	// Handler for toggling 2FA status after password confirmation
	// Makes a PATCH request to update the otp_active status
	// Updates local state to reflect the change
const handleToggle2FA = async (password = null) => {
	setIsSaving2FA(true);
	const userId = localStorage.getItem('user_id');
	const token = localStorage.getItem('token');

	try {
		const response = await axiosInstance.post(
			`${BASE_URL}/user_management/otp-active-to-false/`,
			{
				user_id: userId
			},
			{
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `JWT ${token}`
				}
			}
		);
		console.log('Response:', response.data);
		alert('2FA successfully deactivated')

		// Update local state with new 2FA status
		setProfile(prev => ({
			...prev,
			otp_active: !prev.otp_active
		}));
			
	} catch (err) {
		console.error('Error updating 2FA status:', err);
		alert('Failed to update 2FA status. Please try again.');
	} finally {
		setIsSaving2FA(false);
	}
};

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
			<h1>{t("PROFILE")}</h1>
			<div className='container-fluid cards mt-4'>
				<div className='card basic'>
					<h2>{t("Basic Information")}</h2>
					{/* Avatar section with edit functionality */}
					<div className="relative inline-block">
						<img 
							src={profile.avatar} 
							className='profilepic m-2' 
							width='200' 
							height='200' 
							alt={`${profile.display_name}'s avatar`}
						/>
						{/* Hidden file input - Fixed visibility */}
						<input
							type="file"
							ref={fileInputRef}
							onChange={handleAvatarChange}
							accept="image/*"
							className="sr-only"
							style={{ display: 'none' }}
						/>
						{/* Edit avatar button */}
						<button
							onClick={handleEditAvatar}
							className="absolute bottom-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
							title="Edit avatar"
						>
							<span className="text-gray-600">📷</span>
						</button>
					</div>
					<p>{t("Username:")} <span>{profile.username}</span></p>
					{/* Display name section with edit functionality */}
					<p className="flex items-center gap-2">
						{t("Display Name: ")} 
						{isEditingDisplayName ? (
							<>
								{/* Input field for editing display name */}
								<input
									type="text"
									value={newDisplayName}
									onChange={(e) => setNewDisplayName(e.target.value)}
									className="border rounded px-2 py-1"
								/>
								{/* Save button with check symbol */}
								<button
									onClick={handleSaveDisplayName}
									className="p-1 hover:bg-green-100 rounded"
									title="Save"
								>
									<span className="text-green-600">✓</span>
								</button>
								{/* Cancel button with X symbol */}
								<button
									onClick={handleCancelEdit}
									className="p-1 hover:bg-red-100 rounded"
									title="Cancel"
								>
									<span className="text-red-600">✕</span>
								</button>
							</>
						) : (
							<>
								{/* Display current display name */}
								<span>{profile.display_name + ' '}</span>
								{/* Edit button with pencil symbol */}
								<button
									onClick={handleEditDisplayName}
									className="p-1 hover:bg-gray-100 rounded"
									title="Edit display name"
								>
									<span className="text-gray-600">✎</span>
								</button>
							</>
						)}
					</p>
					<p>{t("Email:")} <span>{profile.email}</span></p>
			{/* 2FA Authentication section */}
					<div className="mt-4">
						{/* Toggle button that changes 2FA status */}
						{/* Disabled while saving to prevent multiple requests */}
						<button
							onClick={handleInitiateToggle2FA}
							disabled={isSaving2FA}
							className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
						>
							{isSaving2FA ? t("Saving...") : profile.otp_active ? t("Disable 2FA") : t("Enable 2FA")}
						</button>
					</div>

					{/* Password confirmation modal */}
					<PasswordModal
						isOpen={isPasswordModalOpen}
						onClose={() => setPasswordModalOpen(false)}
						onSubmit={handleToggle2FA}
					/>
				</div>
				<div className='card basic'>
					<h2>{t("Stats")}</h2>
					<p>{t("Games played:")} <span>{profile.matches_id.join(', ')}</span></p>
					<p>{t("Wins")} <span>{profile.wins}</span></p>
				</div>
				<div className='card basic'>
					<h2>{t("List of friends")}</h2>
					<ListFriends friends={friends}/>
					<h2>{t("Search for users")}</h2>
					<Filter type="text" value={query} onChange={handleSearch}/>
					<ListUsers	filterUsers={filterUsers}
								setAllUsers={setAllUsers}
								setFilterUsers={setFilterUsers}
								setFriends={setFriends}
								personLoggedIn={personLoggedIn}/>
				</div>
				{false && <Notification userIdChanged={userIdChanged} />}
				<div className='card basic notifications'>
					<h2>{t("Friends list")}</h2>
					<input type="text"
						id="messageInput"
						placeholder={t("message placeholder")}
						value={message}
						onChange={(e) => setMessage(e.target.value)}
					/>
					//<button id="sendButton" onClick={sendMessage}>{t("Send Message")}</button>
				</div>
			</div>
		</div>
	);
};

export default Profile;
