import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, PlusCircle, Settings, LogOut, Menu, X, Bell, User, Sun, Moon, Camera, ShieldCheck } from 'lucide-react';

const getStoredUsername = () => {
    const rawUser = localStorage.getItem('user');
    if (!rawUser) return 'User';

    try {
        const parsed = JSON.parse(rawUser);
        if (typeof parsed === 'string') return parsed;
        if (parsed && typeof parsed === 'object' && parsed.username) return parsed.username;
    } catch (err) {
        return rawUser;
    }

    return rawUser;
};

const getStoredUserObject = () => {
    const rawUser = localStorage.getItem('user');
    if (!rawUser) return null;
    try {
        const parsed = JSON.parse(rawUser);
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

const Navbar = () => {
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activePanel, setActivePanel] = useState('');
    const [username, setUsername] = useState(getStoredUsername());
    const [profileImage, setProfileImage] = useState(localStorage.getItem('profileImage') || '');
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [notifications, setNotifications] = useState([]);
    const [isAdmin, setIsAdmin] = useState(() => isAdminUser(getStoredUserObject()));

    const firstLetter = (username || 'U').charAt(0).toUpperCase();

    const isActive = (path) => location.pathname === path;

    useEffect(() => {
        document.body.classList.toggle('dark-mode', theme === 'dark');
        localStorage.setItem('theme', theme);
    }, [theme]);

    useEffect(() => {
        if (isMenuOpen) {
            setUsername(getStoredUsername());
            setIsAdmin(isAdminUser(getStoredUserObject()));
        }
    }, [isMenuOpen]);

    useEffect(() => {
        const fetchActivities = async () => {
            if (!isMenuOpen) return;

            try {
                const res = await fetch('http://localhost:5000/api/items');
                const items = await res.json();
                const total = Array.isArray(items) ? items.length : 0;
                const lost = total ? items.filter((it) => it.type === 'Lost').length : 0;
                const found = total ? items.filter((it) => it.type === 'Found').length : 0;
                const latest = total ? items[0] : null;

                const activity = [
                    `There are currently ${total} reported items in the app.`,
                    `${lost} lost items and ${found} found items are active.`,
                    latest
                        ? `Latest report: ${latest.itemName} at ${latest.location}.`
                        : 'No item reports yet.'
                ];
                setNotifications(activity);
            } catch (err) {
                setNotifications(['Unable to load activity right now.']);
            }
        };

        fetchActivities();
    }, [isMenuOpen]);

    const togglePanel = (panelName) => {
        setActivePanel((prev) => (prev === panelName ? '' : panelName));
    };

    const handleProfileImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result;
            if (typeof result === 'string') {
                setProfileImage(result);
                localStorage.setItem('profileImage', result);
            }
        };
        reader.readAsDataURL(file);
    };

    return (
        <>
            {/* --- DESKTOP SIDEBAR --- */}
            <nav className="desktop-sidebar">
                <div className="sidebar-brand">ASTU LOST AND FOUND</div>
                <div className="nav-group">
                    <Link to="/home" className={`nav-link ${isActive('/home') ? 'active' : ''}`}>
                        <Home size={22} /> <span>Home</span>
                    </Link>
                    <Link to="/report" className={`nav-link ${isActive('/report') ? 'active' : ''}`}>
                        <PlusCircle size={22} /> <span>Report Item</span>
                    </Link>
                    {isAdmin && (
                        <Link to="/admin/claims" className={`nav-link ${isActive('/admin/claims') ? 'active' : ''}`}>
                            <ShieldCheck size={22} /> <span>Admin Claims</span>
                        </Link>
                    )}
                </div>
            </nav>

            {/* --- TOP RIGHT HAMBURGER --- */}
            <button className="menu-trigger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>

            {/* --- SLIDE DRAWER --- */}
            <div className={`side-drawer ${isMenuOpen ? 'open' : ''}`}>
                <div className="drawer-header">
                    <div
                        className={`avatar-large ${profileImage ? 'has-image' : ''}`}
                        style={profileImage ? { backgroundImage: `url(${profileImage})` } : {}}
                    >
                        {!profileImage ? firstLetter : ''}
                    </div>
                    <h3>{username}</h3>
                </div>
                <nav className="drawer-nav">
                    <button type="button" className="drawer-item drawer-toggle" onClick={() => togglePanel('profile')}>
                        <User size={20} /> <span>My Profile</span>
                    </button>
                    {activePanel === 'profile' && (
                        <div className="drawer-panel">
                            <label className="drawer-panel-label" htmlFor="profile-picture-input">
                                Change profile picture
                            </label>
                            <button
                                type="button"
                                className="profile-upload-btn"
                                onClick={() => document.getElementById('profile-picture-input')?.click()}
                            >
                                <Camera size={16} /> Choose image
                            </button>
                            <input
                                id="profile-picture-input"
                                className="profile-picture-input"
                                type="file"
                                accept="image/*"
                                onChange={handleProfileImageChange}
                            />
                        </div>
                    )}

                    <button type="button" className="drawer-item drawer-toggle" onClick={() => togglePanel('notifications')}>
                        <Bell size={20} /> <span>Notifications</span>
                    </button>
                    {activePanel === 'notifications' && (
                        <div className="drawer-panel">
                            <ul className="drawer-list">
                                {notifications.map((note, index) => (
                                    <li key={index}>{note}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {isAdmin && (
                        <Link to="/admin/claims" className="drawer-item" onClick={() => setIsMenuOpen(false)}>
                            <ShieldCheck size={20} /> <span>Admin Claims</span>
                        </Link>
                    )}

                    <button type="button" className="drawer-item drawer-toggle" onClick={() => togglePanel('settings')}>
                        <Settings size={20} /> <span>Settings</span>
                    </button>
                    {activePanel === 'settings' && (
                        <div className="drawer-panel">
                            <div className="theme-options">
                                <button
                                    type="button"
                                    className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
                                    onClick={() => setTheme('light')}
                                >
                                    <span>Light mode</span>
                                    <Sun size={16} />
                                </button>
                                <button
                                    type="button"
                                    className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
                                    onClick={() => setTheme('dark')}
                                >
                                    <span>Dark mode</span>
                                    <Moon size={16} />
                                </button>
                            </div>
                        </div>
                    )}

                    <hr style={{margin: '15px 0', opacity: 0.2}} />
                    <button className="drawer-logout" onClick={() => { localStorage.clear(); window.location.href='/login'; }} 
                        style={{background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', display: 'flex', gap: '12px', padding: '12px', width: '100%'}}>
                        <LogOut size={20} /> <span>Logout</span>
                    </button>
                </nav>
            </div>

            {/* --- MOBILE BOTTOM BAR --- */}
            <nav className="mobile-bottom-nav">
                <Link to="/home" className={`nav-item ${isActive('/home') ? 'active' : ''}`}>
                    <Home size={24} />
                    <span>Home</span>
                </Link>
                <Link to="/report" className={`nav-item ${isActive('/report') ? 'active' : ''}`}>
                    <PlusCircle size={24} />
                    <span>Report</span>
                </Link>
            </nav>

            {isMenuOpen && <div className="menu-overlay" onClick={() => setIsMenuOpen(false)}></div>}
        </>
    );
};

export default Navbar;