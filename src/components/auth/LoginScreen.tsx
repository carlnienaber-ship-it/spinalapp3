import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Button from '../ui/Button';
import Header from '../ui/Header';

const LoginScreen: React.FC = () => {
  const { loginWithRedirect, isLoading } = useAuth0();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <div className="w-full max-w-md text-center">
        <Header title="Shift Handover" subtitle="Please log in to continue" />
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
          <p className="text-gray-400 mb-6">You will be redirected to a secure login page to sign in to your account.</p>
          <Button 
            onClick={() => loginWithRedirect()} 
            className="w-full" 
            disabled={isLoading}
            size="lg"
          >
            {isLoading ? 'Loading...' : 'Log In / Sign Up'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
