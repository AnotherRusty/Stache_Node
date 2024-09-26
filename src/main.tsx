import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import SolanaWalletProvider from 'context/SolanaWalletProvider.tsx'
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SolanaWalletProvider>
      <ToastContainer />
      <App />
    </SolanaWalletProvider>
  </StrictMode>,
)
