import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
        
        const formData = new FormData();
        
        // Append text fields
        formData.append('type', type);
        formData.append('category', category);
        formData.append('itemName', itemName);
        formData.append('description', description);
        formData.append('location', location);
        formData.append('contactEmail', contactEmail);
        formData.append('contactNumber', contactNumber);
        
        // Append the file
        if (file) {
            formData.append('itemImage', file);
        }
        
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            formData.append('reportedBy', JSON.stringify({
                username: user.username,
                userId: user.userId
            }));
        }

        try {
            await axios.post('http://localhost:5000/api/items', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert("Item reported successfully!");
            navigate('/home');
        } catch (err) {
            console.error("Report error:", err);
            alert("Failed to report item.");
        }
    };

    return (
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
                </form>
            </div>
        </div>
    );
};

export default AddItem;