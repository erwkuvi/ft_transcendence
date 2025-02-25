import React, { createContext, useState, useEffect, useContext } from 'react';
import { getUserProfile } from '../services/getProfile';
import { useErrorHandler } from './ErrorHandlerContext';
import { Navigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const handleError = useErrorHandler();
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
				setIsLoggedIn(false);
				console.error("Error:", error)
				const status = error?.response?.status;
                if (status) {
					handleError(status);
				} else {
					console.error("Unexpected error: No status available");
				}
            }
        };
		if (isLoggedIn)
       		fetchUserData();
    }, [isLoggedIn, handleError]);

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
        <AuthContext.Provider value={{	isLoggedIn, 
										setIsLoggedIn, 
										language, 
										setLanguage, 
										modeDarkLight, 
										setModeDarkLight }}>
            {children}
        </AuthContext.Provider>
    );
};
