import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";

const UserCard = ({ user, personLoggedIn, handleInvite, refreshKey }) => {
	const {t} = useTranslation();
	const [userState, setUserState] = useState({status: user.status});
    const [selectedOption, setSelectedOption] = useState("");

	useEffect(() => {
        setUserState({ status: user.status });
		setSelectedOption("");
    }, [refreshKey, user.status]);

	const updateUserState = (newStatus) => {
        setUserState(prev => ({ ...prev, status: newStatus }));
    };

	const handleOptionChange = async (option) => {
		if (!option) return;

		const actionMap = {
			Invite: "pending",
			Accept: "accepted",
			Reject: "",
			Unfriend: "",
			Block: "blocked",
			Unblock: "unblocked",
		}

		await handleInvite(user.id, personLoggedIn.id, option);
		const newStatus = actionMap[option] || userState.status;
        updateUserState(newStatus);
		setSelectedOption("");
    };

    const getOptions = () => {
		switch (userState.status) {
		  case "unblock":
			return [{ key: "Unblock", label: t("Unblock") }];
		  case "blocked":
			return [];
		  case "invite":
			return [
			  { key: "Invite", label: t("Invite") },
			  { key: "Block", label: t("Block") },
			];
		  case "pending":
			return [{ key: "Block", label: t("Block") }];
		  case "invited":
			return [
			  { key: "Accept", label: t("Accept") },
			  { key: "Reject", label: t("Reject") },
			  { key: "Block", label: t("Block") },
			];
		  case "accepted":
			return [
			  { key: "Unfriend", label: t("Unfriend") },
			  { key: "Block", label: t("Block") },
			];
		  default:
			return [
			  { key: "Invite", label: t("Invite") },
			  { key: "Block", label: t("Block") },
			];
		}
	  }

	  const getStatusLabel = () => {
        const statusLabels = {
            unblock: t("unblock"),
			unblocked: t("unblocked"),
            pending: t("pending"),
            invited: t("invited"),
            accepted: t("accepted"),
        };
        return statusLabels[user.status];
    };

	return (
	  <div>
		<div>{user.username} - {t("CurrentStatus")} {getStatusLabel()}</div>
            {userState.status === 'blocked' ? (
                <div>{t("blockedMessage")}</div>
            ) : (
                <select
                    value={selectedOption}
                    onChange={(e) => {
                        const option = e.target.value;
                        setSelectedOption(option);
                        handleOptionChange(option);
                    }}>
                    <option value="" disabled>{t("SelectOption")}</option>
                    {getOptions().map((option) => (
                        <option key={option.key} value={option.key}>
							{option.label}
						</option>
                    ))}
                </select>
            )}
	  </div>
	);
  };

export default UserCard;
