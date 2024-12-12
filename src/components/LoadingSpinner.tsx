import React from 'react';

export const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);