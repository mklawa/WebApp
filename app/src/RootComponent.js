import React from 'react';
import { AuthProvider } from './AuthContext';
import App from './App';

const RootComponent = () => {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
};

export default RootComponent;