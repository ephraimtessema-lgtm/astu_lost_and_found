import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search } from 'lucide-react'; 

const Home = () => {
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/items');
                setItems(res.data);
                setFilteredItems(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Fetch error:", err);
                setError("Could not connect to the server.");
                setLoading(false);
            }
        };
        fetchItems();
    }, []);

    useEffect(() => {
        let results = items;

        if (searchTerm) {
            results = results.filter(item =>
                item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (categoryFilter) {
            results = results.filter(item => item.category === categoryFilter);
        }

        if (locationFilter) {
            results = results.filter(item => item.location === locationFilter);
        }

        if (dateFilter) {
            results = results.filter(item => {
                if (!item.dateReported) return false;
                const d = new Date(item.dateReported);
                const iso = d.toISOString().split('T')[0];
                return iso === dateFilter;
            });
        }

        setFilteredItems(results);
    }, [searchTerm, categoryFilter, locationFilter,dateFilter, items]);

    if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading items...</div>;
    
    if (error) return <div style={{ padding: '50px', color: 'red', textAlign: 'center' }}>{error}</div>;

    return (
        <div style={{ padding: '20px 5%', width: '100%', maxWidth: '1200px' }}> {/* Container padding */}
            <h1 style={{ color: '#003366', marginBottom: '30px', textAlign: 'center' }}>Recently Reported Items</h1>
            
            <div className="search-filter-wrapper">
                <div className="search-bar">
                    <Search size={20} color="#666" />
                    <input 
                        type="text" 
                        placeholder="Search items..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <div className="filter-row">
                    <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                        <option value="">All Categories</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Documents">Documents</option>
                        <option value="Personal Items">Personal Items</option>
                    </select>
                    
                    <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}>
                        <option value="">All Locations</option>
                        <option value="Block A">Block A</option>
                        <option value="Library">Library</option>
                        <option value="Cafeteria">Cafeteria</option>
                    </select>

                    <input
                        type="date"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                    />
                </div>
            </div>
            
            {filteredItems.length === 0 ? (
                <p style={{textAlign: 'center', marginTop: '20px'}}>No items match your search.</p>
            ) : (
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
                    gap: '25px',
                    width: '100%' // Ensure grid takes full width
                }}>
                    {filteredItems.map(item => (
                        <div key={item._id} style={{ 
                            background: 'white', 
                            padding: '20px', 
                            borderRadius: '12px', 
                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)', 
                            borderTop: `6px solid ${item.type === 'Lost' ? '#e74c3c' : '#2ecc71'}`,
                            transition: 'transform 0.2s',
                            display: 'flex',       // Added for vertical centering
                            flexDirection: 'column' // Added for vertical centering
                        }}>
                            <span style={{ 
                                fontSize: '11px', 
                                fontWeight: 'bold', 
                                padding: '3px 8px', 
                                borderRadius: '4px',
                                background: item.type === 'Lost' ? '#fdecea' : '#eafaf1',
                                color: item.type === 'Lost' ? '#e74c3c' : '#2ecc71',
                                alignSelf: 'flex-start' // Keep tag on left
                            }}>
                                {item.type.toUpperCase()}
                            </span>
                            
                            <h3 style={{ margin: '15px 0 10px 0', color: '#2c3e50' }}>{item.itemName}</h3>
                            <p style={{ fontSize: '14px', color: '#7f8c8d', height: '40px', overflow: 'hidden' }}>
                                {item.description}
                            </p>
                            
                            <div style={{ 
                                fontSize: '13px', 
                                marginTop: '15px', 
                                color: '#003366', 
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px'
                            }}>
                                📍 {item.location}
                            </div>
                            
                            <button 
                                onClick={() => window.location.href = `/item/${item._id}`} // Correct ID usage
                                style={{
                                    marginTop: 'auto', // Pushes button to bottom
                                    width: '100%',
                                    padding: '10px',
                                    background: '#003366',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold'
                                }}
                            >
                                View Details
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Home;