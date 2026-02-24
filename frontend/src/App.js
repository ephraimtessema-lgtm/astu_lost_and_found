import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import ReportItem from './pages/ReportItem';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main style={{ padding: '20px' }}>
          <Routes>
            {/* When the URL is /login, show the Login page */}
            <Route path="/login" element={<Login />} />
            
            {/* When the URL is /report, show the Report form */}
            <Route path="/report" element={<ReportItem />} />
            
            {/* Default page (Home) can be your Search/Feed later */}
            <Route path="/" element={<h1 style={{textAlign: 'center'}}>Welcome to ASTU Lost & Found</h1>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;