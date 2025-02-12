import React, { useState, useContext } from 'react';
import { GameContext } from "../../context/GameContext";

const AuthUserForm = () => {
	const { isOpponentAuthenticated, setIsOpponentAuthenticated } = useContext(GameContext); 
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
	const {opponentsId, setOpponentsId} = useContext(GameContext);
    const handleAuthentication = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch('http://localhost:8000/user_management/simple-auth/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            });
			const data = await response.json();
			console.log("response: ", data);
			
            if (response.ok && typeof data.user_id === 'number') {
                setIsOpponentAuthenticated(true);
				setOpponentsId(data.user_id);
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
