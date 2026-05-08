// pages/AllStores.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import Header from '../components/Header';
import Footer from '../components/Footer';
import StoreCard from '../components/StoreCard';
import { useLocation, useNavigate } from 'react-router-dom';
import { useIsMobile } from '../hooks/useIsMobile';

export default function AllStores({ session }) {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
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
        
        // Badilisha muundo wa data kuwa rahisi kwa StoreCard
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
      <div>
        <Header />
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '50vh' 
        }}>
          <div className="loading-dots">
            <div className="dot"></div>
            <div className="dot" style={{ animationDelay: '0.2s' }}></div>
            <div className="dot" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f7f8fa', minHeight: '100vh' }}>
      <Header />
      
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: isMobile ? '16px' : '6px' 
      }}>
        {/* Header */}
        <div style={{ 
          marginBottom: isMobile ? '16px' : '24px',
          paddingBottom: isMobile ? '8px' : '12px',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <h1 style={{ 
            fontSize: isMobile ? '20px' : '28px', 
            fontWeight: 'bold',
            margin: 0,
            color: '#1f2937'
          }}>
            All Stores
          </h1>
          <p style={{ 
            marginTop: '8px', 
            color: '#6b7280',
            fontSize: isMobile ? '12px' : '14px'
          }}>
            {selectedCategory ? `Stores in ${selectedCategory.name}` : 'All verified wholesale stores'}
          </p>
        </div>

        {/* Stores Grid - Tumia StoreCard */}
        {stores.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px',
            backgroundColor: 'white',
            borderRadius: '12px'
          }}>
            <p style={{ color: '#999' }}>No stores found</p>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: isMobile 
              ? 'repeat(2, 1fr)' 
              : 'repeat(auto-fill, minmax(160px, 200px))',
            gap: isMobile ? '12px' : '5px'
          }}>
            {stores.map(store => (
              <StoreCard
                key={store.id}
                store={store}
                isMobile={isMobile}
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