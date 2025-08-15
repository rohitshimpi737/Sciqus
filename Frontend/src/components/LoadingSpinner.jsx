import React from 'react';

const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-col items-center space-y-2">
        <div className={`animate-spin rounded-full border-b-2 border-blue-600 ${sizeClasses[size]}`}></div>
        {text && <p className="text-sm text-gray-600">{text}</p>}
      </div>
    </div>
  );
};

export default LoadingSpinner;
