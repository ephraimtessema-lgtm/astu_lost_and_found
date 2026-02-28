import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify'; 
import { ArrowLeft, MapPin, Calendar, User, Phone, Tag, HandHelping } from 'lucide-react';

const ItemDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchItemDetail = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/items/${id}`);
                setItem(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Fetch single item error:", err);
                try {
                    const listRes = await axios.get('http://localhost:5000/api/items');
                    const found = listRes.data.find((it) => String(it._id) === String(id));
                    if (found) {
                        setItem(found);
                        setLoading(false);
                        return;
                    }
                    setError("Item not found.");
                } catch (listErr) {
                    console.error("Fallback list fetch error:", listErr);
                    setError("Could not load item details.");
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchItemDetail();
    }, [id]);

    const handleClaim = async () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
        toast.error("Please log in to claim items.");
        navigate('/login');
        return;
    }
    
    let username, email;

    // --- FIX: Correctly parse user data with fallback ---
    try {
        // Attempt to parse the string as a JSON object
        const user = JSON.parse(userStr);
        username = user.username;
        email = user.email;
    } catch (e) {
        // Fallback: If it was stored incorrectly as a raw string previously,
        // use the string directly and retrieve email from a separate key if necessary.
        console.warn("User data is not JSON formatted, parsing as plain string");
        username = userStr;
        email = localStorage.getItem('email') || '';
    }
    // ----------------------------------------------------

    try {
        await axios.post(`http://localhost:5000/api/items/${id}/claim`, { 
            username: username, 
            email: email 
        });
        
        toast.success("Claim request sent to Admin! Please wait for approval.");
        navigate('/home');
    } catch (err) {
        console.error("Claim request error:", err?.response || err);
        const backendMessage = err?.response?.data?.message || "Failed to submit claim request.";
        toast.error(backendMessage);
    }
};
    const hasApprovedClaim = item?.approvedClaim && item.approvedClaim.status === 'Approved';

    if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading details...</div>;
    if (error) return <div style={{ padding: '50px', color: 'red', textAlign: 'center' }}>{error}</div>;
    if (!item) return <div style={{ padding: '50px', textAlign: 'center' }}>Item not found.</div>;

    return (
        <div className="main-content">
            <div className="detail-container">
                <button className="back-button" onClick={() => navigate(-1)}>
                    <ArrowLeft size={20} /> Back
                </button>

                <div className="detail-card">
                    <div className="detail-header" style={{
                        borderLeft: `6px solid ${item.type === 'Lost' ? '#e74c3c' : '#2ecc71'}`
                    }}>
                        <span className={`type-tag ${item.type.toLowerCase()}`}>
                            {item.type.toUpperCase()}
                        </span>
                        <h1>{item.itemName}</h1>
                    </div>

                    <div className="detail-body">
                        <div className="detail-info">
                            
                            {item.imagePath && (
                                <img 
                                    src={`http://localhost:5000${item.imagePath}`} 
                                    alt={item.itemName} 
                                    style={{
                                        width: '100%',
                                        maxHeight: '400px',
                                        objectFit: 'contain',
                                        borderRadius: '10px',
                                        marginBottom: '20px',
                                        background: '#f9f9f9'
                                    }}
                                />
                            )}
                            
                            <p className="description">{item.description}</p>

                            {item.type === 'Found' && hasApprovedClaim && (
                                <div style={{ 
                                    margin: '15px 0', 
                                    padding: '10px 12px', 
                                    borderRadius: '8px',
                                    background: '#eafaf1',
                                    color: '#2e7d32',
                                    fontWeight: 600
                                }}>
                                    FOUND – contact the reporter to receive this item.
                                </div>
                            )}
                            
                            <div className="info-grid">
                                <div className="info-item">
                                    <MapPin size={18} />
                                    <span><strong>Location:</strong> {item.location}</span>
                                </div>
                                <div className="info-item">
                                    <Calendar size={18} />
                                    <span><strong>Date:</strong> {new Date(item.dateReported).toLocaleDateString()}</span>
                                </div>
                                <div className="info-item">
                                    <Tag size={18} />
                                    <span><strong>Category:</strong> {item.category}</span>
                                </div>
                            </div>
                        </div>

                        <div className="contact-section">
                            <h3>Reporter Info</h3>
                            <div className="contact-item">
                                <User size={18} /> {item.reportedBy?.username || 'Unknown'}
                            </div>
                            
                            <div className="contact-item">
                                <Phone size={18} />
                                {item.contactNumber ? (
                                    <a href={`tel:${item.contactNumber}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                                        {item.contactNumber}
                                    </a>
                                ) : (
                                    <span>No number provided</span>
                                )}
                            </div>
                            <div className="contact-item">
                                <span style={{ fontWeight: 600 }}>TG:</span>
                                {item.telegramUsername ? (
                                    <span>@{item.telegramUsername}</span>
                                ) : (
                                    <span>No Telegram provided</span>
                                )}
                            </div>
                            
                            {!hasApprovedClaim && (
                                <button 
                                    onClick={handleClaim} 
                                    className="claim-button"
                                    style={{
                                        width: '100%',
                                        marginTop: '20px',
                                        padding: '12px',
                                        background: '#003366',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontWeight: 'bold',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        gap: '10px'
                                    }}
                                >
                                    <HandHelping size={20}/>
                                    {item.type === 'Found' ? 'Claim This Item' : 'I Found This'}
                                </button>
                            )}

                            {hasApprovedClaim && (
                                <div style={{ 
                                    marginTop: '20px',
                                    padding: '10px 12px',
                                    borderRadius: '8px',
                                    background: '#fff8e1',
                                    color: '#8d6e63',
                                    fontSize: '14px'
                                }}>
                                    Claim approved – please use the reporter's contact information above to coordinate handover.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItemDetail;