import { useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { handleOAuthCallback } from '../services/authService';

export const AuthGuard = () => {
    const location = useLocation();
    const history = useHistory();

    useEffect(() => {
        if (location.pathname === '/login/callback') {
            handleOAuthCallback()
                .then(() => history.replace('/profile'))
                .catch(() => history.replace('/login'));
        }
    }, [location, history]);

    return null;
};