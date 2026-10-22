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

const ProductGallery = React.lazy(() => import("../components/ProductGallery"));
const ProductInfo = React.lazy(() => import("../components/ProductInfo"));
const SkeletonProductDetails = React.lazy(() => import("../components/SkeletonProductDetails"));

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [storeProducts, setStoreProducts] = useState([]);
  const [storeCategories, setStoreCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [isMobile, setIsMobile] = useState(false);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageTitle, setSelectedImageTitle] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [fetchTrigger, setFetchTrigger] = useState(0);
  const [hideHeader, setHideHeader] = useState(false);
  const lastScrollYRef = useRef(0);

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
    async function getFullProductData() {
      try {
        setIsLoading(true);
        
        let productData = null;
        try {
          const productRes = await api.get(`/products/${id}/`);
          productData = productRes.data;
        } catch (err) {
          console.error("❌ [Fetch 1] Imeshindwa:", err.message);
          setProduct(null);
          setIsLoading(false);
          return; 
        }
        
        if (!productData) {
          setProduct(null);
          setIsLoading(false);
          return;
        }

        const fetchPromises = [];

        let sList = [];
        if (productData?.store_id) {
          fetchPromises.push(
            api.get(`/products/?store_id=${productData.store_id}`)
              .then(res => {
                sList = (res.data.results || res.data || []).filter(p => p.id !== id);
                return sList;
              })
              .catch(() => [])
          );
        }

        let storeData = null;
        if (productData.store_id) {
          fetchPromises.push(
            api.get(`/stores/${productData.store_id}/`)
              .then(res => {
                storeData = res.data;
                return storeData;
              })
              .catch(() => null)
          );
        }

        let mediaData = [];
        fetchPromises.push(
          api.get(`/product-media/?product_id=${id}`)
            .then(res => {
              mediaData = res.data.results || res.data || [];
              return mediaData;
            })
            .catch(() => [])
        );

        await Promise.all(fetchPromises);

        setStoreProducts(sList.slice(0, 10));
        if (sList.length > 0) {
          const uniqueCats = [...new Set(sList.map(p => p.sub_category_name).filter(Boolean))];
          setStoreCategories(uniqueCats);
          setActiveCategory(productData.sub_category_name);
        }

        let variationsData = [];
        if (productData?.leaf_category_id) {
          try {
            const variationsRes = await api.get(`/products/?leaf_category_id=${productData.leaf_category_id}`);
            let vList = variationsRes.data.results || variationsRes.data || [];
            variationsData = vList.filter(p => p.id !== id).slice(0, 5);
          } catch (err) {}
        }

        setProduct({
          ...productData,
          stores: storeData,
          variations: variationsData || [],
          media_list: [
            { url: productData.cover_image, type: 'image' }, 
            ...(mediaData || []).map(m => ({ url: m.media_url, type: m.media_type })),
            productData.promo_video_url ? { url: productData.promo_video_url, type: 'video' } : null
          ].filter(Boolean)
        });

        try {
          if (productData?.id) {
            const recentlyViewed = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
            const filtered = recentlyViewed.filter(pId => pId !== productData.id);
            const updated = [productData.id, ...filtered].slice(0, 10);
            localStorage.setItem("recentlyViewed", JSON.stringify(updated));
          }
        } catch (err) {}

      } catch (err) {
        console.error("❌ [Main Catcher]:", err.message);
      } finally {
        setIsLoading(false);
      }
    }
    if (id) getFullProductData();
  }, [id, fetchTrigger]);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!product?.leaf_category_id) return;
      setLoadingRelated(true);
      try {
        const response = await api.get('/products/', {
          params: { leaf_category_id: product.leaf_category_id, ordering: '-views', limit: 8 }
        });
        const data = response.data.results || response.data || [];
        const filtered = data.filter(p => p.id !== product.id);
        setRelatedProducts(filtered.slice(0, 8));
      } catch (err) {
        setRelatedProducts([]);
      } finally {
        setLoadingRelated(false);
      }
    };
    if (product?.id) fetchRelatedProducts();
  }, [product?.id, product?.leaf_category_id]);

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

  const handleRateProduct = async (stars) => {
    const loadingToast = toast.loading("Tunahifadhi rating yako...");
    try {
      await api.post(`/products/${id}/rate/`, { rating: stars });
      toast.dismiss(loadingToast);
      toast.success(`Asante kwa rating ya nyota ${stars}!`);
      setProduct(prev => {
        const newTotal = (prev.total_reviews || 0) + 1;
        const newAverage = (((prev.average_rating || 0) * (prev.total_reviews || 0)) + stars) / newTotal;
        return { ...prev, total_reviews: newTotal, average_rating: newAverage };
      });
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

  if (isLoading) {
    return <SkeletonProductDetails isMobile={isMobile} />;
  }

  if (!product) {
    return <div className="text-center py-10 text-gray-500">Bidhaa haijapatikana.</div>;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col pt-0 md:pt-[100px]">
      
      <div className="md:fixed md:top-0 md:left-0 md:w-full md:z-[1000]">
            <Header showBack={true} /> 
      </div>

   <div className="w-full max-w-full mx-auto px-0 md:px-0 pb-24 md:pb-0">

        <main className="flex flex-col md:flex-row w-full items-start">
          
         {/* LEFT CONTENT (Gallery) */}
<div className="w-full md:w-[65%] md:sticky md:top-[100px] md:max-h-[calc(100vh-100px)] md:overflow-y-auto bg-white dark:bg-black md:border-r border-gray-200 dark:border-gray-800">
  
  {/* Section ya Gallery - Tumeongeza padding kwenye simu na rounded corners */}
  <section className="w-full bg-white dark:bg-black pt-3 md:pt-6 px-1 md:px-6">
    <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
      <Suspense fallback={<div className="p-10 text-center text-gray-500">Inapakia picha...</div>}>
        <ProductGallery product={product} isMobile={isMobile} />
      </Suspense>
    </div>
  </section>

  {/* Maelezo ya Bidhaa - Tumeongeza nafasi (margin) kati ya picha na maelezo */}
  <div className="mx-3 md:mx-6 my-4 p-4 md:p-5 bg-gray-50 dark:bg-[#0a0a0a] rounded-2xl border border-gray-100 dark:border-gray-800">
    <h3 className="text-lg font-bold mb-2 text-gray-800 dark:text-white">Maelezo ya Bidhaa</h3>
    <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
      <p>{product?.description || "Hakuna maelezo ya ziada kwa bidhaa hii."}</p>
    </div>
  </div>
  
</div>

          {/* RIGHT SIDEBAR (Product Info) */}
          <div className="w-full md:w-[35%] md:sticky md:top-[100px] md:max-h-[calc(100vh-100px)] md:overflow-y-auto bg-[#fafbfc] dark:bg-[#0a0a0a] border-l border-gray-200 dark:border-gray-800">
            <div className="px-4 py-4 md:px-6 md:py-6">
              <Suspense fallback={<div className="p-10 text-center text-gray-500">Inapakia maelezo...</div>}>
                <ProductInfo 
                  product={product} 
                  storeProducts={storeProducts} 
                  onRate={handleRateProduct} 
                  isMobile={isMobile} 
                />
              </Suspense>
            </div>
          </div>

        </main>

        {/* STORE DETAILS SECTION */}
        {product.stores ? (
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
          <div className="text-center py-4 text-sm text-gray-400 border-t border-gray-200 dark:border-gray-800 mt-8">(Taarifa za duka zinapakuliwa...)</div>
        )}

        {relatedProducts.length > 0 && (
          <RelatedProducts 
            relatedProducts={relatedProducts}
            leafCategoryId={product.leaf_category_id}
            loadingRelated={loadingRelated}
            navigate={navigate}
          />
        )}

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