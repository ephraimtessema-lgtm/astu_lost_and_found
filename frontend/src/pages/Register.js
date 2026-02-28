import React, { useState } from 'react';
import axios from 'axios';
import { UserPlus } from 'lucide-react';
import { toast } from 'react-toastify';

const Register = () => {
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '', 
        password: '',
        confirmPassword: ''
    });

    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());

    const handleRegister = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }
        if (!isValidEmail(formData.email)) {
            toast.error("Please enter a valid email address (example: name@gmail.com).");
            return;
        }

        try {
            await axios.post('http://localhost:5000/api/register', {
                username: formData.username,
                email: formData.email.trim(), // Trim spaces
                password: formData.password
            });
            setSuccess(true);
            toast.success("Account created successfully! Redirecting to login...");
            setTimeout(() => { window.location.href = '/login'; }, 2000);
        }
         catch (err) {
            toast.error(
                err.response?.data?.message ||
                "Registration failed. Try a different username or check your email."
            );
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
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '90vh' }}>
        
        {/* --- WELCOME MESSAGE --- */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h1 style={{ color: '#003366', fontSize: '2.5rem', margin: '0 0 10px 0' }}>
                Welcome to ASTU Lost and Found
            </h1>
            <p style={{ color: '#666', fontSize: '1.1rem' }}>
                The easiest way to recover your missing items.
            </p>
        </div>

        <div style={{ width: '100%', maxWidth: '380px', background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}>
            {success && (
                <div style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '10px', borderRadius: '8px', marginBottom: '15px', textAlign: 'center', fontWeight: 'bold' }}>
                    ✅ Account Created! Redirecting...
                </div>
            )}
            
            <h2 style={{ textAlign: 'center', color: '#003366', marginBottom: '20px' }}>
                <UserPlus size={24} style={{ verticalAlign: 'middle', marginRight: '8px' }} /> 
                Create Account
            </h2>

            <form onSubmit={handleRegister}>
                <input 
                    type="text" 
                    placeholder="Username" 
                    required 
                    style={inputStyle}
                    onChange={(e) => setFormData({...formData, username: e.target.value})} 
                />
                
                <input 
                    type="email" // Use email type for validation
                    placeholder="Email" 
                    required 
                    style={inputStyle}
                    onChange={(e) => setFormData({...formData, email: e.target.value})} 
                />
                
                <input 
                    type="password" 
                    placeholder="Password" 
                    required 
                    style={inputStyle}
                    onChange={(e) => setFormData({...formData, password: e.target.value})} 
                />
                
                <input 
                    type="password" 
                    placeholder="Confirm Password" 
                    required 
                    style={inputStyle}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} 
                />

                <button type="submit" style={{ width: '100%', padding: '12px', background: '#003366', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Sign Up
                </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#666' }}>
                Already have an account?{' '}
                <span 
                    onClick={() => window.location.href = '/login'} 
                    style={{ color: '#003366', fontWeight: 'bold', cursor: 'pointer' }}
                >
                    Login
                </span>
            </div>
        </div>
    </div>
);
};

export default Register;