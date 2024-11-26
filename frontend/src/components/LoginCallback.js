import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const LoginCallback = () => {
    const history = useHistory();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const refresh = params.get('refresh');
        const access = params.get('access');

        if (refresh && access) {
            localStorage.setItem('refresh_token', refresh);
            localStorage.setItem('access_token', access);
            history.push('/profile');
        } else {
            console.error('Missing tokens in callback');
            setError('Authentication failed. Redirecting to login...');
            setTimeout(() => {
                history.push('/login');
            }, 3000);
        }
    }, [history]);

    return <div>Loading...</div>;
};

export default LoginCallback;