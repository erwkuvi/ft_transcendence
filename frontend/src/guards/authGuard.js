import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { handleOAuthCallback } from '../services/authService';

export const AuthGuard = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (location.pathname === '/login/callback') {
            handleOAuthCallback()
                .then(() => navigate('/profile'))
                .catch(() => navigate('/login'));
        }
    }, [location, navigate]);

    return null;
};