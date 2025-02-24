import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const { setIsLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate(); // useNavigate instead of window.location.href

  const handleLogout = () => {
    setIsLoggedIn(false); // Update state for logged-out status
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    // navigate('/login'); // Use navigate for redirect instead of window.location.href
  };

  return { handleLogout };
};

