import React, { useState } from 'react';

// Password confirmation modal component
// Used when toggling 2FA to ensure user authentication
const PasswordModal = ({ isOpen, onClose, onSubmit }) => {
  // State for password input
  const [password, setPassword] = useState('');

  // Handler for form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(password);
    setPassword(''); // Clear password after submission
  };

  // Don't render if modal is not open
  if (!isOpen) return null;

  return (
    // Modal overlay - covers entire screen with semi-transparent background
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {/* Modal container */}
      <div className="bg-gray-50 rounded-lg p-6 w-96 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
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
