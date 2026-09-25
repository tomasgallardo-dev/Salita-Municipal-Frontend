// main.tsx - Punto de entrada: monta React (StrictMode) con Bootstrap + BrowserRouter.
// Se conecta con: App y styles/tema.scss.

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/tema.scss';
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)