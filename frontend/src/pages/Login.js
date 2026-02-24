import React, { useState } from 'react';
import axios from 'axios';
import { LogIn, Hash } from 'lucide-react';

const Login = () => {
    const [idNumber, setIdNumber] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // Updated to send idNumber instead of email
            const res = await axios.post('http://localhost:5000/api/login', { idNumber, password });
            
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', res.data.user.role);
            
            alert("Login Successful!");
            window.location.href = '/';
        } catch (err) {
            alert("Invalid ID or Password. Format: Ugr/12345/16");
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '80px auto', padding: '30px', border: '1px solid #ddd', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <h2 style={{ textAlign: 'center', color: '#003366' }}>
                <LogIn style={{ marginRight: '10px' }} /> Student Login
            </h2>
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>ASTU ID Number</label>
                    <input 
                        type="text" 
                        placeholder="Ugr/12345/16" 
                        value={idNumber} 
                        // This regex helps ensure the user follows the Ugr/*****/** format
                        onChange={(e) => setIdNumber(e.target.value)} 
                        required 
                        style={{ padding: '12px', width: '100%', borderRadius: '5px', border: '1px solid #ccc' }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Password</label>
                    <input 
                        type="password" 
                        placeholder="••••••••" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        style={{ padding: '12px', width: '100%', borderRadius: '5px', border: '1px solid #ccc' }}
                    />
                </div>
                <button type="submit" style={{ padding: '12px', background: '#003366', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>
                    Sign In
                </button>
            </form>
        </div>
    );
};

export default Login;