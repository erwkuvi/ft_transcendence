import React, { useState } from 'react';

const PasswordModal = ({ isOpen, onClose, onSubmit, onPasswordSuccess }) => {
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userId = localStorage.getItem('user_id');

        try {
            const response = await fetch('http://localhost:8000/user_management/otp-activate/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'JWT ' + localStorage.getItem('access_token')
                },
                body: JSON.stringify({
                    user_id: userId,
                    password: password
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                if (response.status === 400 && errorData.non_field_errors && errorData.non_field_errors.includes("OTP is already activated for this user.")) {
                    // Call the onPasswordSuccess callback if the specific error is encountered
                    if (onPasswordSuccess) onPasswordSuccess();
                    return;
                }
                throw new Error('Network response was not ok!');
            }

            const data = await response.json();
            console.log('Success:', data);
            localStorage.setItem('qr_code_url', data.qr_code_url);
            onSubmit(password);

            // Call the onPasswordSuccess callback
            if (onPasswordSuccess) onPasswordSuccess();
        } catch (error) {
            console.error('Error:', error);
        }

        setPassword('');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black flex items-center justify-center" style={{ zIndex: 9999 }}>
            <div className="bg-[#0e0f23] border border-white rounded-lg p-6 w-96 relative" style={{ paddingLeft: '15px', paddingBottom: '10px', zIndex: 10000 }}>
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                    style={{ marginLeft: '-15px' }}
                >
                    ✕
                </button>
                <h2 className="text-xl font-semibold mb-4">Confirm Password</h2>
                <p className="text-gray-600 mb-4">
                    Please enter your password to confirm this action
                </p>
                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full p-2 border rounded mb-4"
                        required
                    />
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Confirm
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PasswordModal;
