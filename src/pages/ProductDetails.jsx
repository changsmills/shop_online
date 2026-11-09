// src/components/ProductDetails.jsx
import React, { useState, useEffect, useRef, Suspense } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import RelatedProducts from "../components/RelatedProducts";
import api from "../axiosConfig";
import { toast } from 'react-hot-toast';
import { 
  Package, Zap, Clock, Factory, MapPin, Phone, Instagram, 
  ShieldCheck, Box, Video, FileText, Store, X, ChevronRight, Eye
} from 'lucide-react';

// 1. Ingiza TanStack Query
import { useQuery } from '@tanstack/react-query';

const ProductGallery = React.lazy(() => import("../components/ProductGallery"));
const ProductInfo = React.lazy(() => import("../components/ProductInfo"));

// 2. Function ya kuchukua data zote za bidhaa
const fetchProductDetails = async ({ queryKey }) => {
  const [_, id] = queryKey;

  // Ombi la kwanza kabisa: Pata bidhaa yenyewe
  const productRes = await api.get(`/products/${id}/`);
  const productData = productRes.data;
  if (!productData) throw new Error("Bidhaa haijapatikana");

  // Tunaandaa maombi mengine yote yafanyike kwa mpigo (Parallel)
  const fetchPromises = [];

  // Ombi la bidhaa za duka hili
  let storeProductsPromise = Promise.resolve([]);
  if (productData?.store_id) {
    storeProductsPromise = api.get(`/products/?store_id=${productData.store_id}`)
      .then(res => (res.data.results || res.data || []).filter(p => p.id !== id))
      .catch(() => []);
    fetchPromises.push(storeProductsPromise);
  }

  // Ombi la taarifa za duka
  let storeDataPromise = Promise.resolve(null);
  if (productData.store_id) {
    storeDataPromise = api.get(`/stores/${productData.store_id}/`)
      .then(res => res.data)
      .catch(() => null);
    fetchPromises.push(storeDataPromise);
  }

  // Ombi la media (picha/video)
  const mediaDataPromise = api.get(`/product-media/?product_id=${id}`)
    .then(res => res.data.results || res.data || [])
    .catch(() => []);
  fetchPromises.push(mediaDataPromise);

  // Ombi la variations (bidhaa zinazofanana kwenye leaf category)
  let variationsDataPromise = Promise.resolve([]);
  if (productData?.leaf_category_id) {
    variationsDataPromise = api.get(`/products/?leaf_category_id=${productData.leaf_category_id}`)
      .then(res => (res.data.results || res.data || []).filter(p => p.id !== id).slice(0, 5))
      .catch(() => []);
    fetchPromises.push(variationsDataPromise);
  }

  // Subiri maombi yote yamalize kwa mpigo
  await Promise.all(fetchPromises);

  const sList = await storeProductsPromise;
  const storeData = await storeDataPromise;
  const mediaData = await mediaDataPromise;
  const variationsData = await variationsDataPromise;

  // Hifadhi kwenye localStorage (recentlyViewed)
  try {
    if (productData?.id) {
      const recentlyViewed = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
      const filtered = recentlyViewed.filter(pId => pId !== productData.id);
      const updated = [productData.id, ...filtered].slice(0, 10);
      localStorage.setItem("recentlyViewed", JSON.stringify(updated));
    }
  } catch (err) {}

  // Rejesha data yote
  return {
    productData,
    storeProducts: sList.slice(0, 10),
    storeData,
    variationsData,
    mediaList: [
      { url: productData.cover_image, type: 'image' }, 
      ...(mediaData || []).map(m => ({ url: m.media_url, type: m.media_type })),
      productData.promo_video_url ? { url: productData.promo_video_url, type: 'video' } : null
    ].filter(Boolean)
  };
};

// 3. Function ya kuchukua related products
const fetchRelatedProducts = async ({ queryKey }) => {
  const [_, leafCategoryId, productId] = queryKey;
  if (!leafCategoryId) return [];
  
  const response = await api.get('/products/', {
    params: { leaf_category_id: leafCategoryId, ordering: '-views', limit: 8 }
  });
  const data = response.data.results || response.data || [];
  return data.filter(p => p.id !== productId).slice(0, 8);
};


export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isMobile, setIsMobile] = useState(false);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageTitle, setSelectedImageTitle] = useState("");
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [fetchTrigger, setFetchTrigger] = useState(0);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const galleryRef = useRef(null);
  const infoRef = useRef(null);
  const sentinelRef = useRef(null);

  // ==========================================
  // 4. TANSTACK QUERIES
  // ==========================================
  const { 
    data: mainData, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['productDetails', id, fetchTrigger],
    queryFn: fetchProductDetails,
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });

  const { data: relatedProducts = [], isLoading: loadingRelated } = useQuery({
    queryKey: ['relatedProducts', mainData?.productData?.leaf_category_id, id],
    queryFn: fetchRelatedProducts,
    enabled: !!mainData?.productData?.leaf_category_id,
    staleTime: 1000 * 60 * 5,
  });

  const product = mainData?.productData ? {
    ...mainData.productData,
    stores: mainData.storeData,
    variations: mainData.variationsData || [],
    media_list: mainData.mediaList
  } : null;

  const storeProducts = mainData?.storeProducts || [];
  const storeCategories = storeProducts.length > 0 
    ? [...new Set(storeProducts.map(p => p.sub_category_name).filter(Boolean))] 
    : [];
  const activeCategory = product?.sub_category_name || "all";

  // ==========================================
  // EFFECTS ZILIZOSALIA
  // ==========================================
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const incrementView = async () => {
      if (!id) return;
      const viewedProducts = JSON.parse(localStorage.getItem("viewed_products") || "[]");
      if (!viewedProducts.includes(id)) {
        const token = localStorage.getItem("access_token");
        if (!token) return;
        try {
          await api.post(`/products/${id}/increment_views/`);
          viewedProducts.push(id);
          localStorage.setItem("viewed_products", JSON.stringify(viewedProducts));
        } catch (error) {
          console.error("❌ [incrementView] Imeshindwa:", error.message);
        }
      }
    };
    incrementView();
  }, [id]);

  useEffect(() => {
    const handleOnline = () => { setIsOnline(true); setFetchTrigger(prev => prev + 1); };
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

useEffect(() => {
  const handleScroll = () => {
    const scrollTop = window.scrollY;
    
    if (scrollTop > lastScrollY && scrollTop > 50) {
      setShowHeader(false); // Ficha unaposcroll chini
    } else if (scrollTop < lastScrollY) {
      setShowHeader(true);  // Onyesha unaposcroll juu
    }
    
    setLastScrollY(scrollTop);
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
}, [lastScrollY]);

  // ==========================================
  // HANDLERS
  // ==========================================
  const handleRateProduct = async (stars) => {
    const loadingToast = toast.loading("Tunahifadhi rating yako...");
    try {
      await api.post(`/products/${id}/rate/`, { rating: stars });
      toast.dismiss(loadingToast);
      toast.success(`Asante kwa rating ya nyota ${stars}!`);
      refetch();
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error("Tatizo la mtandao limetokea.");
    }
  };

  const openImageViewer = (imageUrl, title) => {
    setSelectedImage(imageUrl);
    setSelectedImageTitle(title);
    setIsImageViewerOpen(true);
  };

  // 🔥 TUMEONDOA KIZUIZI CHA if (error || !product)
  // Tutatumia conditional kwenye kila sehemu

  if (error) {
    return <div className="text-center py-10 text-gray-500">Hitilafu imetokea: {error.message}</div>;
  }

  // ==========================================
  // RENDER (UI)
  // ==========================================
  return (

<div className="min-h-[100dvh] bg-[#fafbfc] dark:bg-[#0a0a0a] flex flex-col pt-0 md:pt-[100px] font-sans overflow-x-hidden">

  <div  className={`fixed top-0 left-0 w-full z-[1000] transition-transform duration-300 ${
           showHeader ? 'translate-y-0' : '-translate-y-full'
           }`}
              >
        <Header showBack={true} /> 
       </div>
       <div ref={sentinelRef} className="h-1 w-full bg-transparent" />

      <div className="w-full max-w-full mx-auto px-0 md:px-0 pb-24 md:pb-0">
        <main className="flex flex-col md:flex-row w-full items-start">
          
          {/* LEFT CONTENT (Gallery & Description) */}
          <div 
            ref={galleryRef}
            className="w-full md:w-[65%] md:sticky md:top-[100px] md:max-h-[calc(100vh-100px)] md:overflow-y-auto bg-white dark:bg-black md:border-r border-gray-200 dark:border-gray-800"
              >
            <section className="w-full bg-white dark:bg-black pt-3 md:pt-6 px-1 md:px-6">
              <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
                
                {/* 🔥 GALLERY SKELETON */}
                {isLoading || !product ? (
                  <div className="w-full aspect-square bg-gray-200 dark:bg-gray-800 animate-pulse flex items-center justify-center">
                    
                  </div>
                ) : (
                  <Suspense fallback={<div className="w-full aspect-square bg-gray-200 animate-pulse"></div>}>
                    <ProductGallery product={product} isMobile={isMobile} />
                  </Suspense>
                )}
              </div>
            </section>

            <div className="mx-3 md:mx-6 my-4 p-4 md:p-5 bg-gray-50 dark:bg-[#0a0a0a] rounded-2xl border border-gray-100 dark:border-gray-800">
              <h3 className="text-lg font-bold mb-2 text-gray-800 dark:text-white">Maelezo ya Bidhaa</h3>
              
              {/* 🔥 DESCRIPTION SKELETON */}
              {isLoading || !product ? (
                <div className="space-y-2">
                  <div className="w-full h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                  <div className="w-full h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                  <div className="w-2/3 h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                </div>
              ) : (
                <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  <p>{product?.description || "Hakuna maelezo ya ziada kwa bidhaa hii."}</p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SIDEBAR (Product Info) */}
          <div 
            ref={infoRef}
            className="w-full md:w-[35%] md:sticky md:top-[100px] md:max-h-[calc(100vh-100px)] md:overflow-y-auto bg-[#fafbfc] dark:bg-[#0a0a0a] border-l border-gray-200 dark:border-gray-800"
            >
            <div className="px-4 py-4 md:px-6 md:py-6">
              
              {/* 🔥 PRODUCT INFO SKELETON */}
              {isLoading || !product ? (
                <div className="space-y-4">
                  <div className="w-3/4 h-6 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                  <div className="w-1/2 h-5 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                  <div className="w-full h-24 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
                  <div className="w-full h-12 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
                </div>
              ) : (
                <Suspense fallback={<div className="p-10 text-center text-gray-500">Inapakia maelezo...</div>}>
                  <ProductInfo 
                    product={product} 
                    storeProducts={storeProducts} 
                    onRate={handleRateProduct} 
                    isMobile={isMobile} 
                  />
                </Suspense>
              )}
            </div>
          </div>
        </main>

        {/* ===== STORE DETAILS SECTION ===== */}
        
        {/* 🔥 STORE SKELETON (Kama Bado Inapakia) */}
        {isLoading || !product ? (
          <section className="bg-white dark:bg-black px-4 md:px-6 py-6 border-t border-gray-200 dark:border-gray-800">
            <div className="w-full h-32 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse mb-4"></div>
            <div className="w-full h-24 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"></div>
          </section>
        ) : product.stores ? (
          <section className="bg-white dark:bg-black px-4 md:px-6 py-6 border-t border-gray-200 dark:border-gray-800">
            <div className="bg-[#f8faff] dark:bg-[#0a0a0a] p-4 md:p-5 rounded-xl border-l-4 border-blue-500 mb-5">
              <div className="flex items-center gap-2 text-green-500 font-bold text-xs uppercase tracking-wide mb-1">
                <ShieldCheck size={20} />
                <span>Official Verified Store</span>
              </div>
              <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-1">Store Showroom & Verification</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Gundua bidhaa nyingine na uhakiki wa duka la <strong>{product.stores?.store_name}</strong>
              </p>
            </div>

            <div className="mb-5">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300">Bidhaa za Duka hili ({storeProducts.length})</h4>
                <Link to={`/store/${product.store_id}`} className="text-sm text-brand-orange font-semibold hover:underline">Ona zote →</Link>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                {storeProducts.map(item => (
                  <Link key={item.id} to={`/product/${item.id}`} className="flex-shrink-0 w-[100px] md:w-[120px] text-center"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                    <div className={`relative w-full aspect-square rounded-xl overflow-hidden border-2 ${item.id === id ? 'border-brand-orange' : 'border-gray-200 dark:border-gray-700'}`}>
                      <img src={item.cover_image_url} alt={item.name} className="w-full h-full object-cover" />
                      {item.id === id && (
                        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 bg-brand-orange text-white text-[8px] font-bold px-2 py-0.5 rounded whitespace-nowrap">INATAZAMWA</div>
                      )}
                    </div>
                    <p className="text-[10px] md:text-xs text-gray-700 dark:text-gray-300 mt-1.5 font-medium truncate">{item.name}</p>
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex flex-col">
              <div className="mb-4">
                {product.stores?.office_images?.length > 0 && (
                  <div className="relative rounded-xl overflow-hidden">
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1.5">
                      <MapPin size={14} /> Physical Location Verified
                    </div>
                    <img src={product.stores.office_images[0]} alt="Verified Office" className="w-full h-[180px] md:h-[280px] object-cover block" />
                  </div>
                )}
              </div>

              <div className="bg-white dark:bg-black pt-4 mt-4 border-t border-gray-200 dark:border-gray-800">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 pb-4 border-b border-gray-200 dark:border-gray-800">
                  <div>
                    <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white">{product.stores?.store_name}</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400">TIN: {product.stores?.tin_number}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">•</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{product.stores?.business_type}</span>
                    </div>
                  </div>
                  <Link 
                    to={`/store/${product.store_id}`} 
                    className="w-full md:w-auto text-center px-5 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-black rounded-lg text-sm font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                    onClick={(e) => {
                      if (window.innerWidth > 768) {
                        e.preventDefault();
                        window.open(`/store/${product.store_id}`, '_blank');
                      }
                    }}
                  >
                    Tembelea Duka
                  </Link>
                </div>

                {product.stores?.tin_image_url && (
                  <div className="mb-4 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-900 p-3">
                    <div className="flex items-center gap-2 mb-2 text-gray-700 dark:text-gray-300">
                      <FileText size={16} /> <span className="text-xs font-bold uppercase">Hati ya TIN (Verified)</span>
                    </div>
                    <img src={product.stores.tin_image_url} className="w-full h-auto max-h-[150px] object-contain rounded-lg" alt="TIN Certificate" />
                  </div>
                )}

                <div className="flex flex-wrap gap-3 my-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                  {product.stores?.google_maps_url && (
                    <a href={product.stores.google_maps_url} target="_blank" rel="noreferrer" className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm font-semibold text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                      <MapPin size={16} /> Google Maps
                    </a>
                  )}
                  {product.stores?.instagram_handle && (
                    <a href={`https://instagram.com/${product.stores.instagram_handle.replace('@','')}`} target="_blank" rel="noreferrer" className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm font-semibold text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                      <Instagram size={16} /> Instagram
                    </a>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 my-4">
                  {[
                    { icon: <Package size={18} />, label: 'MOQ', value: product.stores?.moq },
                    { icon: <Zap size={18} />, label: 'LEAD TIME', value: product.stores?.lead_time },
                    { icon: <Clock size={18} />, label: 'WORKING HOURS', value: product.stores?.working_hours },
                    { icon: <Factory size={18} />, label: 'CAPACITY', value: product.stores?.supply_capacity },
                    { icon: <Box size={18} />, label: 'PACKAGING', value: product.stores?.packaging_type }
                  ].map((stat, i) => (
                    <div key={i} className="bg-gray-50 dark:bg-gray-900 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                      <div className="text-gray-400 mb-1">{stat.icon}</div>
                      <span className="block text-[10px] text-gray-400 font-bold tracking-wide">{stat.label}</span>
                      <p className="text-sm font-bold text-gray-800 dark:text-gray-200 m-0">{stat.value || 'N/A'}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                  <div className="flex gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-orange-50 text-orange-600 dark:bg-orange-950 dark:text-orange-400"><MapPin size={20} /></div>
                    <div>
                      <span className="block text-[10px] font-bold text-gray-400 tracking-wide">OFFICE ADDRESS</span>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-0.5 leading-snug">{product.stores?.physical_address}, {product.stores?.city}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400"><Phone size={20} /></div>
                    <div>
                      <span className="block text-[10px] font-bold text-gray-400 tracking-wide">CONTACT US</span>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-0.5 leading-snug">{product.stores?.phone_number}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <div className="text-center py-4 text-sm text-gray-400 border-t border-gray-200 dark:border-gray-800 mt-8">(Taarifa za duka hazipo)</div>
        )}

        {/* ===== RELATED PRODUCTS ===== */}
        {loadingRelated ? (
          <div className="p-4 md:px-6">
            <div className="w-32 h-6 bg-gray-200 dark:bg-gray-800 rounded mb-4 animate-pulse"></div>
            <div className="flex gap-3 overflow-hidden">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-[130px] sm:w-[160px] shrink-0">
                  <div className="w-full aspect-square bg-gray-200 dark:bg-gray-800 rounded-xl mb-2 animate-pulse"></div>
                  <div className="w-3/4 h-4 bg-gray-200 dark:bg-gray-800 rounded mb-1 animate-pulse"></div>
                  <div className="w-1/2 h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        ) : relatedProducts.length > 0 ? (
          <RelatedProducts 
            relatedProducts={relatedProducts}
            leafCategoryId={product?.leaf_category_id}
            loadingRelated={loadingRelated}
            navigate={navigate}
          />
        ) : null}

      </div>

      {/* Footer (Imefichwa kwenye simu) */}
      <div className="hidden md:block">
        <Footer />
      </div>

      {/* Image Viewer Modal */}
      {isImageViewerOpen && selectedImage && (
        <div className="fixed inset-0 bg-black/95 z-[10000] flex items-center justify-center p-4" onClick={() => setIsImageViewerOpen(false)}>
          <div className="relative max-w-[90%] max-h-[90%]" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setIsImageViewerOpen(false)} className="absolute -top-10 right-0 bg-white/20 text-white w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/30 transition">
              <X size={20} />
            </button>
            <img src={selectedImage} alt={selectedImageTitle} className="max-w-full max-h-[85vh] object-contain rounded-lg" />
            {selectedImageTitle && (
              <div className="absolute -bottom-8 left-0 right-0 text-center text-sm text-white">{selectedImageTitle}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}