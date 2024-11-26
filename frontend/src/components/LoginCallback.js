import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axiosInstance from '../services/axiosInstance';

const LoginCallback = () => {
    const history = useHistory();
    const [error, setError] = useState(null);

    useEffect(() => {
        const handleAuth = async () => {
            try {
                const params = new URLSearchParams(window.location.search);
                const access = params.get('access');
                const refresh = params.get('refresh');

                if (!access || !refresh) {
                    throw new Error('Authentication failed');
                }

                // Store tokens
                localStorage.setItem('refresh_token', refresh);
                localStorage.setItem('access_token', access);
                axiosInstance.defaults.headers.common['Authorization'] = `JWT ${access}`;

                // Test authentication
                await axiosInstance.get('/user_management/players/me/');

                // Redirect to profile
                history.replace('/profile');
            } catch (err) {
                localStorage.clear();
                setError('Authentication failed');
                setTimeout(() => history.replace('/login'), 2000);
            }
        };

        handleAuth();
    }, [history]);

    if (error) {
        return (
            <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
                <p>{error}</p>
                <p>Redirecting...</p>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <p>Authenticating...</p>
        </div>
    );
};

export default LoginCallback;