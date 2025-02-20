import React, { createContext, useState, useEffect } from 'react';
import { getUserProfile } from '../services/getProfile';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('access_token'));
	const [language, setLanguage] = useState('en');
	const [modeDarkLight, setModeDarkLight] = useState(true);

	useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await getUserProfile();
                if (userData.language) setLanguage(userData.language);
				if (userData.mode !== undefined) setModeDarkLight(userData.mode);
            } catch (error) {
                console.error("Failed to fetch user profile", error);
            }
        };

        fetchUserData(); 
        
    }, []);

    useEffect(() => {
        const handleStorageChange = () => {
            setIsLoggedIn(!!localStorage.getItem('access_token'));
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, language, setLanguage, modeDarkLight, setModeDarkLight }}>
            {children}
        </AuthContext.Provider>
    );
};
