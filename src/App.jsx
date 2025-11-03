import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login';
import Home from './pages/home';
import Upload from './pages/upload';
import Gallery from './pages/galary';
import PrivateRoute from './components/PrivateRoute';
import { ToastContainer } from 'react-toastify';
import { useAuth } from './auth/useAuth';

export default function App() {
  const { user } = useAuth();
  return (
    <>
      <main>
        <Routes>
          <Route 
            path="/login" 
            element={user ? <Navigate to="/home" replace /> : <Login />} 
          />

          {/* Protected routes - require authentication */}
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/home" element={<Home />} />
          </Route>

          {/* Catch all route - redirects to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      /> */}
    </>
  );
}
