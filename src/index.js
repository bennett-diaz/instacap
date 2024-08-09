import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// import reportWebVitals from './reportWebVitals';
// import { ErrorBoundary } from 'react-error-boundary'
// import { errorPage, logErrorToService } from './components/FallbackUI';
// import { RemoteConfigProvider } from './contexts/remoteConfigContext'
// import { AuthProvider } from './contexts/authContext';
// import { LayoutContextProvider } from './contexts/layoutContext';
// import 'firebaseui/dist/firebaseui.css';
// import './styles/index.css';
// import './styles/firebaseui-styling.global.css';
// import * as serviceWorkerRegistration from './serviceWorkerRegistration';


const root = ReactDOM.createRoot(document.getElementById('root'));

// root.render(
//   <ErrorBoundary FallbackComponent={errorPage} onError={logErrorToService}>
//     <RemoteConfigProvider>
//       <AuthProvider>
//         <LayoutContextProvider>
//           <React.StrictMode>
//             <App />
//           </React.StrictMode>
//         </LayoutContextProvider>
//       </AuthProvider>
//     </RemoteConfigProvider >
//   </ErrorBoundary >
// );

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();


