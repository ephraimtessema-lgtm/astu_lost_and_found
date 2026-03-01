import React, { useState } from 'react';
import axios from 'axios';
import { LogIn, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });

    const adminEmails = ['ephraimtessema@gmail.com'];

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // Send login request to backend
            const response = await axios.post('http://localhost:5000/api/login', loginData);
            
            // --- FIX: Ensure user data includes userId ---
            const computedRole = response.data.role || (adminEmails.includes(String(response.data.email).toLowerCase()) ? 'admin' : 'user');
            const userObject = {
                username: response.data.username,
                email: response.data.email,
                userId: response.data.userId, // <-- CRUCIAL FIX HERE
                role: computedRole
            };
            
            localStorage.setItem('user', JSON.stringify(userObject));
            localStorage.setItem('email', response.data.email);
            
            toast.success(`Welcome back, ${response.data.username}!`);
            
            // Redirect based on role
            if (computedRole === 'admin') {
                navigate('/admin/claims');
            } else {
                navigate('/home');
            }
        } catch (err) {
            console.error("Login error:", err);
            const message = err.response?.data?.message || "Invalid email or password";
            toast.error(message);
        }
    };

    const inputStyle = {
        padding: '12px',
        borderRadius: '8px',
        border: '1px solid #ddd',
        width: '100%',
        marginBottom: '15px',
        boxSizing: 'border-box'
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <div style={{ 
                width: '100%', 
                maxWidth: '380px', 
                background: 'white', 
                padding: '30px', 
                borderRadius: '15px', 
                boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                position: 'relative' 
            }}>
                
                {/* --- BACK BUTTON --- */}
                <div 
                    onClick={() => navigate('/')} 
                    style={{ 
                        position: 'absolute', 
                        top: '20px', 
                        left: '20px', 
                        cursor: 'pointer', 
                        color: '#666',
                        display: 'flex',
                        alignItems: 'center',
                        transition: 'color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#003366'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#666'}
                >
                    <ArrowLeft size={20} />
                </div>

                <h2 style={{ textAlign: 'center', color: '#003366', marginBottom: '25px' }}>
                    <LogIn size={24} style={{ verticalAlign: 'middle', marginRight: '10px' }} /> 
                    Student Login
                </h2>

                <form onSubmit={handleLogin}>
                    <label style={{ fontSize: '13px', color: '#666' }}>Email Address</label>
                    <input 
                        type="email" 
                        placeholder="Enter your email" 
                        required 
                        style={inputStyle}
                        onChange={(e) => setLoginData({...loginData, email: e.target.value})} 
                    />

                    <label style={{ fontSize: '13px', color: '#666' }}>Password</label>
                    <input 
                        type="password" 
                        placeholder="Enter your password" 
                        required 
                        style={inputStyle}
                        onChange={(e) => setLoginData({...loginData, password: e.target.value})} 
                    />

                    <button type="submit" style={{ 
                        width: '100%', 
                        padding: '12px', 
                        background: '#003366', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '8px', 
                        cursor: 'pointer', 
                        fontWeight: 'bold',
                        fontSize: '16px',
                        marginTop: '10px'
                    }}>
                        Sign In
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#666' }}>
                    Don't have an account?{' '}
                    <span 
                        onClick={() => navigate('/')} 
                        style={{ color: '#003366', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                        Create an account
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Login;