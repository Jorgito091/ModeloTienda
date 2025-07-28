import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';  // Importa tu archivo de estilos aquí
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
