
export const handle42Authentication = () => {
    const returnUrl = `${window.location.origin}/42-callback-match`;
    window.location.href = `http://localhost:8000/42-login-match/?redirect_uri=${encodeURIComponent(returnUrl)}`;
};

export default handle42Authentication ;