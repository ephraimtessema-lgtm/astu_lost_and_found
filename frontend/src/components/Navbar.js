import React from 'react';
import { Link } from 'react-router-dom';
import { Search, PlusCircle, User, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const linkStyle = { display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', color: 'white', textDecoration: 'none' };

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: '#003366', color: 'white' }}>
      <Link to="/" style={{ color: 'white', textDecoration: 'none' }}><h2 style={{ margin: 0 }}>ASTU Lost & Found</h2></Link>
      <div style={{ display: 'flex', gap: '20px' }}>
        <Link to="/" style={linkStyle}><Search size={20}/> Search</Link>
        <Link to="/report" style={linkStyle}><PlusCircle size={20}/> Report Item</Link>
        <Link to="/admin" style={linkStyle}><LayoutDashboard size={20}/> Admin</Link>
        <Link to="/login" style={linkStyle}><User size={20}/> Login</Link>
      </div>
    </nav>
  );
};

export default Navbar;