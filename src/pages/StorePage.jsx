import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../axiosConfig'; // 🔥 Badilisha: import api kutoka axiosConfig!
import Header from '../components/Header';
import Footer from '../components/Footer';
import { 
  Store, MapPin, Phone, Mail, Instagram, Globe, Clock, 
  Package, Zap, ShieldCheck, Star, Users, Truck, 
  ChevronLeft, Filter, Grid3x3, List, Search
} from 'lucide-react';
import '../StorePage.css';

export default function StorePage() { // 🔥 Imeondolewa { session }
  const { storeId } = useParams();
  const navigate = useNavigate();
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);
  
  // =======================================================
  // 🔥 MOBILE DETECTION
  // =======================================================
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth <= 768;
    }
    return false;
  });

  // =======================================================
  // 🔥 VIEW MODE
  // =======================================================
  const [viewMode, setViewMode] = useState('grid'); 

  // Detect mobile screen resize
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // =======================================================
  // 🔥 FETCH STORE DATA (Django API)
  // =======================================================
  useEffect(() => {
    const fetchStoreData = async () => {
      if (!storeId) return;
      
      setLoading(true);
      try {
        // 1. Pata taarifa za duka
        const storeRes = await api.get(`/stores/${storeId}/`);
        const storeData = storeRes.data;
        setStore(storeData);

        // 2. Pata bidhaa za duka hili (zilizothibitishwa)
        const productsRes = await api.get('/products/', {
          params: {
            store_id: storeId,
            is_approved: true,
            ordering: '-created_at'
          }
        });
        // DRF inarudisha { results: [...] } ikiwa pagination imewashwa
        const productsData = productsRes.data.results || productsRes.data || [];
        setProducts(productsData);
        setFilteredProducts(productsData);

        // 3. Pata kategoria za kipekee kutoka kwenye bidhaa
        if (productsData.length > 0) {
          // Tumia 'sub_category_name' au 'category_name' kulingana na serializer yako
          const uniqueCats = [...new Set(productsData.map(p => p.sub_category_name || p.category_name).filter(Boolean))];
          setCategories(uniqueCats);
        }

      } catch (error) {
        console.error('Error fetching store data:', error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreData();
  }, [storeId]);

  // =======================================================
  // 🔥 FILTER PRODUCTS
  // =======================================================
  useEffect(() => {
    let filtered = [...products];
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => (p.sub_category_name || p.category_name) === selectedCategory);
    }
    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, products]);

  const formatPrice = (price) => {
    return Number(price).toLocaleString();
  };

  if (loading) {
    return (
      <div className="store-page">
        <Header />
        <div className="store-loading">
          <div className="spinner"></div>
          <p>Inapakia taarifa za duka...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!store) {
    return (
      <div className="store-page">
        <Header />
        <div className="store-not-found">
          <Store size={64} color="#ccc" />
          <h2>Duka Halijapatikana</h2>
          <p>Duka unalotafuta halipo au limefutwa</p>
          <button onClick={() => navigate('/dashboard')} className="back-home-btn">
            Rudi Nyumbani
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="store-page">
      <Header />
      
      <div className="store-container">
        {/* Back Button */}
        <div className="store-back-btn" onClick={() => navigate(-1)}>
          <ChevronLeft size={20} />
          <span>Back</span>
        </div>

        {/* Store Header / Banner */}
        <div className="store-banner" style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url(${store.store_banner || 'https://placehold.co/1200x300'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: isMobile ? '16px' : '24px',
          padding: isMobile ? '30px 20px' : '50px 30px',
          marginBottom: '24px'
        }}>
          <div className="store-banner-content">
            <div className="store-logo-large">
              {store.store_logo ? (
                <img src={store.store_logo} alt={store.store_name} />
              ) : (
                <Store size={isMobile ? 40 : 50} color="#ff6a00" />
              )}
            </div>
            <div className="store-banner-info">
              <h1 className="store-name">{store.store_name}</h1>
              <div className="store-badge">
                {store.is_verified ? (
                  <>
                    <ShieldCheck size={16} color="#10b981" />
                    <span>Verified Seller</span>
                  </>
                ) : (
                  <span>Seller</span>
                )}
              </div>
              <div className="store-stats">
                <div className="stat">
                  <Package size={16} />
                  <span>{products.length} Products</span>
                </div>
                <div className="stat">
                  <Star size={16} />
                  <span>{store.average_rating || 0} Rating</span>
                </div>
                <div className="stat">
                  <Users size={16} />
                  <span>{store.total_sales || 0} Sales</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Store Info Cards */}
        <div className="store-info-grid">
          <div className="info-card">
            <h3><Store size={18} /> About Store</h3>
            <p>{store.description || 'No description available'}</p>
            <div className="info-details">
              {store.business_type && (
                <div className="detail-item">
                  <span className="detail-label">Business Type:</span>
                  <span className="detail-value">{store.business_type}</span>
                </div>
              )}
              {/* 🔥 Safe check: ikiwa established_year haipo, haionyeshi chochote */}
              {store?.established_year && (
                <div className="detail-item">
                  <span className="detail-label">Established:</span>
                  <span className="detail-value">{store.established_year}</span>
                </div>
              )}
            </div>
          </div>

          <div className="info-card">
            <h3><MapPin size={18} /> Contact & Location</h3>
            {store.physical_address && (
              <div className="contact-item">
                <MapPin size={16} color="#888" />
                <span>{store.physical_address}, {store.city || 'Tanzania'}</span>
              </div>
            )}
            {store.phone_number && (
              <a href={`tel:${store.phone_number}`} className="contact-item">
                <Phone size={16} color="#888" />
                <span>{store.phone_number}</span>
              </a>
            )}
            {store.email && (
              <a href={`mailto:${store.email}`} className="contact-item">
                <Mail size={16} color="#888" />
                <span>{store.email}</span>
              </a>
            )}
            {store.working_hours && (
              <div className="contact-item">
                <Clock size={16} color="#888" />
                <span>{store.working_hours}</span>
              </div>
            )}
          </div>

          {/* 🔥 Imeondolewa facebook_handle na kuongezwa twitter_handle & youtube_link! */}
          {(store.instagram_handle || store.tiktok_handle || store.twitter_handle || store.youtube_link) && (
            <div className="info-card">
              <h3><Globe size={18} /> Connect With Us</h3>
              <div className="social-links">
                {store.instagram_handle && (
                  <a href={`https://instagram.com/${store.instagram_handle.replace('@','')}`} target="_blank" rel="noreferrer" className="social-link instagram">
                    <Instagram size={18} /> Instagram
                  </a>
                )}
                {store.tiktok_handle && (
                  <a href={`https://tiktok.com/@${store.tiktok_handle.replace('@','')}`} target="_blank" rel="noreferrer" className="social-link tiktok">
                    <span className="tiktok-icon">🎵</span> TikTok
                  </a>
                )}
                {store.twitter_handle && (
                  <a href={`https://twitter.com/${store.twitter_handle.replace('@','')}`} target="_blank" rel="noreferrer" className="social-link twitter">
                    <span className="twitter-icon">🐦</span> Twitter / X
                  </a>
                )}
                {store.google_maps_url && (
                  <a href={store.google_maps_url} target="_blank" rel="noreferrer" className="social-link maps">
                    <MapPin size={18} /> Google Maps
                  </a>
                )}
                {store.youtube_link && (
                  <a href={store.youtube_link} target="_blank" rel="noreferrer" className="social-link youtube">
                    <span className="youtube-icon">▶️</span> YouTube
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Products Section */}
        <div className="store-products-section">
          <div className="products-header">
            <h2>All Products ({filteredProducts.length})</h2>
            
            <div className="products-controls">
              <div className="search-bar">
                <Search size={18} />
                <input 
                  type="text" 
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {categories.length > 0 && (
                <select 
                  className="category-filter"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              )}

              {/* View Toggle */}
              <div style={{ display: 'flex', gap: '5px' }}>
                <button 
                  style={{
                    padding: '8px',
                    borderRadius: '8px',
                    border: viewMode === 'grid' ? '1px solid #ff6a00' : '1px solid #ddd',
                    background: viewMode === 'grid' ? '#ff6a00' : 'white',
                    color: viewMode === 'grid' ? 'white' : '#333',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3x3 size={18} />
                </button>
                <button 
                  style={{
                    padding: '8px',
                    borderRadius: '8px',
                    border: viewMode === 'list' ? '1px solid #ff6a00' : '1px solid #ddd',
                    background: viewMode === 'list' ? '#ff6a00' : 'white',
                    color: viewMode === 'list' ? 'white' : '#333',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onClick={() => setViewMode('list')}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="no-products">
              <Package size={48} color="#ccc" />
              <p>Hakuna bidhaa zilizopatikana</p>
              {(searchTerm || selectedCategory !== 'all') && (
                <button onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }} className="clear-filters">
                  Clear Filters
                </button>
              )}
            </div>
          ) : viewMode === 'grid' ? (
            <div className="products-grid">
              {filteredProducts.map(product => (
                <div 
                  key={product.id} 
                  className="product-card"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <div className="product-image">
                    <img src={product.cover_image || 'https://placehold.co/300'} alt={product.name} />
                    {product.discount > 0 && (
                      <span className="discount-badge">-{product.discount}%</span>
                    )}
                  </div>
                  <div className="product-info">
                    <h4 className="product-name">{product.name}</h4>
                    <div className="product-price">
                      <span className="current-price">TSh {formatPrice(product.price)}</span>
                      {product.original_price && product.original_price > product.price && (
                        <span className="original-price">TSh {formatPrice(product.original_price)}</span>
                      )}
                    </div>
                    {product.stock_quantity > 0 ? (
                      <span className="stock-badge in-stock">In Stock ({product.stock_quantity})</span>
                    ) : (
                      <span className="stock-badge out-of-stock">Out of Stock</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="products-list">
              {filteredProducts.map(product => (
                <div 
                  key={product.id} 
                  className="product-list-item"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <img src={product.cover_image || 'https://placehold.co/80'} alt={product.name} />
                  <div className="product-list-info">
                    <h4>{product.name}</h4>
                    <p className="product-category">{product.sub_category_name || product.category_name || ''}</p>
                    <div className="product-price">
                      <span className="current-price">TSh {formatPrice(product.price)}</span>
                    </div>
                  </div>
                  <div className="product-list-action">
                    <button className="view-product-btn">View Details</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      {!isMobile && <Footer />}
    </div>
  );
}