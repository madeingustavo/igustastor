
import React from 'react';
import { Navigate } from 'react-router-dom';

// This component will simply redirect to the Dashboard
const Index = () => {
  return <Navigate to="/" replace />;
};

export default Index;
