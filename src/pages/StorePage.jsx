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

// ✅ Badilisha URL sahihi kutoka Backend
const getImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
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

  // ========== STATE ZA LIGHTBOX ==========
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxProductName, setLightboxProductName] = useState('');
  const [lightboxProductList, setLightboxProductList] = useState([]);
  const [lightboxProductIndex, setLightboxProductIndex] = useState(0);
  const [lightboxProductId, setLightboxProductId] = useState(null);

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

        const productsRes = await api.get('/products/', {
          params: { store_id: storeId, ordering: '-created_at' }
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
  // 🔥 FILTER PRODUCTS
  // =======================================================
  useEffect(() => {
    let filtered = [...products];
    if (searchTerm) {
      filtered = filtered.filter(p => p.name?.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => (p.sub_category_name || p.category_name) === selectedCategory);
    }
    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, products]);

  const formatPrice = (price) => Number(price).toLocaleString();

  // =======================================================
  // 🔥 LIGHTBOX FUNCTIONS
  // =======================================================
  const openImageLightbox = (product, e, index) => {
    e.stopPropagation();
    setLightboxProductList(filteredProducts);
    setLightboxProductIndex(index);
    setLightboxProductId(product.id);
    let images = [];
    if (product.cover_image_url || product.cover_image) images.push(product.cover_image_url || product.cover_image);
    setLightboxImages(images);
    setLightboxIndex(0);
    setLightboxProductName(product.name);
    setIsLightboxOpen(true);
  };

  const goToNextProduct = () => {
    if (lightboxProductList.length === 0) return;
    const nextIndex = (lightboxProductIndex + 1) % lightboxProductList.length;
    setLightboxProductIndex(nextIndex);
    const nextProduct = lightboxProductList[nextIndex];
    setLightboxProductId(nextProduct.id);
    setLightboxProductName(nextProduct.name);
    setLightboxImages([nextProduct.cover_image_url || nextProduct.cover_image]);
    setLightboxIndex(0);
  };

  const goToPrevProduct = () => {
    if (lightboxProductList.length === 0) return;
    const prevIndex = (lightboxProductIndex - 1 + lightboxProductList.length) % lightboxProductList.length;
    setLightboxProductIndex(prevIndex);
    const prevProduct = lightboxProductList[prevIndex];
    setLightboxProductId(prevProduct.id);
    setLightboxProductName(prevProduct.name);
    setLightboxImages([prevProduct.cover_image_url || prevProduct.cover_image]);
    setLightboxIndex(0);
  };

  const closeLightbox = () => setIsLightboxOpen(false);

  // =======================================================
  // 🔥 LOADING STATE (SKELETON)
  // =======================================================
  if (loading) {
    return (
   <div className="min-h-screen bg-gray-50 dark:bg-[#1a1a2e] pt-0 md:pt-0 pb-10">
          <Header />
        <div className="max-w-[1200px] mx-auto p-4 skeleton-wrapper animate-pulse">
          {/* Banner Skeleton */}
          <div className="w-full h-[200px] bg-gray-200 dark:bg-gray-700 rounded-2xl mb-6"></div>
          {/* Info Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-[150px] bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            ))}
          </div>
          {/* Products Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="h-[250px] bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            ))}
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
      <div className="min-h-screen bg-gray-50 dark:bg-[#1a1a2e] pt-[70px] md:pt-[100px]">
        <Header />
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <Store size={64} className="text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Duka Halijapatikana</h2>
          <p className="text-gray-500 mb-6">Duka unalotafuta halipo au limefutwa</p>
          <button onClick={() => navigate('/dashboard')} className="bg-brand-orange text-white px-6 py-2 rounded-lg font-bold hover:bg-brand-hover transition">
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
<div className="min-h-screen bg-gray-50 dark:bg-[#1a1a2e] pt-0 pb-10">
      <Header />
      
      <div className="max-w-[1200px] mx-auto px-1  mt-4 md:mt-6">
        
        {/* Store Header / Banner */}
        <div 
          className="relative rounded-2xl p-6 md:p-10 mb-6 overflow-hidden bg-gray-800"
          style={{
            backgroundImage: store.store_banner_url ? `url(${store.store_banner_url})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-black/70"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden bg-white shrink-0">
              {store.store_logo_url ? (
                <img src={store.store_logo_url} alt={store.store_name} className="w-full h-full object-cover" onError={(e) => { e.target.src = 'https://placehold.co/150x150?text=No+Logo'; }} />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100"><Store className="text-brand-orange" size={40} /></div>
              )}
            </div>
            <div className="text-center md:text-left text-white">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{store.store_name || 'Store Name'}</h1>
              <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm mb-3">
                {store.is_verified ? (
                  <><ShieldCheck size={16} className="text-green-400" /><span>Verified Seller</span></>
                ) : (
                  <span>Seller</span>
                )}
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-200">
                <div className="flex items-center gap-1.5"><Package size={16} /><span>{products.length} Products</span></div>
                <div className="flex items-center gap-1.5"><Star size={16} /><span>{store.average_rating || 0} Rating</span></div>
                <div className="flex items-center gap-1.5"><Users size={16} /><span>{store.total_sales || 0} Sales</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* STORE GALLERY */}
        {(store?.office_image_1_url || store?.office_image_2_url || store?.office_image_3_url) && (
          <div className="bg-white dark:bg-[#2d2d44] rounded-2xl p-5 mb-6 border border-gray-100 dark:border-gray-700 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">📸 Store Showroom & Physical Location</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {store.office_image_1_url && (
                <img src={store.office_image_1_url} alt="Office 1" className="w-full h-[160px] object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform" />
              )}
              {store.office_image_2_url && (
                <img src={store.office_image_2_url} alt="Office 2" className="w-full h-[160px] object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform" />
              )}
              {store.office_image_3_url && (
                <img src={store.office_image_3_url} alt="Office 3" className="w-full h-[160px] object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform" />
              )}
            </div>
          </div>
        )}

        {/* Store Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          
          {/* About Store */}
          <div className="bg-white dark:bg-[#2d2d44] p-5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <h3 className="flex items-center gap-2 text-base font-bold text-gray-900 dark:text-white mb-4 pb-3 border-b border-gray-100 dark:border-gray-700">
              <Store size={18} className="text-brand-orange" /> About Store
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">{store.description || 'No description available'}</p>
            <div className="space-y-2 text-sm">
              {store.business_type && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Business Type:</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">{store.business_type}</span>
                </div>
              )}
              {store?.established_year && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Established:</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">{store.established_year}</span>
                </div>
              )}
            </div>
          </div>

          {/* Contact */}
          <div className="bg-white dark:bg-[#2d2d44] p-5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <h3 className="flex items-center gap-2 text-base font-bold text-gray-900 dark:text-white mb-4 pb-3 border-b border-gray-100 dark:border-gray-700">
              <MapPin size={18} className="text-brand-orange" /> Contact & Location
            </h3>
            <div className="space-y-3 text-sm">
              {store.physical_address && (
                <div className="flex items-start gap-3 text-gray-600 dark:text-gray-300"><MapPin size={16} className="mt-0.5 shrink-0" /><span>{store.physical_address}, {store.city || 'Tanzania'}</span></div>
              )}
              {store.phone_number && (
                <a href={`tel:${store.phone_number}`} className="flex items-center gap-3 text-gray-600 dark:text-gray-300 hover:text-brand-orange"><Phone size={16} className="shrink-0" /><span>{store.phone_number}</span></a>
              )}
              {store.email && (
                <a href={`mailto:${store.email}`} className="flex items-center gap-3 text-gray-600 dark:text-gray-300 hover:text-brand-orange"><Mail size={16} className="shrink-0" /><span>{store.email}</span></a>
              )}
              {store.working_hours && (
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300"><Clock size={16} className="shrink-0" /><span>{store.working_hours}</span></div>
              )}
            </div>
          </div>

          {/* Social */}
          {(store.instagram_handle || store.tiktok_handle || store.twitter_handle || store.youtube_link) && (
            <div className="bg-white dark:bg-[#2d2d44] p-5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <h3 className="flex items-center gap-2 text-base font-bold text-gray-900 dark:text-white mb-4 pb-3 border-b border-gray-100 dark:border-gray-700">
                <Globe size={18} className="text-brand-orange" /> Connect With Us
              </h3>
              <div className="flex flex-wrap gap-2">
                {store.instagram_handle && (
                  <a href={`https://instagram.com/${store.instagram_handle.replace('@','')}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-pink-50 text-pink-600 text-xs font-medium hover:bg-pink-100 transition"><Instagram size={14} /> Instagram</a>
                )}
                {store.tiktok_handle && (
                  <a href={`https://tiktok.com/@${store.tiktok_handle.replace('@','')}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-800 text-xs font-medium hover:bg-gray-200 transition"><span>🎵</span> TikTok</a>
                )}
                {store.twitter_handle && (
                  <a href={`https://twitter.com/${store.twitter_handle.replace('@','')}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-500 text-xs font-medium hover:bg-blue-100 transition"><span>🐦</span> Twitter</a>
                )}
                {store.youtube_link && (
                  <a href={store.youtube_link} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-medium hover:bg-red-100 transition"><span>▶️</span> YouTube</a>
                )}
                {store.google_maps_url && (
                  <a href={store.google_maps_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-50 text-orange-600 text-xs font-medium hover:bg-orange-100 transition"><MapPin size={14} /> Google Maps</a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Products Section */}
        <div className="bg-white dark:bg-[#2d2d44] rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">All Products ({filteredProducts.length})</h2>
            
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2 flex-1 md:flex-none">
                <Search size={18} className="text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent border-none outline-none ml-2 text-sm w-full md:w-48 text-gray-800 dark:text-white placeholder:text-gray-400"
                />
              </div>
              
              {categories.length > 0 && (
                <select 
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-800 dark:text-white outline-none"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              )}

              <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                <button 
                  className={`p-1.5 rounded-md transition ${viewMode === 'grid' ? 'bg-white dark:bg-gray-700 text-brand-orange shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3x3 size={18} />
                </button>
                <button 
                  className={`p-1.5 rounded-md transition ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 text-brand-orange shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                  onClick={() => setViewMode('list')}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Package size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-4">Hakuna bidhaa zilizopatikana</p>
              {(searchTerm || selectedCategory !== 'all') && (
                <button onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }} className="px-4 py-2 rounded-lg border border-brand-orange text-brand-orange font-medium hover:bg-orange-50 transition">
                  Clear Filters
                </button>
              )}
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredProducts.map((product, index) => (
                <div 
                  key={product.id} 
                  className="group bg-white dark:bg-[#1a1a2e] rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <div className="relative aspect-square overflow-hidden bg-gray-50 dark:bg-gray-800">
                    <img 
                      src={product.cover_image_url || product.cover_image || 'https://placehold.co/300'} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { e.target.src = 'https://placehold.co/300?text=No+Img'; }} 
                      onClick={(e) => openImageLightbox(product, e, index)}
                    />
                    {product.discount > 0 && (
                      <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">-{product.discount}%</span>
                    )}
                  </div>
                  <div className="p-3">
                    <h4 className="text-sm font-semibold text-gray-800 dark:text-white truncate mb-2">{product.name}</h4>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-base font-bold text-brand-orange">TSh {formatPrice(product.price)}</span>
                      {product.original_price && product.original_price > product.price && (
                        <span className="text-xs text-gray-400 line-through">TSh {formatPrice(product.original_price)}</span>
                      )}
                    </div>
                    {product.stock_quantity > 0 ? (
                      <span className="text-xs font-medium text-green-500">In Stock ({product.stock_quantity})</span>
                    ) : (
                      <span className="text-xs font-medium text-red-500">Out of Stock</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filteredProducts.map((product, index) => (
                <div 
                  key={product.id} 
                  className="flex items-center gap-4 bg-white dark:bg-[#1a1a2e] p-3 rounded-xl border border-gray-100 dark:border-gray-800 hover:shadow-md transition cursor-pointer"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <img 
                    src={product.cover_image_url || product.cover_image || 'https://placehold.co/80'} 
                    alt={product.name} 
                    className="w-20 h-20 object-cover rounded-lg shrink-0"
                    onError={(e) => { e.target.src = 'https://placehold.co/80?text=No+Img'; }} 
                    onClick={(e) => openImageLightbox(product, e, index)}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-semibold text-gray-800 dark:text-white truncate">{product.name}</h4>
                    <p className="text-xs text-gray-500 mb-1">{product.sub_category_name || product.category_name || ''}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-brand-orange">TSh {formatPrice(product.price)}</span>
                    </div>
                  </div>
                  <button className="bg-brand-orange text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-brand-hover transition shrink-0">View</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

  <div className="hidden md:block">
  <Footer />
</div>

      {/* LIGHTBOX PORTAL */}
      {isLightboxOpen && lightboxImages.length > 0 && createPortal(
        <div className="fixed inset-0 bg-black/90 z-[99999] flex justify-center items-center p-4" onClick={closeLightbox}>
          <div className="relative w-full max-w-[900px] max-h-[90vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            
            <button onClick={closeLightbox} className="absolute -top-12 right-0 md:top-0 md:right-0 bg-black/50 text-white p-2 rounded-full hover:bg-brand-orange transition z-10">
              <X size={32} />
            </button>

            <h3 className="text-white text-lg font-semibold mb-4 text-center">{lightboxProductName}</h3>

            <div className="relative w-full flex justify-center items-center bg-white/5 rounded-xl overflow-hidden">
              <img 
                src={lightboxImages[lightboxIndex]} 
                alt="Zoomed view" 
                className="max-w-full max-h-[75vh] object-contain block"
              />

              {lightboxProductList.length > 1 && (
                <>
                  <button onClick={goToPrevProduct} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 text-white p-2 rounded-full hover:bg-brand-orange transition"><ChevronLeft size={24} /></button>
                  <button onClick={goToNextProduct} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 text-white p-2 rounded-full hover:bg-brand-orange transition"><ChevronRight size={24} /></button>
                </>
              )}
            </div>

            <div className="mt-4 text-white text-sm bg-black/50 px-4 py-1.5 rounded-full">
              Bidhaa {lightboxProductIndex + 1} / {lightboxProductList.length}
            </div>

            <button 
              className="mt-4 bg-brand-orange text-white px-6 py-2.5 rounded-full font-bold shadow-lg hover:bg-brand-hover transition"
              onClick={() => { 
                closeLightbox(); 
                window.open(`/product/${lightboxProductId}`, '_blank'); 
              }}
            >
              View More
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}