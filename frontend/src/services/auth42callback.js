
const baseUrl = process.env.REACT_APP_BACKEND_URL;

export const handle42Authentication = () => {
    const returnUrl = `${window.location.origin}/42-callback-match`;
    window.location.href = `${baseUrl}/42-login-match/?redirect_uri=${encodeURIComponent(returnUrl)}`;
};

export default handle42Authentication;
