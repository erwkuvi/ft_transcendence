import React, { useEffect, useState } from 'react';
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { handleOAuthCallback } from '../services/authService';

export const AuthGuard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const code = urlParams.get("code");
        const state = urlParams.get("state");
        
        // Only process if we have code and state and aren't already processing
        if (code && state && !isProcessing) {
            setIsProcessing(true);
            
            const processAuth = async () => {
                try {
                    console.log("Processing OAuth callback...");
                    // const storedState = sessionStorage.getItem('oauth_state');
                    
                    // // Verify state matches
                    // if (state !== storedState) {
                    //     throw new Error('Invalid state parameter');
                    // }
                    
                    // // Clear state from storage
                    // sessionStorage.removeItem('oauth_state');
                    
                    // Get tokens from backend
                    const success = await handleOAuthCallback(navigate, location);
                    
                    if (success) {
                        console.log("Authentication successful");
                        navigate('/profile');
                    } else {
                        console.log("Authentication failed");
                        navigate('/login');
                    }
                } catch (error) {
                    console.error("Authentication failed:", error);
                    navigate('/login');
                } finally {
                    setIsProcessing(false);
                }
            };

            processAuth();
        }
    }, [location, navigate, isProcessing]);

    return null;
};