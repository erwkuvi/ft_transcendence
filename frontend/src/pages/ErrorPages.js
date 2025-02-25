import React, { useContext } from 'react';
import { useTranslation } from "react-i18next";
import { AccessibilityContext } from '../AccessibilityContext';

const NotFound = () => {
  const { t } = useTranslation();
  const { fontSize } = useContext(AccessibilityContext); 

  return (
    <div style={{ fontSize }}>
      <h1>404 - Page Not Found</h1>
      <p>{t("We couldn't find the page you're looking for. It may have been moved, or the URL might be incorrect. Please check the link or return to the homepage.")}</p>
    </div>
  );
};

const Unauthorized = () => {
  const { t } = useTranslation();
  const { fontSize } = useContext(AccessibilityContext); 

  return (
    <div style={{ fontSize }}>
      <h1>401 - Unauthorized</h1>
      <p>{t("You are not authorized to access this page. Please log in with the correct credentials or contact support if you believe this is an error.")}</p>
    </div>
  );
};

const ServerError = () => {
  const { t } = useTranslation();
  const { fontSize } = useContext(AccessibilityContext); 

  return (
    <div style={{ fontSize }}>
      <h1>500 - Internal Server Error</h1>
      <p>{t("Oops! Something went wrong on our side. We’re working on it. Please try again later, or reach out to support if the issue persists.")}</p>
    </div>
  );
};

const BadGateway = () => {
  const { t } = useTranslation();
  const { fontSize } = useContext(AccessibilityContext); 

  return (
    <div style={{ fontSize }}>
      <h1>502 - Bad Gateway</h1>
      <p>{t("There's an issue with one of our servers. Please try again in a few moments. If the problem continues, contact support.")}</p>
    </div>
  );
};

const GatewayTimeout = () => {
  const { t } = useTranslation();
  const { fontSize } = useContext(AccessibilityContext); 

  return (
    <div style={{ fontSize }}>
      <h1>504 - Gateway Timeout</h1>
      <p>{t("The server took too long to respond. Please check your connection or try again later. If the problem persists, contact support.")}</p>
    </div>
  );
};

const RequestTimeout = () => {
  const { t } = useTranslation();
  const { fontSize } = useContext(AccessibilityContext); 

  return (
    <div style={{ fontSize }}>
      <h1>408 - Request Timeout</h1>
      <p>{t("The request took too long to process. Please check your internet connection or try submitting your request again. If this issue continues, please contact support.")}</p>
    </div>
  );
};

export { NotFound, Unauthorized, ServerError, BadGateway, GatewayTimeout, RequestTimeout };
