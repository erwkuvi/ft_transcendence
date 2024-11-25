import React from 'react';
import { useTranslation } from "react-i18next";

const LogInButton = () => {
    const { t } = useTranslation();

    const handleClick = () => {
        window.location.href = 'http://localhost:8000/auth/42/login/';
    };

    return (
        <button className="btn button login-button py-2 px-5 mt-5" onClick={handleClick}>
            {t("LogInButton")}
        </button>
    );
};

export default LogInButton;