import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, itemsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/stats'),
          axios.get('http://localhost:5000/api/items')
        ]);
        setStats(statsRes.data);
        setItems(itemsRes.data);
        setLoading(false);
      } catch (err) {
        console.error('Admin fetch error:', err);
        setError('Could not load admin data.');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDecision = async (id, action) => {
    try {
      setUpdatingId(id);
      await axios.post(`http://localhost:5000/api/items/${id}/claim/decision`, { action });
      const itemsRes = await axios.get('http://localhost:5000/api/items');
      setItems(itemsRes.data);
      const statsRes = await axios.get('http://localhost:5000/api/stats');
      setStats(statsRes.data);
      setUpdatingId(null);
    } catch (err) {
      console.error('Decision error:', err);
      setUpdatingId(null);
      alert('Failed to update claim status.');
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading admin dashboard...</div>;
  if (error) return <div style={{ padding: '40px', textAlign: 'center', color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '1100px', margin: '0 auto' }}>
      <h1 style={{ color: '#003366', marginBottom: '20px' }}>Admin Dashboard</h1>

      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '15px', marginBottom: '30px' }}>
          <StatCard label="Total Items" value={stats.totalItems} />
          <StatCard label="Lost" value={stats.totalLost} />
          <StatCard label="Found" value={stats.totalFound} />
          <StatCard label="Claims Pending" value={stats.totalClaimPending} />
          <StatCard label="Claims Approved" value={stats.totalClaimApproved} />
          <StatCard label="Claims Rejected" value={stats.totalClaimRejected} />
        </div>
      )}

      <h2 style={{ marginBottom: '10px', color: '#003366' }}>Claim Requests</h2>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '10px', overflow: 'hidden' }}>
          <thead style={{ background: '#003366', color: 'white' }}>
            <tr>
              <th style={thStyle}>Item</th>
              <th style={thStyle}>Type</th>
              <th style={thStyle}>Location</th>
              <th style={thStyle}>Claimant</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items
              .filter((it) => it.claimStatus && it.claimStatus !== 'none')
              .map((it) => (
                <tr key={it._id}>
                  <td style={tdStyle}>{it.itemName}</td>
                  <td style={tdStyle}>{it.type}</td>
                  <td style={tdStyle}>{it.location}</td>
                  <td style={tdStyle}>
                    {it.claimant?.username || 'Unknown'} <br />
                    <span style={{ fontSize: '12px', color: '#555' }}>{it.claimant?.email || ''}</span>
                  </td>
                  <td style={tdStyle} >
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      background:
                        it.claimStatus === 'pending' ? '#fff3cd' :
                        it.claimStatus === 'approved' ? '#d4edda' :
                        '#f8d7da',
                      color:
                        it.claimStatus === 'pending' ? '#856404' :
                        it.claimStatus === 'approved' ? '#155724' :
                        '#721c24'
                    }}>
                      {it.claimStatus.toUpperCase()}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <button
                      disabled={updatingId === it._id}
                      onClick={() => handleDecision(it._id, 'approve')}
                      style={{
                        padding: '6px 10px',
                        marginRight: '6px',
                        borderRadius: '6px',
                        border: 'none',
                        background: '#28a745',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '13px'
                      }}
                    >
                      Approve
                    </button>
                    <button
                      disabled={updatingId === it._id}
                      onClick={() => handleDecision(it._id, 'reject')}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '6px',
                        border: 'none',
                        background: '#dc3545',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '13px'
                      }}
                    >
                      Reject
                    </button>
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

const thStyle = { padding: '10px', textAlign: 'left', fontSize: '13px' };
const tdStyle = { padding: '10px', borderBottom: '1px solid #eee', fontSize: '13px' };

export default AdminDashboard;

