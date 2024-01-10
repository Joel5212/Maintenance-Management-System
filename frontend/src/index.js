import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthContextProvider } from './context/AuthContext';
import { UsersContextProvider } from './context/UsersContext';
import { PrevRouteContextProvider } from './context/PrevRouteContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthContextProvider>
    <PrevRouteContextProvider>
      <App />
    </PrevRouteContextProvider>
  </AuthContextProvider>
)