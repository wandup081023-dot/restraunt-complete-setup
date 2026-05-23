import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoadingSpinner from './components/LoadingSpinner';
import { CartProvider } from './utils/CartContext';
import { SettingsProvider } from './utils/SettingsContext';
import { Toaster } from './components/Toast';

const MenuPage = lazy(() => import('./pages/MenuPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));

export default function App() {
  return (
    <SettingsProvider>
      <CartProvider>
        <Router>
          <Toaster />
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/" element={<Navigate to="/menu" replace />} />
            </Routes>
          </Suspense>
        </Router>
      </CartProvider>
    </SettingsProvider>
  );
}