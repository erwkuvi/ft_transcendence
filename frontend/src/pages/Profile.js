import React, { useEffect, useState, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { fetchUsers } from '../services/fetchUsers';
import { getUserProfile } from '../services/getProfile';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../services/axiosInstance';
import { AccessibilityContext } from '../AccessibilityContext';
import ListUsers from '../components/ProfileComponents/ListUsers';
import Filter from '../components/ProfileComponents/Filter';
import ListFriends from '../components/ProfileComponents/ListFriends';
import Notification from '../components/Notification';
import PasswordModal from '../components/PasswordModal';
import StatisticsCard from '../components/ProfileComponents/StatisticsCard';
import Otp from '../components/OTPActivationModal';
import { AuthContext } from '../context/AuthContext';
import { updateUserProfile } from '../services/patchUserProfile';
import './Profile.css';

const Profile = () => {
	const {t} = useTranslation();
	const { fontSize } = useContext(AccessibilityContext); 
	const fileInputRef = useRef(null);
	const navigate = useNavigate(); 

	const [profile, setProfile] = useState(null);
	const [friends, setFriends] = useState([]);
	const [allUsers, setAllUsers] = useState([]);
	const [query, setQuery] = useState('');
	const [filterUsers, setFilterUsers] = useState([]);
	const [personLoggedIn, setPersonLoggedIn] = useState(null);

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [isEditingDisplayName, setIsEditingDisplayName] = useState(false);
	const [newDisplayName, setNewDisplayName] = useState('');

	const [isSaving2FA, setIsSaving2FA] = useState(false);
	// State for password confirmation modal
	const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
	const [isOtpActive, setOtpActive] = useState(false); // State for OTP activation
	const BASE_URL = process.env.REACT_APP_BACKEND_URL; // Base URL for the backend
	const { isLoggedIn } = useContext(AuthContext);

	const [status, setStatus] = useState(''); //for online-status
  const user_id = localStorage.getItem('user_id');


	useEffect(() => {
		if (!isLoggedIn) {
			navigate('/login'); 
		}
	}, [navigate, isLoggedIn]);

	if (!isLoggedIn) {
        return <p>Loading...</p>; 
    }



  
  useEffect(() => {
	const loadProfile = async () => {
		try {
			const profileData = await getUserProfile();
			console.log('User ID:', profileData.user_id); // Print the user_id to the console
			localStorage.setItem('user_id', profileData.user_id);
			localStorage.setItem('display_name', profileData.display_name);

			setProfile(profileData);
			setNewDisplayName(profileData.display_name);
			
			const users = await fetchUsers();
			const loggedInUser = users.find(user => user.username === profileData.username);
			setPersonLoggedIn(loggedInUser);

			const otherUsers = users.filter(user => user.username !== profileData.username);
			setAllUsers(otherUsers);

			const friendsList = otherUsers.filter(user =>
				profileData.friends.includes(user.id)
			);
			setFriends(friendsList);

		} catch (err) {
			setError(err.message || 'An error occurred');
		} finally {
			setLoading(false);
		}
	};

	loadProfile();
}, []);

	useEffect(() => {
		const token = localStorage.getItem('access_token'); // Assuming JWT or similar token
		if (!user_id) {
			return;
		}

		console.log('User IDDD:', user_id); // Print the user_id to the console
		// Construct the WebSocket URL with the token as a query parameter
		//const wsUrl = `wss://localhost/ws/online-status/?user_id=${user_id}&token=${token}`;
		const wsUrl = `ws://localhost:8000/ws/online-status/?user_id=${user_id}&token=${token}`;
		//const wsUrl = `ws://localhost:8000/ws/online-status/`;

		// Create a new WebSocket instance
		const ws = new WebSocket(wsUrl);
		ws.onopen = () => console.log('-----------------------------------------WebSocket for user-status connection established');

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
	}, [status, user_id]);

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

	const handleEditDisplayName = () => setIsEditingDisplayName(true);

	const handleSaveDisplayName = async () => {

		if (!newDisplayName || newDisplayName === profile.display_name) {
			// If the display name is the same as the current one or is empty, avoid making unnecessary updates.
			// console.log("No change in display name");
			return;
		}
		
		if (newDisplayName.length < 3) {
			// console.log("Display name is too short");
			alert(t('Display name must be at least 3 characters long.'));
			return;
		}

		try {
			const updatedProfile = await updateUserProfile({ display_name: newDisplayName });

            setProfile(updatedProfile);
            localStorage.setItem('display_name', newDisplayName);
			setIsEditingDisplayName(false);
	
		} catch (err) {
			console.error('Error updating display name:', err);
			alert(t('Failed to update display name'));
		}
	};

	const handleCancelEdit = () => {
		setNewDisplayName(profile.display_name);
		setIsEditingDisplayName(false);
	};


	const handleEditAvatar = () => fileInputRef.current.click();
	
	const handleAvatarChange = async (event) => {
		const file = event.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        try {
            const updatedProfile = await updateUserProfile({ avatar: file });

            setProfile(updatedProfile);
		
		} catch (err) {
			console.error('Error updating avatar:', err);
			alert(t('Failed to update avatar'));
		}
	};

	// Function to handle successful password authentication
	const handlePasswordSuccess = () => {

			// console.log('Password successfully authenticated (handlePasswordSuccess)');

			setPasswordModalOpen(false);
			setOtpActive(true); 
			// console.log('after closing the passwordmodal.');

			// Optionally, you can call handleToggle2FA here if needed
			//handleToggle2FA();
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
	// console.log('in active to false.');
	setIsSaving2FA(true);
	const userId = localStorage.getItem('user_id');
	const token = localStorage.getItem('access_token');

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
		// console.log('Response:', response.data);
		alert(t('2FA successfully deactivated'))

		// Update local state with new 2FA status
		setProfile(prev => ({
			...prev,
			otp_active: !prev.otp_active
		}));
			
	} catch (err) {
		console.error('Error updating 2FA status:', err);
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
		<div className="page-content" style={{ fontSize: `${fontSize}px` }}>
			<h1>{t("PROFILE")}</h1>
			<div className='container-fluid cards mt-4' style={{ fontSize: `${fontSize}px` }}>
				<div className='card basic user-info ' style={{ fontSize: `${fontSize}px` }}>
					<h2>{t("Basic Information")}</h2>
					{/* Avatar section with edit functionality */}
					<div className="relative inline-block">
						<img 
							src={profile.avatar} 
							className='profilepic m-2' 
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
							className="edit-avatar-button"
							title="Edit avatar"
							aria-label="Edit avatar"
						>
							<span className="edit-pic">📷</span>
						</button>

					</div>
					<p > {t("Username")} <span>{profile.username}</span></p>
					{/* Display name section with edit functionality */}
					<p className="flex items-center gap-2">
						{t("Display Name")} 
						{isEditingDisplayName ? (
							<>
								{/* Input field for editing display name */}
								<input
									type="text"
									value={newDisplayName}
									onChange={(e) => setNewDisplayName(e.target.value)}
									className="change-display-name-input"
								/>
								{/* Save button with check symbol */}
								<>
									<button
										onClick={handleSaveDisplayName}
										className="yes-no-button"
										title="Save"
									>
										<span className="text-green-600">✓</span>
									</button>
									{/* Cancel button with X symbol */}
									<button
										onClick={handleCancelEdit}
										className="yes-no-button"
										title="Cancel"
									>
										<span className="text-red-600">✕</span>
									</button>
								</>
							</>
						) : (
							<>
								{/* Display current display name */}
								<span>{profile.display_name + ' '}</span>
								{/* Edit button with pencil symbol */}
								<button
									onClick={handleEditDisplayName}
									className="edit-display-name-button"
									title="Edit display name"
								>
									<span className="write-symbol">✎</span>
								</button>
							</>
						)}
					</p>
					<p>{t("email")} <span>{profile.email}</span></p>
			{/* 2FA Authentication section */}
			{profile.auth_provider !== "42api" && (
					<div className="mt-4">
							{/* Toggle button that changes 2FA status */}
							{/* Disabled while saving to prevent multiple requests */}
							<button
									onClick={handleInitiateToggle2FA}
									disabled={isSaving2FA}
									className="tfabutton btn button"
							>
									{isSaving2FA ? t("Saving...") : profile.otp_active ? t("Disable 2FA") : t("Enable 2FA")}
							</button>
					</div>
			)}

					{/* Password confirmation modal */}
					<PasswordModal
						isOpen={isPasswordModalOpen}
						onClose={() => setPasswordModalOpen(false)}
						onSubmit={handlePasswordSuccess}
						onPasswordSuccess={handlePasswordSuccess} // Pass the callback
					/>
					{isOtpActive && <Otp onSuccess={() => setOtpActive(false)} />}
				</div>
				<StatisticsCard	losses={profile.losses}
								wins={profile.wins}
								fontSize={fontSize} />
				<div className='card basic' style={{ fontSize: `${fontSize}px`, textAlign: 'center' }}>
					<h2>{t("List of friends")}</h2>
					<ListFriends friends={friends}/>
					<Filter className="inputFieldStyle1" placeholder={t("Search for users")} type="text" value={query} onChange={handleSearch}/>
					<ListUsers	filterUsers={filterUsers}
								setAllUsers={setAllUsers}
								setFilterUsers={setFilterUsers}
								setFriends={setFriends}
								personLoggedIn={personLoggedIn}/>
				</div>

			</div>
		</div>
	);
};

export default Profile;
