import React, { useState } from 'react';

const AuthUserForm = ({ isOpponentAuthenticated, setIsOpponentAuthenticated }) => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleAuthentication = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch('http://localhost:8000/user_management/simple-auth/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            });

            if (response.ok) {
                setIsOpponentAuthenticated(true);
                setError('');
            } else {
                setError('Invalid credentials');
                setIsOpponentAuthenticated(false);
            }
        } catch {
            setError('Authentication failed');
            setIsOpponentAuthenticated(false);
        }

        setIsSubmitting(false);
    };

    return (
        <form onSubmit={handleAuthentication} className="auth-form">
            <p>
                Opponent's Username:
                <input 	value={credentials.username} 
						onChange={(e) => setCredentials({ ...credentials, username: e.target.value })} 
						required 
				/>
            </p>
            <p>
                Opponent's Password:
                <input	type="password" 
						value={credentials.password} 
						onChange={(e) => setCredentials({ ...credentials, password: e.target.value })} 
						required 
				/>
                <button type="submit" 
						className="btn button" 
						disabled={isOpponentAuthenticated || isSubmitting}>
                    {isOpponentAuthenticated ? "Ready" : "Submit"}
                </button>
            </p>
            {error && <p className="text-red-500">{error}</p>}
        </form>
    );
};

export default AuthUserForm;
