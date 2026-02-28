import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // --- 1. Import useNavigate ---
import { toast } from 'react-toastify'; // --- 2. Import toast for feedback ---
import { CheckCircle, XCircle } from 'lucide-react';

const AdminClaims = () => {
    const navigate = useNavigate(); // --- 3. Initialize navigate ---
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const isAdminUser = (user) => {
        if (!user) return false;
        const email = String(user.email || '').toLowerCase();
        return user.role === 'admin' || email === 'ephraimtessema@gmail.com';
    };

    // --- 4. Secure the Route & Fetch Data ---
    useEffect(() => {
        const userStr = localStorage.getItem('user');
        
        // Check if user is logged in
        if (!userStr) {
            toast.error("Please log in to access this page.");
            navigate('/login');
            return;
        }

        let user = null;
        try {
            user = JSON.parse(userStr);
        } catch (err) {
            toast.error("Session data is invalid. Please login again.");
            navigate('/login');
            return;
        }
        // Check if user is an admin
        if (!isAdminUser(user)) { 
            toast.error("Access denied. Admin only.");
            navigate('/home');
            return;
        }

        const fetchClaims = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/admin/claims', {
                    headers: { 'x-user-email': user.email || '' }
                });
                setClaims(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching claims:", err);
                setError("Failed to load claims.");
                setLoading(false);
            }
        };
        fetchClaims();
    }, [navigate]);

    // Handle Approve/Reject action
    const handleDecision = async (claimId, newStatus) => {
        try {
            const userStr = localStorage.getItem('user');
            const user = userStr ? JSON.parse(userStr) : null;
            await axios.put(
                `http://localhost:5000/api/admin/claims/${claimId}`,
                { status: newStatus },
                { headers: { 'x-user-email': user?.email || '' } }
            );
            
            // Update the UI locally
            setClaims(claims.map(claim => 
                claim._id === claimId ? { ...claim, status: newStatus } : claim
            ));
            
            // --- 5. Use toast instead of alert ---
            toast.success(`Claim ${newStatus} successfully.`);
        } catch (err) {
            console.error("Error updating claim:", err);
            toast.error("Failed to update claim status.");
        }
    };

    if (loading) return <div className="main-content">Loading claims...</div>;
    if (error) return <div className="main-content" style={{color: 'red'}}>{error}</div>;

    return (
        <div className="main-content">
            <h2>Manage Claim Requests</h2>
            <div className="claims-list">
                {claims.length === 0 && <p>No claim requests found.</p>}
                {claims.map(claim => (
                    <div key={claim._id} className="claim-card" style={{
                        border: '1px solid #ddd',
                        padding: '15px',
                        borderRadius: '8px',
                        marginBottom: '10px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        background: '#fff'
                    }}>
                        <div>
                            <h4>Item: {claim.itemName}</h4>
                            <p>Claimed by: {claim.claimerUsername} ({claim.claimerEmail})</p>
                            <p>Requested on: {new Date(claim.dateRequested).toLocaleDateString()}</p>
                            <p>
                                Status: 
                                <span style={{ 
                                    fontWeight: 'bold', 
                                    color: claim.status === 'Approved' ? 'green' : claim.status === 'Rejected' ? 'red' : 'orange',
                                    marginLeft: '5px'
                                }}>
                                    {claim.status}
                                </span>
                            </p>
                        </div>
                        
                        {claim.status === 'Pending' && (
                            <div className="actions">
                                <button 
                                    onClick={() => handleDecision(claim._id, 'Approved')}
                                    style={{ background: '#2ecc71', color: 'white', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer', marginRight: '10px' }}
                                >
                                    <CheckCircle size={20} /> Approve
                                </button>
                                <button 
                                    onClick={() => handleDecision(claim._id, 'Rejected')}
                                    style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer' }}
                                >
                                    <XCircle size={20} /> Reject
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminClaims;