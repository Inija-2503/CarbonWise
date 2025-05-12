import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './context/AuthContext'; // 👈 import your AuthContext

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider> {/* 👈 Provide auth context globally */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
