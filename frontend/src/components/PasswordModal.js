import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

// Password confirmation modal component
// Used when toggling 2FA to ensure user authentication
const PasswordModal = ({ isOpen, onClose, onSubmit }) => {
  const history = useHistory(); // Get the history instance

// State for password input
  // State for password input
  const [password, setPassword] = useState('');

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Retrieve user_id from local storage
    const userId = localStorage.getItem('user_id');

    // Make a POST request to the endpoint
    try {
      const response = await fetch('http://localhost:8000/user_management/otp-activate/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `JWT ${localStorage.getItem('token')}` // Assuming the token is stored in local storage
        },
        body: JSON.stringify({
          user_id: userId,
          password: password
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Success:', data);
      localStorage.setItem('qr_code_url', data.qr_code_url); // Replace 'propertyName' with the actual property name
      onSubmit(password);
			history.push('/otp'); //redirect to the /otp
    } catch (error) {
      console.error('Error:', error);
    }

    setPassword(''); // Clear password after submission
  };

  // Don't render if modal is not open
  if (!isOpen) return null;

  return (
    // Modal overlay - covers entire screen with semi-transparent background
    <div className="fixed inset-0 bg-black flex items-center justify-center " style={{zIndex: 9999}}>
      {/* Modal container */}
      <div className="bg-[#0e0f23] border border-white rounded-lg p-6 w-96 relative" style={{ paddingLeft: '15px', paddingBottom: '10px', zIndex: 10000 }}>
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" style={{ marginLeft: '-15px' }}       >
          ✕
        </button>

        {/* Modal content */}
        <h2 className="text-xl font-semibold mb-4">Confirm Password</h2>
        <p className="text-gray-600 mb-4">
          Please enter your password to confirm this action
        </p>

        {/* Password form */}
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
