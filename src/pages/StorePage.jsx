// src/pages/StorePage.jsx
import { createPortal } from 'react-dom';
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../axiosConfig';
import Header from '../components/StoresHeader';
import Footer from '../components/Footer';
import { FaInstagram, FaTiktok, FaTwitter, FaYoutube } from 'react-icons/fa';
import { 
  Store, MapPin, Phone, Mail, Instagram, Globe, Clock, 
  Package, ShieldCheck, Star, Users, Eye, Pause, Play,
  ChevronLeft, Grid3x3, List, Search, X, ChevronRight, Zap 
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query'; // 1. Ingiza useQuery

// ==========================================
// 2. FUNCTION YA KUCHUKUA DATA (Duka + Bidhaa + Status kwa mpigo)
// ==========================================
const fetchStoreData = async ({ queryKey }) => {
  const [_, storeId] = queryKey;
  if (!storeId) throw new Error("Store ID haipo");

  // Tumia Promise.all kuchukua vitu vyote kwa mpigo
  const [storeRes, productsRes, statusesRes] = await Promise.all([
    api.get(`/stores/${storeId}/`),
    api.get('/products/', { params: { store_id: storeId, ordering: '-created_at' } }),
    api.get(`/store-statuses/?store_id=${storeId}`).catch(() => ({ data: [] })) // 🔥 Status fetch
  ]);

  const storeData = storeRes.data;
  const productsData = productsRes.data.results || productsRes.data || [];
  
  // 🔥 Chukua statuses (results au data moja kwa moja)
  const statusesData = statusesRes.data.results || statusesRes.data || [];

  // Panga categories
  let uniqueCats = [];
  if (productsData.length > 0) {
    uniqueCats = [...new Set(productsData.map(p => p.sub_category_name || p.category_name).filter(Boolean))];
  }

  return { 
    store: storeData, 
    products: productsData, 
    categories: uniqueCats,
    statuses: statusesData // 🔥 Ongeza hii
  };
};

export default function StorePage() {
  const { storeId } = useParams();
  const navigate = useNavigate();
  
  // ========== STATE ZA LOCAL (Filters na Lightbox) ==========
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); 

  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxProductName, setLightboxProductName] = useState('');
  const [lightboxProductList, setLightboxProductList] = useState([]);
  const [lightboxProductIndex, setLightboxProductIndex] = useState(0);
  const [lightboxProductId, setLightboxProductId] = useState(null);
    // ========== STATE ZA STATUS ==========
  const [isStatusPortalOpen, setIsStatusPortalOpen] = useState(false);
  const [viewingStatusIndex, setViewingStatusIndex] = useState(0);
  const [isStatusPaused, setIsStatusPaused] = useState(false);
// 🔥 State za muda
const [statusTimer, setStatusTimer] = useState(0); // Sekunde zilizopita


// 🔥 Reset timer kila status inapobadilika
useEffect(() => {
  setStatusTimer(0);
}, [viewingStatusIndex]);
  // =======================================================
  // 3. TUMIA useQuery
  // =======================================================
  const { 
    data: pageData, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['storePage', storeId],
    queryFn: fetchStoreData,
    enabled: !!storeId,
    staleTime: 1000 * 60 * 5, // Cache kwa dakika 5
  });

  const store = pageData?.store || null;
  const products = pageData?.products || [];
  const categories = pageData?.categories || [];

  // =======================================================
  // 4. FILTER PRODUCTS (Local Logic)
  // =======================================================
  const filteredProducts = useMemo(() => {
    let filtered = [...products];
    if (searchTerm) {
      filtered = filtered.filter(p => p.name?.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => (p.sub_category_name || p.category_name) === selectedCategory);
    }
    return filtered;
  }, [searchTerm, selectedCategory, products]);

  const formatPrice = (price) => Number(price).toLocaleString();

  // =======================================================
  // 5. LIGHTBOX FUNCTIONS
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


  // ========== STATUS FUNCTIONS ==========
  const openStatusPortal = () => {
    setIsStatusPortalOpen(true);
    setViewingStatusIndex(0);
    // 🔥 Ongeza view kwa status ya kwanza
    const firstStatus = pageData?.statuses?.[0];
    if (firstStatus) markStatusAsViewed(firstStatus.id);
  };

  const closeStatusPortal = () => {
    setIsStatusPortalOpen(false);
  };

  const nextStatus = () => {
    const statuses = pageData?.statuses || []; // 🔥 Badilisha store?.statuses kuwa pageData?.statuses
    if (statuses.length === 0) return;
    const nextIdx = (viewingStatusIndex + 1) % statuses.length;
    setViewingStatusIndex(nextIdx);
    markStatusAsViewed(statuses[nextIdx].id); // 🔥 Ongeza view
  };

  const prevStatus = () => {
    const statuses = pageData?.statuses || []; // 🔥 Badilisha
    if (statuses.length === 0) return;
    const prevIdx = (viewingStatusIndex - 1 + statuses.length) % statuses.length;
    setViewingStatusIndex(prevIdx);
    markStatusAsViewed(statuses[prevIdx].id); // 🔥 Ongeza view
  };

  // 🔥 ONGEZA HII FUNCTION MPYA
  const markStatusAsViewed = async (statusId) => {
    try {
      await api.post(`/store-statuses/${statusId}/increment-view/`);
    } catch (err) {
      console.error("Failed to increment view:", err);
    }
  };


  // 🔥 Ongeza hii karibu na state zingine
useEffect(() => {
  if (!isStatusPortalOpen) return;

  const timer = setTimeout(() => {
    const totalStatuses = pageData?.statuses?.length || 0;
    if (viewingStatusIndex < totalStatuses - 1) {
      setViewingStatusIndex(prev => prev + 1);
    } else {
      setIsStatusPortalOpen(false);
    }
  }, 5000); // Sekunde 5

  return () => clearTimeout(timer);
}, [isStatusPortalOpen, viewingStatusIndex, pageData?.statuses]);

// 🔥 Effect ya kuendesha muda
useEffect(() => {
  if (!isStatusPortalOpen || isStatusPaused) return;

  const interval = setInterval(() => {
    setStatusTimer((prev) => {
      if (prev >= 5) {
        // Muda umekwisha, nenda kwenye status inayofuata au funga
        const totalStatuses = pageData?.statuses?.length || 0;
        if (viewingStatusIndex < totalStatuses - 1) {
          setViewingStatusIndex((i) => i + 1);
        } else {
          setIsStatusPortalOpen(false);
        }
        return 0; // Reset timer
      }
      return prev + 0.1; // Ongeza sekunde 0.1 kila mara
    });
  }, 100); // Kila sekunde 0.1

  return () => clearInterval(interval);
}, [isStatusPortalOpen, isStatusPaused, viewingStatusIndex, pageData?.statuses]);


  // =======================================================
  // 6. RENDER (Loading & Error States)
  // =======================================================
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#1a1a2e] pt-0 md:pt-0 pb-10">
        <Header />
        <div className="max-w-[1200px] mx-auto p-4 skeleton-wrapper animate-pulse">
          <div className="w-full h-[200px] bg-gray-200 dark:bg-gray-700 rounded-2xl mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-[150px] bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="h-[250px] bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            ))}
          </div>
        </div>
        <div className='hidden md:block'><Footer /></div>
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#1a1a2e] ">
        <Header />
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <Store size={64} className="text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Store not found</h2>
          <p className="text-gray-500 mb-6">Store not found or check internet connection</p>
          <button onClick={() => navigate('/dashboard')} className="bg-brand-orange text-white px-6 py-2 rounded-lg font-bold hover:bg-brand-hover transition">
            Back Dashboard
          </button>
        </div>
        <div className='hidden md:block'><Footer /></div>
      </div>
    );
  }

  // =======================================================
  // 7. RENDER (Muonekano wako ule ule)
  // =======================================================
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1a1a2e] pt-0 pb-10 font-sans">
      <Header />
      
            <div className="lg:px-4 mx-auto px-1 mt-4 md:mt-4">
                

        
                {/* Store Header / Banner */}
        <div className="relative rounded-2xl p-4 md:p-10 mb-4 md:mb-6 overflow-hidden bg-gray-900">
          
          {/* 🔥 PICHA YA BACKGROUND (Inatumia <img> ili kuweka onError) */}
          <img 
            src={store.store_banner_url || 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80'} 
            alt="Store Banner" 
            className="absolute inset-0 w-full h-full object-cover z-0"
            onError={(e) => { 
              // 🔥 Kama picha ya Cloudinary ikishindwa (404), badilisha kuwa hii ya Unsplash
              e.target.src = 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80'; 
            }} 
          />

          {/* 🔥 DARK OVERLAY (Ili maandishi yasomeke vizuri) */}
          <div className="absolute inset-0 bg-black/60 z-0"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-3 md:gap-6">
            
            {/* Logo */}
            <div className="w-14 h-14 md:w-24 md:h-24 rounded-xl overflow-hidden bg-white shrink-0 shadow-lg">
              {store.store_logo_url ? (
                <img src={store.store_logo_url} alt={store.store_name} className="w-full h-full object-cover" onError={(e) => { e.target.src = 'https://placehold.co/150x150?text=No+Logo'; }} />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <Store className="text-brand-orange w-6 h-6 md:w-10 md:h-10" />
                </div>
              )}
            </div>

            <div className="text-center md:text-left text-white w-full">
              {/* 🔥 UKARIBISHO NA ANIMATION YA KUDONDOKA NENO KWA NENO */}
              <div className="mb-3 overflow-hidden w-full">
                <p className="text-2xl md:text-3xl text-gray-100 font-bold italic">
                  {"Welcome to our store, dear customer!".split(" ").map((word, index) => (
                    <span key={index} className="word-drop mr-2">
                      {word}
                    </span>
                  ))}
                </p>
              </div>

              {/* Jina la Duka */}
              <h1 className="text-xl md:text-3xl font-bold mb-1.5 md:mb-2 italic"> Shop with: {store.store_name || 'Store Name'}</h1>

              {/* Badge ya Verified */}
              <div className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[10px] md:text-sm mb-2 md:mb-3">
                {store.is_verified ? (
                  <><ShieldCheck size={12} className="text-green-400 md:w-4 md:h-4" /><span>Verified Seller</span></>
                ) : (
                  <span>Seller</span>
                )}
              </div>

              {/* Takwimu (Products, Rating, Sales) */}
              <div className="flex flex-wrap justify-center md:justify-start gap-2 md:gap-4 text-[11px] md:text-sm text-gray-200">
                <div className="flex items-center gap-1"><Package size={12} className="md:w-4 md:h-4" /><span>{products.length} Products</span></div>
                <div className="flex items-center gap-1"><Star size={12} className="md:w-4 md:h-4" /><span>{store.average_rating || 0} Rating</span></div>
                <div className="flex items-center gap-1"><Users size={12} className="md:w-4 md:h-4" /><span>{store.total_sales || 0} Sales</span></div>
              </div>
            </div>
          </div>
        </div>

                 {/* 🔥 STORE STATUS CARDS (UPDATES) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-6">
          
          {/* Kadi 1: Hali ya Duka */}
          <div className="bg-white dark:bg-[#2d2d44] p-3 md:p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-3 text-center md:text-left">
            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shrink-0 ${store.is_verified ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
              <ShieldCheck size={16} className="md:w-5 md:h-5" />
            </div>
            <div>
              <p className="text-[9px] md:text-[10px] text-gray-400 uppercase font-bold tracking-wider">Store Status</p>
              <p className={`text-xs md:text-sm font-bold ${store.is_verified ? 'text-green-600' : 'text-yellow-600'}`}>
                {store.is_verified ? 'Verified' : 'Pending'}
              </p>
            </div>
          </div>

          {/* Kadi 2: Muda wa Kufanya Kazi */}
          <div className="bg-white dark:bg-[#2d2d44] p-3 md:p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-3 text-center md:text-left">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <Clock size={16} className="md:w-5 md:h-5" />
            </div>
            <div>
              <p className="text-[9px] md:text-[10px] text-gray-400 uppercase font-bold tracking-wider">Working Hours</p>
              <p className="text-xs md:text-sm font-bold text-gray-800 dark:text-white truncate">
                {store.working_hours || 'N/A'}
              </p>
            </div>
          </div>

          {/* Kadi 3: Aina ya Biashara */}
          <div className="bg-white dark:bg-[#2d2d44] p-3 md:p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-3 text-center md:text-left">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
              <Store size={16} className="md:w-5 md:h-5" />
            </div>
            <div>
              <p className="text-[9px] md:text-[10px] text-gray-400 uppercase font-bold tracking-wider">Business Type</p>
              <p className="text-xs md:text-sm font-bold text-gray-800 dark:text-white leading-tight">
                {store.business_type || 'General'}
              </p>
            </div>
          </div>

          {/* Kadi 4: Updates / Ujumbe wa Haraka */}
          {/* Nimeondoa 'col-span-2' hapa ili ikae kwenye mstari mmoja na kadi ya tatu */}
          <div className="bg-brand-orange p-3 md:p-4 rounded-xl shadow-md flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-3 text-center md:text-left">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/20 text-white flex items-center justify-center shrink-0">
              <Zap size={16} className="md:w-5 md:h-5" />
            </div>
            <div>
              <p className="text-[9px] md:text-[10px] text-orange-100 uppercase font-bold tracking-wider">Latest Update</p>
              <p className="text-xs md:text-sm font-bold text-white truncate">
                New Arrivals!
              </p>
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

                    {/* Kadi ya Tatu: Connect With Us (REAL ICONS) */}
          {(store.instagram_handle || store.tiktok_handle || store.twitter_handle || store.youtube_link || store.google_maps_url) && (
            <div className="bg-white dark:bg-[#2d2d44] p-5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col">
              <h3 className="flex items-center gap-2 text-base font-bold text-gray-900 dark:text-white mb-4 pb-3 border-b border-gray-100 dark:border-gray-700">
                <Globe size={18} className="text-brand-orange" /> Connect With Us
              </h3>
              
              <div className="grid grid-cols-2 gap-2 mt-auto">
                {/* Instagram */}
                {store.instagram_handle && (
                  <a 
                    href={`https://instagram.com/${store.instagram_handle.replace('@','')}`} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="group flex flex-col items-center justify-center gap-2 p-3 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-pink-300 hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-all duration-300"
                  >
                    <div className="w-10 h-10 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FaInstagram size={20} />
                    </div>
                    <span className="text-[11px] font-semibold text-gray-600 dark:text-gray-300 group-hover:text-pink-600">Instagram</span>
                  </a>
                )}

                {/* TikTok */}
                {store.tiktok_handle && (
                  <a 
                    href={`https://tiktok.com/@${store.tiktok_handle.replace('@','')}`} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="group flex flex-col items-center justify-center gap-2 p-3 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all duration-300"
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FaTiktok size={20} />
                    </div>
                    <span className="text-[11px] font-semibold text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">TikTok</span>
                  </a>
                )}

                {/* Twitter / X */}
                {store.twitter_handle && (
                  <a 
                    href={`https://twitter.com/${store.twitter_handle.replace('@','')}`} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="group flex flex-col items-center justify-center gap-2 p-3 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FaTwitter size={20} />
                    </div>
                    <span className="text-[11px] font-semibold text-gray-600 dark:text-gray-300 group-hover:text-blue-500">Twitter</span>
                  </a>
                )}

                {/* YouTube */}
                {store.youtube_link && (
                  <a 
                    href={store.youtube_link} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="group flex flex-col items-center justify-center gap-2 p-3 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300"
                  >
                    <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FaYoutube size={20} />
                    </div>
                    <span className="text-[11px] font-semibold text-gray-600 dark:text-gray-300 group-hover:text-red-600">YouTube</span>
                  </a>
                )}

                {/* Google Maps */}
                {store.google_maps_url && (
                  <a 
                    href={store.google_maps_url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="group col-span-2 flex items-center justify-center gap-3 p-3 rounded-xl border border-orange-200 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-800 hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-all duration-300 mt-1"
                  >
                    <div className="w-8 h-8 rounded-full bg-orange-200 text-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <MapPin size={18} />
                    </div>
                    <div className="text-left">
                      <span className="block text-[10px] text-orange-500 font-bold uppercase tracking-wider">Find Us</span>
                      <span className="text-sm font-bold text-orange-700 dark:text-orange-400">Google Maps Location</span>
                    </div>
                    <ChevronRight size={16} className="text-orange-400 ml-auto group-hover:translate-x-1 transition-transform" />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Products Section */}
        <div className="bg-white dark:bg-[#2d2d44] rounded-2xl p-1 border border-gray-100 dark:border-gray-700 shadow-sm">
          
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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1 md:gap-4">
              {filteredProducts.map((product, index) => (
                <div 
                  key={product.id} 
                  /* 🔥 MABADILIKO: Tumeongeza 'p-2' (padding) na 'bg-white dark:bg-[#1a1a2e]' ili kadi ionekane vizuri */
                  className="group bg-white dark:bg-[#1a1a2e] p-2 rounded-2xl border border-gray-100 dark:border-gray-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  {/* 🔥 MABADILIKO: Tumeongeza 'rounded-xl' kwenye div ya picha ili pembe zionekane */}
                  <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-50 dark:bg-gray-800 mb-3">
                    <img 
                      src={product.cover_image_url || product.cover_image || 'https://placehold.co/300'} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { e.target.src = 'https://placehold.co/300?text=No+Img'; }} 
                      onClick={(e) => openImageLightbox(product, e, index)}
                    />
                    {product.discount > 0 && (
                      <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] md:text-xs font-bold px-2 py-1 rounded-md shadow-sm">-{product.discount}%</span>
                    )}
                  </div>

                  {/* 🔥 MABADILIKO: Maandishi yamepangwa vizuri zaidi (px-1) */}
                  <div className="px-1 pb-1">
                    <h4 className="text-[13px] md:text-sm font-semibold text-gray-800 dark:text-white truncate mb-1.5">{product.name}</h4>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[15px] md:text-base font-black text-brand-orange">TSh {formatPrice(product.price)}</span>
                      {product.original_price && product.original_price > product.price && (
                        <span className="text-[11px] text-gray-400 line-through">TSh {formatPrice(product.original_price)}</span>
                      )}
                    </div>

    
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
                    <h4 className="capitalize text-[13px] md:text-sm font-semibold text-gray-800 dark:text-white truncate mb-1.5">{product.name}</h4>
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

        {/* 🔥 KITUFE CHA STATUS (FLOATING KWA DESKTOP NA MOBILE) */}
        <div className="fixed bottom-6 right-4 md:bottom-8 md:right-8 z-[50]">
          <button 
            onClick={openStatusPortal}
            className="bg-brand-orange text-white p-2.5 md:p-5 rounded-full shadow-2xl flex items-center gap-1.5 md:gap-3 hover:scale-110 transition-transform animate-bounce border-2 md:border-4 border-white dark:border-gray-800"
          >
            <div className="relative">
              {/* Dot nyekundu inayowaka */}
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5 md:h-4 md:w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 md:h-4 md:w-4 bg-red-500"></span>
              </span>
              <Store size={16} className="md:w-8 md:h-8" />
            </div>
            <span className="text-[10px] md:text-base font-bold hidden md:block">Store Status</span>
            <span className="text-[10px] md:text-sm font-bold md:hidden">Status</span>
            
            {/* NAMBA YA STATUS */}
            <span className="bg-white text-brand-orange text-[9px] md:text-sm font-black px-1.5 py-0.5 md:px-3 md:py-1 rounded-full ml-0.5 md:ml-1">
              {pageData?.statuses?.length || 0}
            </span>
          </button>
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

        {/* 🔥 STATUS PORTAL (DIRISHA LA KUONA STATUS - WHATSAPP STYLE) */}
{isStatusPortalOpen && createPortal(
  <div className="fixed inset-0 bg-black z-[99999] flex items-center justify-center font-sans">
    
    {/* Kitufe cha Kufunga (X) kiko juu kulia */}
    <button 
      onClick={closeStatusPortal} 
      className="absolute top-4 right-4 md:top-6 md:right-6 bg-white/20 text-white p-2 rounded-full hover:bg-brand-orange transition z-50 shadow-lg"
    >
      <X size={24} />
    </button>

    {/* 🔥 KITUFE CHA STOP/PLAY (Kushoto Juu) */}
    <button 
      onClick={() => setIsStatusPaused(!isStatusPaused)} 
      className="absolute top-4 left-4 md:top-6 md:left-6 bg-white/20 text-white p-2 rounded-full hover:bg-brand-orange transition z-50 shadow-lg"
    >
      {isStatusPaused ? <Play size={24} /> : <Pause size={24} />}
    </button>

    {/* Kadi ya Status */}
    <div className="relative w-full h-full md:max-w-[400px] md:h-[85vh] bg-gray-900 md:rounded-2xl overflow-hidden flex flex-col">
      
      {/* 🔥 PROGRESS BARS */}
      <div className="absolute top-0 left-0 right-0 p-3 z-20 flex gap-1">
        {pageData?.statuses?.map((_, idx) => (
          <div key={idx} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-100"
              style={{
                width: idx < viewingStatusIndex ? '100%' : idx === viewingStatusIndex ? `${(statusTimer / 5) * 100}%` : '0%'
              }}
            />
          </div>
        ))}
      </div>

      {/* Header ya Status */}
      <div className="absolute top-6 left-0 right-0 p-3 z-10 flex items-center gap-3 bg-gradient-to-b from-black/60 to-transparent">
        <img 
          src={store.store_logo_url || 'https://placehold.co/40'} 
          alt="Store" 
          className="w-9 h-9 rounded-full border-2 border-white object-cover"
        />
        <div>
          <h4 className="text-white font-bold text-sm">{store.store_name}</h4>
          <p className="text-gray-300 text-[10px]">2 hours ago</p>
        </div>
      </div>

      {/* 🔥 MAUDHUI YA STATUS NA TOUCH AREAS */}
      <div className="flex-1 flex items-center justify-center bg-black relative overflow-hidden">
        {/* Background Blur (Kama WhatsApp) */}
        <img 
          src={pageData?.statuses?.[viewingStatusIndex]?.media_url} 
          className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-30" 
          alt=""
        />

        {/* Picha Halisi */}
        <img 
          src={pageData?.statuses?.[viewingStatusIndex]?.media_url || 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} 
          alt="Status" 
          className="relative w-full h-full object-contain z-10"
          onError={(e) => { 
            e.target.src = 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'; 
          }} 
        />
        
        {/* TOUCH AREAS */}
        <div className="absolute left-0 top-0 bottom-0 w-1/3 z-20 cursor-pointer" onClick={prevStatus} />
        <div className="absolute right-0 top-0 bottom-0 w-2/3 z-20 cursor-pointer" onClick={nextStatus} />

        {/* 🔥 CAPTION IMEWEKWA HAPA (Chini Kidogo ya Picha, Sio Chini Kabisa) */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent z-30">
          <p className="text-white text-sm font-medium leading-relaxed drop-shadow-md">
            {pageData?.statuses?.[viewingStatusIndex]?.caption || 'Karibu dukani kwetu! Tunayo ofa maalum ya bidhaa zetu mpya zilizowasili.'}
          </p>
        </div>
      </div>
    </div>
  </div>,
  document.body
)}

{/* 🔥 KEYFRAMES */}
<style>{`
  @keyframes statusProgress {
    from { width: 0%; }
    to { width: 100%; }
  }
`}</style>


    </div>
  );
}