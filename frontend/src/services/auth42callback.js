
export const handle42Authentication = () => {
    const returnUrl = `${window.location.origin}/42-callback-match`;  // Adjust this URL
	console.log("Redirecting to:", returnUrl);
    window.location.href = `http://localhost:8000/42-login-match/?redirect_uri=${encodeURIComponent(returnUrl)}`;
};

export default handle42Authentication ;