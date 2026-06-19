import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Client ID must be provided via VITE_GOOGLE_CLIENT_ID env variable.
// Never hardcode OAuth credentials in source code.
const googleClientId = (import.meta.env.VITE_GOOGLE_CLIENT_ID as string) || '100000000000-dummyclientid.apps.googleusercontent.com';

if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) {
  console.warn(
    '[Groovra] VITE_GOOGLE_CLIENT_ID is not set. Google login will not work. ' +
    'Create a .env.local file with VITE_GOOGLE_CLIENT_ID=<your-client-id>.'
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);