import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const { setIsLoggedIn } = useContext(AuthContext);

  const handleLogout = () => {
    setIsLoggedIn(false); 
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    
  };

  return { handleLogout };
};

