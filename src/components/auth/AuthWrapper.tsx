import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import LoginScreen from './LoginScreen';
import AccountNotActivatedScreen from './AccountNotActivatedScreen';

const AuthWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth0();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="flex items-center space-x-2 text-xl">
          <svg className="animate-spin h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Authenticating...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  // Auth0 is authenticated, now check for role-based authorization
  const roles = user?.['https://spinalapp.com/roles'] as string[] | undefined;
  const isAuthorized = roles && (roles.includes('Normal User') || roles.includes('Admin'));

  if (!isAuthorized) {
    return <AccountNotActivatedScreen />;
  }

  // User is authenticated and authorized
  return <>{children}</>;
};

export default AuthWrapper;
