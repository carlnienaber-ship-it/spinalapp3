import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Button from '../ui/Button';

const AccountNotActivatedScreen: React.FC = () => {
  const { logout, user } = useAuth0();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-md w-full text-center bg-gray-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-yellow-400 mb-4">Account Not Activated</h1>
        <p className="text-gray-300 mb-2">
          You have successfully logged in as <span className="font-semibold text-gray-100">{user?.email}</span>.
        </p>
        <p className="text-gray-300 mb-6">
          However, this account does not have the required permissions to access the application. Please contact your manager to have your account activated.
        </p>
        <Button 
          onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })} 
          variant="secondary"
        >
          Log Out
        </Button>
      </div>
    </div>
  );
};

export default AccountNotActivatedScreen;
