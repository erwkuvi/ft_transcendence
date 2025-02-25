import React, {useContext} from 'react';
import { useTranslation } from "react-i18next";
import axiosInstance from '../services/axiosInstance';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
    const { t } = useTranslation();
	const { setIsLoggedIn } = useContext(AuthContext); 
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const refresh = localStorage.getItem('refresh_token');
            await axiosInstance.post('user_management/logout/', {
                refresh_token: refresh
            });
            localStorage.clear();
			setIsLoggedIn(false); 
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
            localStorage.clear();
			setIsLoggedIn(false);
            navigate('/login');
        }
    };

    return (
        <button className="btn login-button" 
				onClick={handleLogout}
				aria-label={t("HeaderLogOut")} 
		>
            {t("HeaderLogOut")}
        </button>
    );
};

export default LogoutButton;