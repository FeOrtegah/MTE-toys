import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { CartProvider } from "./context/CartContext";
import { SearchProvider } from "./context/SearchContext";
import { UserProvider } from "./context/UserContext";

import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <CartProvider>
        <SearchProvider>
          <UserProvider>
            <App />
          </UserProvider>
        </SearchProvider>
      </CartProvider>
    </BrowserRouter>
  </StrictMode>,
)