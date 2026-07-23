// src/pages/AllStores.jsx
import React, { useState, useEffect } from 'react';
//import { supabase } from '../supabaseClient';
import Header from '../components/Header';
import Footer from '../components/Footer';
import StoreCard from '../components/StoreCard';
import { useLocation, useNavigate } from 'react-router-dom';
import '../AllStores.css'; // ✅ ONGEZA HII

export default function AllStores({ session }) {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const selectedCategory = location.state?.selectedCategory;

  useEffect(() => {
    const fetchStores = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from('stores_engine')
          .select('*, categories:category_id(id, name)')
          .eq('status', 'active');
        
        if (selectedCategory?.id) {
          query = query.eq('category_id', selectedCategory.id);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        const formattedStores = (data || []).map(store => ({
          ...store,
          category_name: store.categories?.name
        }));
        
        setStores(formattedStores);
      } catch (error) {
        console.error("Error fetching stores:", error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStores();
  }, [selectedCategory]);

  if (loading) {
    return (
      <div className="all-stores-page">
        <Header />
        <div className="all-stores-loading-wrapper">
          <div className="all-stores-skeleton-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="all-stores-skeleton-card">
                <div className="all-stores-skeleton-image"></div>
                <div className="all-stores-skeleton-text"></div>
                <div className="all-stores-skeleton-text short"></div>
              </div>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="all-stores-page">
      <Header />
      
      <div className="all-stores-container">
        {/* Header */}
        <div className="all-stores-header">
          <h1 className="all-stores-title">All Stores</h1>
          <p className="all-stores-subtitle">
            {selectedCategory ? `Stores in ${selectedCategory.name}` : 'All verified wholesale stores'}
          </p>
        </div>

        {/* Stores Grid */}
        {stores.length === 0 ? (
          <div className="all-stores-empty">No stores found</div>
        ) : (
          <div className="all-stores-grid">
            {stores.map(store => (
              <StoreCard
                key={store.id}
                store={store}
                onClick={() => navigate(`/store/${store.id}`)}
              />
            ))}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}