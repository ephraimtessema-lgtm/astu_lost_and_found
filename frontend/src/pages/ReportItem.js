import React, { useState } from 'react';
import { Camera, Send } from 'lucide-react';

const ReportItem = () => {
    const [item, setItem] = useState({ title: '', category: 'ID Card', type: 'Lost', description: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Item Reported:", item);
        alert("Item submitted for Admin approval!");
    };

    return (
        <div style={{ maxWidth: '500px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', background: '#f9f9f9' }}>
            <h2 style={{ color: '#003366', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Camera /> Report Lost/Found Item
            </h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input type="text" placeholder="Item Name (e.g., TI-84 Calculator)" required 
                    onChange={(e) => setItem({...item, title: e.target.value})} style={{ padding: '10px' }} />
                
                <select onChange={(e) => setItem({...item, category: e.target.value})} style={{ padding: '10px' }}>
                    <option>ID Card</option>
                    <option>Calculator</option>
                    <option>USB Drive</option>
                    <option>Lab Coat</option>
                    <option>Book</option>
                </select>

                <div style={{ display: 'flex', gap: '20px' }}>
                    <label><input type="radio" name="type" value="Lost" checked={item.type === 'Lost'} onChange={() => setItem({...item, type: 'Lost'})} /> Lost</label>
                    <label><input type="radio" name="type" value="Found" onChange={() => setItem({...item, type: 'Found'})} /> Found</label>
                </div>

                <textarea placeholder="Description (Where did you lose/find it?)" rows="4" 
                    onChange={(e) => setItem({...item, description: e.target.value})} style={{ padding: '10px' }}></textarea>
                
                <button type="submit" style={{ padding: '12px', background: '#003366', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                    <Send size={18} /> Submit Report
                </button>
            </form>
        </div>
    );
};

export default ReportItem;