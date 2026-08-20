// src/pages/StorePage.jsx
import { createPortal } from 'react-dom';
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../axiosConfig';
import Header from '../components/StoresHeader';
import Footer from '../components/Footer';
import { 
  Store, MapPin, Phone, Mail, Instagram, Globe, Clock, 
  Package, ShieldCheck, Star, Users, 
  ChevronLeft, Grid3x3, List, Search, X, ChevronRight
} from 'lucide-react';
import '../StorePage.css';

// ✅ BADILISHA: Tumia URL sahihi kutoka Backend, usijenge kwa mkono!
const getImageUrl = (url) => {
  if (!url) return null;
  // Backend tayari inatuma URL kamili za Cloudinary kwa fields zenye '_url'
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  // Kama siyo URL kamili (kwa products), jenga kwa Cloudinary
  const CLOUD_NAME = 'rlgqgsnv';
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${url}`;
};

export default function StorePage() {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); 

  // ========== STATE ZA LIGHTBOX (PORTAL) ==========
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxProductName, setLightboxProductName] = useState('');

  // =======================================================
  // 🔥 FETCH STORE DATA
  // =======================================================
  useEffect(() => {
    const fetchStoreData = async () => {
      if (!storeId) return;
      setLoading(true);
      try {
        const storeRes = await api.get(`/stores/${storeId}/`);
        const storeData = storeRes.data;
        setStore(storeData);
        console.log("✅ Store Data:", storeData);

        const productsRes = await api.get('/products/', {
          params: {
            store_id: storeId,
            ordering: '-created_at'
          }
        });

        const productsData = productsRes.data.results || productsRes.data || [];
        setProducts(productsData);
        setFilteredProducts(productsData);

        if (productsData.length > 0) {
          const uniqueCats = [...new Set(productsData.map(p => p.sub_category_name || p.category_name).filter(Boolean))];
          setCategories(uniqueCats);
        }
      } catch (error) {
        console.error('❌ Error fetching store data:', error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStoreData();
  }, [storeId]);

  // =======================================================
  // 🔥 FILTER PRODUCTS (Search & Category)
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

  // =======================================================
  // 🔥 FUNCTION: FUNGUA LIGHTBOX YA PICHA
  // =======================================================
  const openImageLightbox = (product, e) => {
    e.stopPropagation(); // Zuia navigate kwenye ProductDetails wakati wa kubonyeza picha

    // Jenga orodha ya picha
    let images = [];
    if (product.cover_image_url || product.cover_image) {
      images.push(product.cover_image_url || product.cover_image);
    }

    setLightboxImages(images);
    setLightboxIndex(0);
    setLightboxProductName(product.name);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => setIsLightboxOpen(false);
  const nextImage = () => setLightboxIndex((prev) => (prev + 1) % lightboxImages.length);
  const prevImage = () => setLightboxIndex((prev) => (prev - 1 + lightboxImages.length) % lightboxImages.length);

  // =======================================================
  // 🔥 LOADING STATE
  // =======================================================
  if (loading) {
    return (
      <div className="store-page">
        <Header />
        <div className="store-container skeleton-wrapper">
          {/* 1. Banner Skeleton */}
          <div className="store-banner skeleton-banner">
            <div className="store-banner-content skeleton-banner-content">
              <div className="store-logo-large">
                <div className="skeleton skeleton-circle-logo"></div>
              </div>
              <div className="store-banner-info">
                <div className="skeleton skeleton-banner-title"></div>
                <div className="skeleton skeleton-banner-subtitle"></div>
                <div className="store-stats skeleton-stats">
                  <div className="skeleton skeleton-stat"></div>
                  <div className="skeleton skeleton-stat"></div>
                  <div className="skeleton skeleton-stat"></div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Info Grid Skeleton */}
          <div className="store-info-grid">
            {[1, 2, 3].map((i) => (
              <div key={i} className="info-card skeleton-info-card">
                <div className="skeleton skeleton-info-title"></div>
                <div className="skeleton skeleton-info-text"></div>
                <div className="skeleton skeleton-info-text"></div>
                <div className="skeleton skeleton-info-text"></div>
              </div>
            ))}
          </div>

          {/* 3. Products Section Skeleton */}
          <div className="store-products-section">
            <div className="products-header skeleton-products-header">
              <div className="skeleton skeleton-products-title"></div>
              <div className="products-controls skeleton-products-controls">
                <div className="skeleton skeleton-search-control"></div>
                <div className="skeleton skeleton-filter-control"></div>
              </div>
            </div>

            <div className="products-grid">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="product-card skeleton-product-card">
                  <div className="skeleton skeleton-product-img"></div>
                  <div className="product-info skeleton-product-info-padding">
                    <div className="skeleton skeleton-product-name"></div>
                    <div className="skeleton skeleton-product-price"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // =======================================================
  // 🔥 STORE NOT FOUND
  // =======================================================
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

  // =======================================================
  // 🔥 RENDER STORE PAGE
  // =======================================================
  return (
    <div className="store-page">
      <Header />
      
      <div className="store-container">
        
        {/* Store Header / Banner */}
        <div 
          className="store-banner" 
          style={{
            backgroundImage: store.store_banner_url ? `url(${store.store_banner_url})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative'
          }}
        >
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(44, 62, 80, 0.85)',
            borderRadius: '16px'
          }}></div>

          <div className="store-banner-content" style={{ position: 'relative', zIndex: 2 }}>
            <div className="store-logo-large">
              {store.store_logo_url ? (
                <img 
                  src={store.store_logo_url} 
                  alt={store.store_name}
                  onError={(e) => { 
                    e.target.onerror = null; 
                    e.target.src = 'https://placehold.co/150x150?text=No+Logo'; 
                  }}
                />
              ) : (
                <Store color="#ff6a00" className="store-icon-fallback" />
              )}
            </div>
            <div className="store-banner-info">
              <h1 className="store-name">{store.store_name || 'Store Name'}</h1>
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

              <div className="view-toggle-group">
                <button 
                  className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3x3 size={18} />
                </button>
                <button 
                  className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
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
                    {/* ✅ PICHA INABONYEKA KUFUNGUA LIGHTBOX BILA KUHAMA UKURASA (GRID) */}
                    <div 
                      className="cursor-pointer relative"
                      onClick={(e) => openImageLightbox(product, e)}
                    >
                      <img 
                        src={product.cover_image_url || product.cover_image || 'https://placehold.co/300'} 
                        alt={product.name} 
                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/300?text=No+Img'; }} 
                      />
                      {product.discount > 0 && (
                        <span className="discount-badge">-{product.discount}%</span>
                      )}
                    </div>
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
                  {/* ✅ PICHA KWA LIST VIEW INABONYEKA KUFUNGUA LIGHTBOX PIA */}
                  <div 
                    className="cursor-pointer"
                    onClick={(e) => openImageLightbox(product, e)}
                  >
                    <img 
                      src={product.cover_image_url || product.cover_image || 'https://placehold.co/80'} 
                      alt={product.name} 
                      onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/80?text=No+Img'; }} 
                    />
                  </div>
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

      <Footer />

      {/* ===================================================== */}
      {/* ✅ LIGHTBOX PORTAL (IMEWEKWA MWISHONI KABISA)        */}
      {/* ===================================================== */}
      {isLightboxOpen && lightboxImages.length > 0 && createPortal(
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <div className="lightbox-content-wrapper" onClick={(e) => e.stopPropagation()}>
            
            <button onClick={closeLightbox} className="lightbox-close-btn">
              <X size={32} />
            </button>

            <h3 className="lightbox-product-title">{lightboxProductName}</h3>

            <div className="lightbox-image-container">
              <img 
                src={lightboxImages[lightboxIndex]} 
                alt="Zoomed view" 
                className="lightbox-image"
              />

              {lightboxImages.length > 1 && (
                <>
                  <button onClick={prevImage} className="lightbox-nav-btn left">
                    <ChevronLeft size={24} />
                  </button>
                  <button onClick={nextImage} className="lightbox-nav-btn right">
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </div>

            <div className="lightbox-counter">
              {lightboxIndex + 1} / {lightboxImages.length}
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}