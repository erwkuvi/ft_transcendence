import React, { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";

const ErrorHandlerContext = createContext();

export const ErrorHandlerProvider = ({ children }) => {
    const navigate = useNavigate();

    const handleError = (status) => {
        switch (status) {
            case 404:
                navigate('/404');
                break;
            case 401:
                navigate('/401');
                break;
            case 500:
                navigate('/500');
                break;
            case 502:
                navigate('/502');
                break;
            case 504:
                navigate('/504');
                break;
            case 408:
                navigate('/408');
                break;
            default:
                console.error("Unexpected error:", status);
                break;
        }
    };

    return (
        <ErrorHandlerContext.Provider value={handleError}>
            {children}
        </ErrorHandlerContext.Provider>
    );
};

export const useErrorHandler = () => useContext(ErrorHandlerContext);
