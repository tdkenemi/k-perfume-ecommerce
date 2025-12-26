// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { OrderProvider } from './context/OrderContext'; // 1. Import
import { WishlistProvider } from './context/WishlistContext';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <AuthProvider>
      <CartProvider>
        <OrderProvider>
          <WishlistProvider>
            <App />
            </WishlistProvider> {/* 2. Bọc App */}
          
        </OrderProvider>
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>
  
);