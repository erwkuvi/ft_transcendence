import axiosInstance from './axiosInstance';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const OAuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Get the authorization code from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        // The state parameter will be verified by the backend
        const state = urlParams.get('state');

        if (!code) {
          throw new Error('No authorization code received');
        }

        // Send both code and state to backend
        await authService.handleOAuthCallback(code, state);
        
        // After successful authentication, redirect to the home page
        navigate('/');
      } catch (error) {
        console.error('Authentication error:', error);
        navigate('/login');
      }
    };

    processCallback();
  }, [navigate]);

  return (
    <div className="auth-callback-container">
      <h2>Authenticating...</h2>
      <p>Please wait while we complete your login.</p>
    </div>
  );
};

// Token refresh service
export const refreshToken = async () => {
    try {
        const refresh_token = localStorage.getItem('refresh_token');
        
        const response = await axiosInstance.post('/api/token/refresh/', {
            refresh: refresh_token
        });

        const { access } = response.data;

        // Update access token in local storage
        localStorage.setItem('access_token', access);

        // Update axios default headers
        axiosInstance.defaults.headers.common['Authorization'] = `JWT ${access}`;

        return access;
    } catch (error) {
        // Logout user if refresh fails
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        throw error;
    }
};

//export const handleOAuthCallback = async () => {
//    try {
//        const params = new URLSearchParams(window.location.search);
//        const access = params.get('access');
//        const refresh = params.get('refresh');
//
//        if (!access || !refresh) {
//            throw new Error('Authentication failed');
//        }
//
//			localStorage.setItem('access_token', access);
//			localStorage.setItem('refresh_token', refresh);
//			axiosInstance.defaults.headers.common['Authorization'] = `JWT ${access}`;
//
//        window.location.href = '/profile'
//    } catch (err) {
//        localStorage.clear();
//        throw err;
//    }
//};
