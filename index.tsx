import React from 'react';
import ReactDOM from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';
import AuthWrapper from './src/components/auth/AuthWrapper';
import BrewersReserveMenu from './src/components/public/BrewersReserveMenu';
import './index.css';

const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
const audience = import.meta.env.VITE_AUTH0_AUDIENCE;

const rootElement = document.getElementById('root')!;
const root = ReactDOM.createRoot(rootElement);

const isPublicRoute = window.location.pathname === '/brewers-reserve';

if (isPublicRoute) {
  root.render(
    <React.StrictMode>
      <BrewersReserveMenu />
    </React.StrictMode>
  );
} else {
  if (!domain || !clientId || !audience) {
    throw new Error('VITE_AUTH0_DOMAIN, VITE_AUTH0_CLIENT_ID and VITE_AUTH0_AUDIENCE must be set in your environment variables.');
  }

  root.render(
    <React.StrictMode>
      <Auth0Provider
        domain={domain}
        clientId={clientId}
        authorizationParams={{
          redirect_uri: window.location.origin,
          audience: audience, // Add the audience for your API
          scope: "openid profile email offline_access" // Request profile information and offline access for refresh tokens
        }}
        useRefreshTokens={true}
        cacheLocation="localstorage"
      >
        <AuthWrapper>
          <App />
        </AuthWrapper>
      </Auth0Provider>
    </React.StrictMode>,
  );
}