import React, { useState, useEffect } from 'react';

const UserCard = ({ user, personLoggedIn, handleInvite, refreshKey }) => {
	const [userState, setUserState] = useState({status: user.status});
    const [selectedOption, setSelectedOption] = useState("");

	useEffect(() => {
        setUserState({ status: user.status });
    }, [refreshKey, user.status]);

	const updateUserState = (newStatus) => {
        setUserState(prev => ({ ...prev, status: newStatus }));
    };

	const handleOptionChange = async (option) => {
		if (!option) return;

        const actionMap = {
            'Invite': 'pending',
            'Accept': 'accepted',
            'Reject': '',
            'Unfriend': '',
            'Block': 'unblock',
            'Unblock': 'unblocked'
        };

		await handleInvite(user.id, personLoggedIn.id, option);
		const newStatus = actionMap[option] || userState.status;
        updateUserState(newStatus);
		setSelectedOption("");
    };

    const getOptions = () => {
        switch (userState.status) {
			case 'unblock':
				return ['Unblock'];
			case 'blocked':
				return [];
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
            {userState.status === 'blocked' ? (
                <div>You have been blocked</div>
            ) : (
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
            )}
	  </div>
	);
  };

export default UserCard;
