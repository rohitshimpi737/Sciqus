// UserAccountStatus.jsx
import React from 'react';

const UserAccountStatus = ({ isActive }) => {
  return (
    <div className={
      isActive
        ? 'px-3 py-2 rounded bg-green-100 text-green-700 text-sm'
        : 'px-3 py-2 rounded bg-red-100 text-red-700 text-sm'
    }>
      {isActive ? 'Account Active' : 'Account Inactive'}
    </div>
  );
};

export default UserAccountStatus;
