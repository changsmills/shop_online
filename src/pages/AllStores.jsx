// src/pages/AllStores.jsx
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import StoreCard from '../components/StoreCard';
import { useLocation, useNavigate, useParams } from 'react-router-dom'; // ✅ Ongeza useParams
import api from '../axiosConfig'; // ✅ Supabase imeondolewa, sasa tumia api!
import '../AllStores.css';

export default function AllStores({ session }) {
  const { storeId } = useParams(); // ✅ Pata ID kutoka URL (/stores/:storeId)
  const [stores, setStores] = useState([]);
  const [singleStore, setSingleStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const selectedCategory = location.state?.selectedCategory;

  useEffect(() => {
    const fetchStoresData = async () => {
      setLoading(true);
      try {
        // ============================================================
        // 1. KAMA URL INA storeId (Pakia DUKA MOJA)
        // ============================================================
        if (storeId) {
          // Angalia kama data imehifadhiwa kwenye sessionStorage (kutoka TopStores)
          const cachedStore = sessionStorage.getItem('selectedStore');
          
          if (cachedStore) {
            const parsedStore = JSON.parse(cachedStore);
            // Hakikisha ID inalingana na URL
            if (String(parsedStore.id) === String(storeId)) {
              setSingleStore(parsedStore);
              setLoading(false);
              return;
            }
          }
          
          // Kama sessionStorage haina data, chukua kutoka API ya Django
          const response = await api.get(`/stores/${storeId}/`);
          setSingleStore(response.data);
          setLoading(false);
          return;
        }

        // ============================================================
        // 2. KAMA URL Haina storeId (Pakia MADUKA YOTE)
        // ============================================================
        const params = { status: 'active', limit: 50 };
        if (selectedCategory?.id) {
          params.category_id = selectedCategory.id;
        }
        const response = await api.get('/stores/', { params });
        
        // DRF inarudisha { results: [...] }, au array moja kwa moja
        const storesData = response.data.results || response.data || [];
        setStores(storesData);
        
      } catch (error) {
        console.error("Error fetching stores:", error.message);
        setStores([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStoresData();
  }, [storeId, selectedCategory]);

  // ============================================================
  // LOADING SKELETON
  // ============================================================
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

  // ============================================================
  // RENDER: KAMA NI DUKA MOJA (StoreId Ipo URL)
  // ============================================================
  if (singleStore) {
    return (
      <div className="all-stores-page">
        <Header />
        <div className="all-stores-container">
          {/* Header ya Duka Moja */}
          <div className="all-stores-header">
            <h1 className="all-stores-title">{singleStore.store_name}</h1>
            <p className="all-stores-subtitle">
              {singleStore.business_type} • {singleStore.city || 'Tanzania'}
            </p>
          </div>

          {/* Onyesha kadi ya duka hilo (au unaweza kuweka component yake maalum hapa) */}
          <div className="store-card-single-container">
            <StoreCard
              key={singleStore.id}
              store={singleStore}
              onClick={() => navigate(`/store/${singleStore.id}`)}
            />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // ============================================================
  // RENDER: KAMA NI MADUKA YOTE (All Stores List)
  // ============================================================
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