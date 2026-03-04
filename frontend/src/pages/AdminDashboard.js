import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  // Helper to get admin config (email in header for middleware)
  const getAdminConfig = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return {
      headers: { 'x-user-email': user?.email || '' }
    };
  };

  const fetchData = async () => {
    try {
      // Note: Ensure these endpoints exist in your server.js or match your routes
      const [statsRes, itemsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/stats', getAdminConfig()),
        axios.get('http://localhost:5000/api/items', getAdminConfig())
      ]);
      setStats(statsRes.data);
      setItems(itemsRes.data);
      setLoading(false);
    } catch (err) {
      console.error('Admin fetch error:', err);
      setError('Could not load admin data. Ensure you are logged in as admin.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDecision = async (itemId, action) => {
    try {
      setUpdatingId(itemId);
      const status = action === 'approve' ? 'Approved' : 'Rejected';
      
      // Matching the PUT route in your server.js: /api/admin/claims/:id
      // We assume your items array contains the claim info
      await axios.put(`http://localhost:5000/api/admin/claims/${itemId}`, 
        { status }, 
        getAdminConfig()
      );

      alert(`Claim ${status} successfully.`);
      fetchData(); // Refresh list and stats
      setUpdatingId(null);
    } catch (err) {
      console.error('Decision error:', err);
      setUpdatingId(null);
      alert(err.response?.data?.message || 'Failed to update claim status.');
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading admin dashboard...</div>;
  if (error) return <div style={{ padding: '40px', textAlign: 'center', color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: '#003366', marginBottom: '20px' }}>Admin Dashboard</h1>

      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '15px', marginBottom: '30px' }}>
          <StatCard label="Total Items" value={stats.totalItems} />
          <StatCard label="Lost" value={stats.totalLost} />
          <StatCard label="Found" value={stats.totalFound} />
          <StatCard label="Claims Pending" value={stats.totalClaimPending} />
          <StatCard label="Claims Approved" value={stats.totalClaimApproved} />
        </div>
      )}

      <h2 style={{ marginBottom: '15px', color: '#003366' }}>Active Claims & Verification</h2>
      <div style={{ overflowX: 'auto', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', borderRadius: '10px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
          <thead style={{ background: '#003366', color: 'white' }}>
            <tr>
              <th style={thStyle}>Item Info</th>
              <th style={thStyle}>Claimant</th>
              <th style={thStyle}>Secret (Reporter)</th>
              <th style={thStyle}>Proof (Claimant)</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items
              .filter((it) => it.claimStatus && it.claimStatus !== 'none')
              .map((it) => (
                <tr key={it._id}>
                  <td style={tdStyle}>
                    <strong>{it.itemName}</strong> <br />
                    <span style={{ fontSize: '11px', color: '#777' }}>{it.location} ({it.type})</span>
                  </td>
                  <td style={tdStyle}>
                    {it.claimant?.username || 'User'} <br />
                    <span style={{ fontSize: '11px', color: '#555' }}>{it.claimant?.email}</span>
                  </td>
                  {/* --- THE COMPARISON COLUMNS --- */}
                  <td style={{ ...tdStyle, background: '#f0f7ff', color: '#003366', fontWeight: '500' }}>
                    {it.adminNote || <span style={{ color: '#aaa', fontStyle: 'italic' }}>No secret set</span>}
                  </td>
                  <td style={{ ...tdStyle, background: '#fff9e6', color: '#856404', fontWeight: '500' }}>
                    {it.verificationDetails || <span style={{ color: '#aaa', fontStyle: 'italic' }}>No proof sent</span>}
                  </td>
                  <td style={tdStyle}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      background: it.claimStatus === 'pending' ? '#fff3cd' : it.claimStatus === 'approved' ? '#d4edda' : '#f8d7da',
                      color: it.claimStatus === 'pending' ? '#856404' : it.claimStatus === 'approved' ? '#155724' : '#721c24'
                    }}>
                      {it.claimStatus.toUpperCase()}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <button
                        disabled={updatingId === it._id || it.claimStatus !== 'pending'}
                        onClick={() => handleDecision(it._id, 'approve')}
                        style={{ ...btnStyle, background: '#28a745' }}
                      >
                        Approve
                      </button>
                      <button
                        disabled={updatingId === it._id || it.claimStatus !== 'pending'}
                        onClick={() => handleDecision(it._id, 'reject')}
                        style={{ ...btnStyle, background: '#dc3545' }}
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const StatCard = ({ label, value }) => (
  <div style={{ background: 'white', padding: '14px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
    <div style={{ fontSize: '13px', color: '#666' }}>{label}</div>
    <div style={{ fontSize: '22px', fontWeight: '700', color: '#003366' }}>{value}</div>
  </div>
);

const thStyle = { padding: '12px 10px', textAlign: 'left', fontSize: '13px', borderBottom: '2px solid #ddd' };
const tdStyle = { padding: '12px 10px', borderBottom: '1px solid #eee', fontSize: '13px', verticalAlign: 'top' };
const btnStyle = { padding: '6px 10px', borderRadius: '6px', border: 'none', color: 'white', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' };

export default AdminDashboard;