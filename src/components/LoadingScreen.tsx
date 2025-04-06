
import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center space-y-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="text-lg font-medium">Carregando...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
