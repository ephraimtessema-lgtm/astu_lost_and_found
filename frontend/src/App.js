import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ReportItem from './pages/ReportItem';
import ItemDetails from './pages/ItemDetails';
import Settings from './pages/Settings'; 
import AdminClaims from './AdminClaims'; 
import './App.css';

// --- Helper Functions ---
const getStoredUser = () => {
  const raw = localStorage.getItem('user');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (err) {
    localStorage.removeItem('user'); // Clear corrupted data
    return null;
  }
};

const isAdminUser = (user) => {
  if (!user) return false;
  return user.role === 'admin' || user.email?.toLowerCase() === 'astulostandfound@gmail.com';
};

// --- Custom Route Wrappers ---
const AdminRoute = ({ children }) => {
  const user = getStoredUser();
  return isAdminUser(user) ? children : <Navigate to="/home" replace />;
};

const PrivateRoute = ({ children }) => {
  const user = getStoredUser();
  return user ? children : <Navigate to="/login" replace />;
};

const Layout = ({ children }) => {
  const location = useLocation();
  // Simplified logic: Hide navbar on Landing (Register) and Login pages
  const hideNavbar = ['/', '/login'].includes(location.pathname);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {!hideNavbar && <Navbar />}
      <main 
        className="main-content"
        style={{ 
          flexGrow: 1, 
          marginLeft: hideNavbar ? '0' : 'var(--sidebar-desktop-width, 240px)', 
          padding: '20px',
          transition: 'all 0.3s ease',
          marginBottom: hideNavbar ? '0' : 'var(--nav-mobile-height, 60px)' 
        }}
      >
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="App">
        <ToastContainer position="top-right" autoClose={3000} theme="colored" />
        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Register />} />
            <Route path="/login" element={<Login />} />

            {/* Protected User Routes */}
            <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
            <Route path="/report" element={<PrivateRoute><ReportItem /></PrivateRoute>} />
            <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
            <Route path="/item/:id" element={<PrivateRoute><ItemDetails /></PrivateRoute>} />

            {/* Protected Admin Routes */}
            <Route path="/admin" element={<AdminRoute><AdminClaims /></AdminRoute>} />
            <Route path="/admin/claims" element={<AdminRoute><AdminClaims /></AdminRoute>} />

            {/* Catch-all: Redirect unknown routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </div>
    </Router>
  );
}

export default App;