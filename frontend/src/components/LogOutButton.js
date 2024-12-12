import React from 'react';
import { useTranslation } from "react-i18next";
import axiosInstance from '../services/axiosInstance';

const LogoutButton = () => {
    const { t } = useTranslation();

    const handleLogout = async () => {
        try {
            const refresh = localStorage.getItem('refresh_token');
            await axiosInstance.post('user_management/logout/', {
                refresh_token: refresh
            });
            localStorage.clear();
            window.location.href = '/login';
        } catch (error) {
            console.error('Logout failed:', error);
            localStorage.clear();
        }
    };

    return (
        <button className="btn login-button" onClick={handleLogout}>
            {t("HeaderLogOut")}
        </button>
    );
};

export default LogoutButton;