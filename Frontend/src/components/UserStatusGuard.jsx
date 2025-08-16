// UserStatusGuard.jsx
import React from 'react';

const UserStatusGuard = ({ children, isActive }) => {
  if (!isActive) {
    return (
      <div className="p-4 text-center text-red-600 bg-red-100 rounded">
        Your account is inactive. Please contact support.
      </div>
    );
  }
  return <>{children}</>;
};

export default UserStatusGuard;
