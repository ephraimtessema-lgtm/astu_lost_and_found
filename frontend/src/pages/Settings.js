import React, { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

const Settings = () => {
    // Basic Dark Mode Toggle Logic
    const [darkMode, setDarkMode] = useState(
        localStorage.getItem('theme') === 'dark'
    );

    useEffect(() => {
        if (darkMode) {
            document.body.style.backgroundColor = '#1a1a1a';
            document.body.style.color = '#ffffff';
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.style.backgroundColor = '#f4f7f6';
            document.body.style.color = '#000000';
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    return (
        <div style={{ padding: '40px' }}>
            <h1 style={{ color: darkMode ? '#ffffff' : '#003366' }}>Settings</h1>
            <div style={{ 
                background: darkMode ? '#333' : 'white', 
                padding: '20px', 
                borderRadius: '12px',
                marginTop: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
            }}>
                <span>Appearance: <b>{darkMode ? 'Dark Mode' : 'Light Mode'}</b></span>
                <button 
                    onClick={() => setDarkMode(!darkMode)}
                    style={{
                        padding: '10px 20px',
                        borderRadius: '8px',
                        border: 'none',
                        background: darkMode ? '#FFD700' : '#003366',
                        color: darkMode ? '#003366' : 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                >
                    {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                    Switch Theme
                </button>
            </div>
        </div>
    );
};

export default Settings;