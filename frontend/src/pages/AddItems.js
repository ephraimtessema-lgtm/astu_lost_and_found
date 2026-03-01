import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
<<<<<<< HEAD
import { Package } from 'lucide-react';
=======
>>>>>>> 292b2caf51289924137fc802ff434d360335eace

const AddItem = () => {
    const navigate = useNavigate();
    
    // --- STATE MANAGEMENT ---
    const [file, setFile] = useState(null); 
    const [type, setType] = useState('Lost');
    const [category, setCategory] = useState('');
    const [itemName, setItemName] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [contactNumber, setContactNumber] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
<<<<<<< HEAD
        // 1. Get user data from localStorage
        const userString = localStorage.getItem('user');
        if (!userString) {
            alert("Error: You must be logged in to report an item.");
            return;
        }
        
        // --- FIX: Added error handling for JSON parsing ---
        let user;
        try {
            user = JSON.parse(userString);
        } catch (error) {
            console.error("Error parsing user from localStorage", error);
            alert("Error: Invalid user session data. Please log in again.");
            localStorage.removeItem('user'); // Clear corrupted data
            return;
        }
        // ----------------------------------------------------
        
        // 2. Validate user ID exists to satisfy backend schema
        if (!user || !user.userId) {
            alert("Error: Invalid user session. Please log in again.");
            return;
        }

        // 3. Create FormData object for multipart/form-data
        const formData = new FormData();
        
        // 4. Append text fields
=======
        const formData = new FormData();
        
        // Append text fields
>>>>>>> 292b2caf51289924137fc802ff434d360335eace
        formData.append('type', type);
        formData.append('category', category);
        formData.append('itemName', itemName);
        formData.append('description', description);
        formData.append('location', location);
        formData.append('contactEmail', contactEmail);
        formData.append('contactNumber', contactNumber);
        
<<<<<<< HEAD
        // 5. Append the file
=======
        // Append the file
>>>>>>> 292b2caf51289924137fc802ff434d360335eace
        if (file) {
            formData.append('itemImage', file);
        }
        
<<<<<<< HEAD
        // 6. Structure data for backend validation (reportedBy)
        const reportedByData = {
            username: user.username,
            userId: user.userId
        };
        // Append as a JSON string to be parsed in server.js
        formData.append('reportedBy', JSON.stringify(reportedByData));

        try {
            // 7. Send request with multipart/form-data header
=======
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            formData.append('reportedBy', JSON.stringify({
                username: user.username,
                userId: user.userId
            }));
        }

        try {
>>>>>>> 292b2caf51289924137fc802ff434d360335eace
            await axios.post('http://localhost:5000/api/items', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert("Item reported successfully!");
            navigate('/home');
        } catch (err) {
<<<<<<< HEAD
            console.error("Report error:", err.response?.data || err.message);
            // Specifically show the backend validation message
            alert(err.response?.data?.message || "Failed to report item.");
=======
            console.error("Report error:", err);
            alert("Failed to report item.");
>>>>>>> 292b2caf51289924137fc802ff434d360335eace
        }
    };

    return (
<<<<<<< HEAD
        <div className="main-content" style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
            <div className="form-container" style={{ 
                background: 'white', 
                padding: '30px', 
                borderRadius: '20px', 
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                width: '100%',
                maxWidth: '450px'
            }}>
                <h2 style={{ textAlign: 'center', color: '#003366', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <Package /> Report Item
                </h2>
                
                <form onSubmit={handleSubmit} className="report-form" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    
                    <select 
                        value={type} 
                        onChange={(e) => setType(e.target.value)}
                        style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                    >
                        <option value="Lost">I Lost Something</option>
                        <option value="Found">I Found Something</option>
                    </select>

                    <input 
                        type="text" 
                        placeholder="Item Name (e.g. iPhone 13)" 
                        value={itemName}
                        onChange={(e) => setItemName(e.target.value)}
                        required
                        style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                    />

                    <input 
                        type="text" 
                        placeholder="Category (e.g. Electronics, Keys)" 
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                        style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                    />

                    <textarea 
                        placeholder="Description (Color, marks, etc.)" 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        rows="4"
                        style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', resize: 'none' }}
                    />

                    <input 
                        type="text" 
                        placeholder="Location (e.g. Library, Block 41)" 
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                        style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                    />
                    
                    <input 
                        type="email" 
                        placeholder="Contact Email (Optional)" 
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                    />
                    <input 
                        type="text" 
                        placeholder="Contact Number (Optional)" 
                        value={contactNumber}
                        onChange={(e) => setContactNumber(e.target.value)}
                        style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                    />

                    <div className="form-group">
                        <label style={{ fontSize: '0.9rem', color: '#666' }}>Upload Image (Optional):</label>
                        <input 
                            type="file" 
                            onChange={handleFileChange} 
                            accept="image/*" 
                            capture="environment"
                            style={{ marginTop: '5px' }}
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        className="submit-btn"
                        style={{ 
                            padding: '12px', 
                            background: '#003366', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '8px', 
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            marginTop: '10px'
                        }}
                    >
                        Submit Report
                    </button>
=======
        <div className="main-content">
            <div className="form-container">
                <h2>Report Item</h2>
                <form onSubmit={handleSubmit} className="report-form">
                    
                    {/* ... other input fields ... */}
                    <div className="form-group">
                        <label>Report Type:</label>
                        <select value={type} onChange={(e) => setType(e.target.value)}>
                            <option value="Lost">Lost</option>
                            <option value="Found">Found</option>
                        </select>
                    </div>
                 
                    <div className="form-group">
                        <label>Take Picture or Upload Image:</label>
                        <input type="file" onChange={handleFileChange} accept="image/*" capture="environment"/>
                    </div>
                      
                    
                    <button type="submit" className="submit-btn">Submit Report</button>
>>>>>>> 292b2caf51289924137fc802ff434d360335eace
                </form>
            </div>
        </div>
    );
};

export default AddItem;