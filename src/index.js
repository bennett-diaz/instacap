import React from 'react';
import ReactDOM from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary'
import { errorPage, logErrorToService } from './components/FallbackUI';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { RemoteConfigProvider } from './contexts/remoteConfigContext'
import { AuthProvider } from './contexts/authContext';
import { LayoutContextProvider } from './contexts/layoutContext';
import 'firebaseui/dist/firebaseui.css';
import './styles/index.css';
import './styles/firebaseui-styling.global.css';
// import * as serviceWorkerRegistration from './serviceWorkerRegistration';


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <ErrorBoundary FallbackComponent={errorPage} onError={logErrorToService}>
    <RemoteConfigProvider>
      <AuthProvider>
        <LayoutContextProvider>
          <React.StrictMode>
            <App />
          </React.StrictMode>
        </LayoutContextProvider>
      </AuthProvider>
    </RemoteConfigProvider >
  </ErrorBoundary >
);

reportWebVitals();


