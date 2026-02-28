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
import AdminClaims from './AdminClaims'; // Import the new component
import './App.css'; // Ensure your CSS is imported

const Layout = ({ children }) => {
  const location = useLocation();
  const hideNavbar = location.pathname === '/' || location.pathname === '/login';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {!hideNavbar && <Navbar />}
      <main 
        className="main-content"
        style={{ 
          flexGrow: 1, 
          // Uses the CSS variables from App.css for perfect alignment
          marginLeft: hideNavbar ? '0' : 'var(--sidebar-desktop-width)', 
          padding: '20px',
          transition: 'all 0.3s ease',
          // Adds space at the bottom on mobile so content isn't covered by the bottom nav
          marginBottom: hideNavbar ? '0' : 'var(--nav-mobile-height)' 
        }}
      >
        {children}
      </main>
    </div>
  );
};

const getStoredUser = () => {
  const raw = localStorage.getItem('user');
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch (err) {
    return null;
  }
};

const isAdminUser = (user) => {
  if (!user) return false;
  const email = String(user.email || '').toLowerCase();
  return user.role === 'admin' || email === 'ephraimtessema@gmail.com';
};

const AdminRoute = ({ children }) => {
  const user = getStoredUser();
  if (!isAdminUser(user)) {
    return <Navigate to="/home" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <div className="App">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
        <Layout>
          <Routes>
            <Route path="/" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/report" element={<ReportItem />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/admin" element={<AdminRoute><AdminClaims /></AdminRoute>} />
            <Route path="/admin/claims" element={<AdminRoute><AdminClaims /></AdminRoute>} />
            <Route path="/item/:id" element={<ItemDetails />} />
          </Routes>
        </Layout>
      </div>
    </Router>
  );
}

export default App;