// frontend/src/main.tsx

import React, { StrictMode } from 'react'; // Importamos StrictMode desde 'react'
import ReactDOM from 'react-dom/client'; // Importamos ReactDOM completo
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);