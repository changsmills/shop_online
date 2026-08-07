// src/components/ProductDetails.jsx
import React, { useState, useEffect, useRef, Suspense } from "react";
import { useParams, Link, useNavigate } from "react-router-dom"; // ✅ Ongeza useNavigate
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../ProductDetails.css";

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
  const navigate = useNavigate(); // ✅ Imeongezwa kwa ajili ya navigation
  const [product, setProduct] = useState(null);
  const [storeProducts, setStoreProducts] = useState([]);
  const [storeCategories, setStoreCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [isMobile, setIsMobile] = useState(false);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageTitle, setSelectedImageTitle] = useState("");
  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  // ========== RELATED PRODUCTS STATE ==========
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(false);

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
        try {
          await api.post(`/products/${id}/increment_views/`);
          viewedProducts.push(id);
          localStorage.setItem("viewed_products", JSON.stringify(viewedProducts));
        } catch (error) {
          console.error("❌ [incrementView] Imeshindwa kuongeza views kwa bidhaa:", id, error.message);
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
          console.log("✅ [Fetch 1] Product data imepatikana.");
        } catch (err) {
          console.error("❌ [Fetch 1] Imeshindwa kupata product kwa ID:", id, err.message);
          setProduct(null);
          setIsLoading(false);
          return; 
        }
        
        if (!productData) {
          setProduct(null);
          setIsLoading(false);
          return;
        }

        // ==========================================================
        // 🔥 BADILISHA HAPA: Tuma maombi yote yanayotegemea ID yake mara moja (Parallel)
        // ==========================================================
        const fetchPromises = [];

        // 1. Pata bidhaa za duka hili (Store Products)
        let sList = [];
        if (productData?.store_id) {
          fetchPromises.push(
            api.get(`/products/?store_id=${productData.store_id}`)
              .then(res => {
                sList = (res.data.results || res.data || []).filter(p => p.id !== id);
                return sList;
              })
              .catch(err => {
                console.error("❌ [Fetch Store Products] Error:", err.message);
                return [];
              })
          );
        }

        // 2. Pata maelezo ya duka (Store Data)
        let storeData = null;
        if (productData.store_id) {
          fetchPromises.push(
            api.get(`/stores/${productData.store_id}/`)
              .then(res => {
                storeData = res.data;
                return storeData;
              })
              .catch(err => {
                console.error("❌ [Fetch Store Info] Error:", err.message);
                return null;
              })
          );
        }

        // 3. Pata picha na video (Media)
        let mediaData = [];
        fetchPromises.push(
          api.get(`/product-media/?product_id=${id}`)
            .then(res => {
              mediaData = res.data.results || res.data || [];
              return mediaData;
            })
            .catch(err => {
              console.error("❌ [Fetch Media] Error:", err.message);
              return [];
            })
        );

        // ==========================================================
        // 🔥 Subiri yote yakamilike kwa wakati mmoja (Parallel)
        // ==========================================================
        console.log("⏳ [Parallel] Inasubiri maombi yote yakamilike...");
        await Promise.all(fetchPromises);
        console.log("✅ [Parallel] Maombi yote yamekamilika!");

        // Panga bidhaa za duka (Store Products) na Kategoria zake
        setStoreProducts(sList.slice(0, 10));
        if (sList.length > 0) {
          const uniqueCats = [...new Set(sList.map(p => p.sub_category_name).filter(Boolean))];
          setStoreCategories(uniqueCats);
          setActiveCategory(productData.sub_category_name);
        }

        // 4. Pata Variations (Bidhaa za kategoria hii) - Hii inaweza kufanywa baada ya mzigo mkuu
        let variationsData = [];
        if (productData?.leaf_category_id) {
          try {
            const variationsRes = await api.get(`/products/?leaf_category_id=${productData.leaf_category_id}`);
            let vList = variationsRes.data.results || variationsRes.data || [];
            variationsData = vList.filter(p => p.id !== id).slice(0, 5);
          } catch (err) {
            console.error("❌ [Fetch Variations] Error:", err.message);
          }
        }

        // Panga Bidhaa zote (Product)
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
        console.log("✅ [State] Product state imewekwa sawa.");

        // Hifadhi kwenye Recently Viewed
        try {
          if (productData?.id) {
            const recentlyViewed = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
            const filtered = recentlyViewed.filter(pId => pId !== productData.id);
            const updated = [productData.id, ...filtered].slice(0, 10);
            localStorage.setItem("recentlyViewed", JSON.stringify(updated));
          }
        } catch (err) {
          console.error("❌ [LocalStorage] Imeshindwa kuhifadhi recentlyViewed.", err.message);
        }

      } catch (err) {
        console.error("❌ [Main Catcher] getFullProductData imeanguka kwa ujumla:", err.message);
      } finally {
        setIsLoading(false);
      }
    }
    if (id) getFullProductData();
  }, [id]);

  useEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
    };
    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);
    return () => window.removeEventListener('resize', updateHeaderHeight);
  }, []);

  // ============================================================
  // 🔥 FETCH RELATED PRODUCTS (Kulingana na Leaf Category)
  // ============================================================
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!product?.leaf_category_id) return;
      
      setLoadingRelated(true);
      try {
        const response = await api.get('/products/', {
          params: {
            leaf_category_id: product.leaf_category_id,
            ordering: '-views',  // Panga kwa bidhaa maarufu
            limit: 8            // Chukua 8 tu
          }
        });
        
        // Chuja ili usionyeshe bidhaa hiyo yenyewe
        const data = response.data.results || response.data || [];
        const filtered = data.filter(p => p.id !== product.id);
        setRelatedProducts(filtered.slice(0, 8));
        
        console.log("✅ [Related] Bidhaa zinazofanana zimepatikana:", filtered.length);
      } catch (err) {
        console.error("❌ [Related] Imeshindwa kupata bidhaa zinazofanana:", err.message);
        setRelatedProducts([]);
      } finally {
        setLoadingRelated(false);
      }
    };

    if (product?.id) {
      fetchRelatedProducts();
    }
  }, [product?.id, product?.leaf_category_id]);

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
      console.error("❌ [Rate] Imeshindwa kutuma rating kwa product:", id, err.message);
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
    return <div className="text-center py-10 text-gray-500">Bidhaa haijapatikana. (Angalia console kwa makosa ❌)</div>;
  }

  return (
    <div className="product-page-root">
      <div ref={headerRef}>
        <Header />
      </div>

      <div className="product-details-container">
        {/* ✅ BREADCRUMB IMEONDOLIWA KABISA */}

        <main className="product-main-layout">
          <div className="main-grid-container">
            <div className="left-content">
              <section className="product-hero-section">
                <Suspense fallback={<div className="skeleton-loader">Inapakia picha...</div>}>
                  <ProductGallery product={product} isMobile={isMobile} />
                </Suspense>
              </section>

              <div className="product-description-section">
                <h3 className="text-lg font-bold mb-3 text-gray-800">Maelezo ya Bidhaa</h3>
                <div className="prose prose-sm max-w-none text-gray-600">
                  <p>{product?.description || "Hakuna maelezo ya ziada kwa bidhaa hii."}</p>
                </div>
              </div>
            </div>

            <div className="right-sidebar">
              <div className="sticky-info-wrapper">
                <Suspense fallback={<div className="skeleton-loader">Inapakia maelezo...</div>}>
                  <ProductInfo 
                    product={product} 
                    storeProducts={storeProducts} 
                    onRate={handleRateProduct} 
                    isMobile={isMobile} 
                  />
                </Suspense>
              </div>
            </div>

          </div>
        </main>

        {/* 🔥 SEHEMU YA STORE DETAILS */}
        {product.stores ? (
          <section className="product-bottom-details">
            <div className="verification-header-box">
              <div className="header-text">
                <div className="verified-store-badge">
                  <ShieldCheck size={20} />
                  <span>Official Verified Store</span>
                </div>
                <h2>Store Showroom & Verification</h2>
                <p>
                  Gundua bidhaa nyingine na uhakiki wa duka la <strong>{product.stores?.store_name}</strong>
                </p>
              </div>
            </div>

            <div className="showroom-horizontal-scroll">
              <div className="showroom-header">
                <h4>Bidhaa za Duka hili ({storeProducts.length})</h4>
                <Link to={`/store/${product.store_id}`} className="showroom-view-all">Ona zote →</Link>
              </div>
              <div className="no-scrollbar showroom-scroll">
                {storeProducts.map(item => (
                  <Link key={item.id} to={`/product/${item.id}`} className="showroom-item"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                    <div className={`showroom-item-img ${item.id === id ? 'active-border' : ''}`}>
                      <img src={item.cover_image_url} alt={item.name} />
                      {item.id === id && (
                        <div className="showroom-item-badge">INATAZAMWA</div>
                      )}
                    </div>
                    <p className="showroom-item-name">{item.name}</p>
                  </Link>
                ))}
              </div>
            </div>

            <div className="details-content-vertical">
              <div className="store-visuals-section">
                {product.stores?.office_images?.length > 0 && (
                  <div className="store-office-wrapper">
                    <div className="location-verified-badge">
                      <MapPin size={14} /> Physical Location Verified
                    </div>
                    <img src={product.stores.office_images[0]} alt="Verified Office" className="store-office-img" />
                  </div>
                )}
              </div>
              <div className="store-full-details-card">
                <div className="store-card-header">
                  <div className="store-card-title">
                    <h3>{product.stores?.store_name}</h3>
                    <div className="store-card-meta">
                      <span>TIN: {product.stores?.tin_number}</span>
                      <span>•</span>
                      <span>{product.stores?.business_type}</span>
                    </div>
                  </div>
                  <Link to={`/store/${product.store_id}`} className="store-card-btn">Tembelea Duka</Link>
                </div>

                {product.stores?.tin_image_url && (
                  <div className="tin-cert-box">
                    <div className="tin-cert-header">
                      <FileText size={16} /> Hati ya TIN (Verified)
                    </div>
                    <img src={product.stores.tin_image_url} className="tin-cert-img" alt="TIN Certificate" />
                  </div>
                )}

                <div className="store-social-row">
                  {product.stores?.google_maps_url && (
                    <a href={product.stores.google_maps_url} target="_blank" rel="noreferrer" className="social-btn maps">
                      <MapPin size={16} /> Google Maps
                    </a>
                  )}
                  {product.stores?.instagram_handle && (
                    <a href={`https://instagram.com/${product.stores.instagram_handle.replace('@','')}`} target="_blank" rel="noreferrer" className="social-btn insta">
                      <Instagram size={16} /> Instagram
                    </a>
                  )}
                </div>

                <div className="store-metrics-grid">
                  {[
                    { icon: <Package size={18} />, label: 'MOQ', value: product.stores?.moq },
                    { icon: <Zap size={18} />, label: 'LEAD TIME', value: product.stores?.lead_time },
                    { icon: <Clock size={18} />, label: 'WORKING HOURS', value: product.stores?.working_hours },
                    { icon: <Factory size={18} />, label: 'CAPACITY', value: product.stores?.supply_capacity },
                    { icon: <Box size={18} />, label: 'PACKAGING', value: product.stores?.packaging_type }
                  ].map((stat, i) => (
                    <div key={i} className="metric-box">
                      <div className="metric-icon">{stat.icon}</div>
                      <span className="metric-label">{stat.label}</span>
                      <p className="metric-value">{stat.value || 'N/A'}</p>
                    </div>
                  ))}
                </div>

                <div className="store-contact-grid">
                  <div className="contact-box">
                    <div className="contact-icon"><MapPin size={20} /></div>
                    <div>
                      <span className="contact-label">OFFICE ADDRESS</span>
                      <p className="contact-text">{product.stores?.physical_address}, {product.stores?.city}</p>
                    </div>
                  </div>
                  <div className="contact-box">
                    <div className="contact-icon"><Phone size={20} /></div>
                    <div>
                      <span className="contact-label">CONTACT US</span>
                      <p className="contact-text">{product.stores?.phone_number}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <div className="text-center py-4 text-gray-400 text-sm border-t mt-8">
            (Taarifa za duka zinapakuliwa...)
          </div>
        )}

        {/* ============================================================ */}
        {/* 🔥 SEHEMU MPYA: BIDHAA ZINAZOFANANA (RELATED PRODUCTS) */}
        {/* ============================================================ */}
        {relatedProducts.length > 0 && (
          <section className="related-products-section" style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #e5e7eb' }}>
            <div className="related-header" style={{ display: 'flex', justifyContent: 'space-between', alignContent: 'center', marginBottom: '20px' }}>
              <h3 className="text-xl font-bold text-gray-800">Bidhaa Zinazofanana</h3>
              <Link to={`/category/${product.leaf_category_id}`} className="text-orange-500 font-semibold text-sm hover:underline">
                Tazama zote →
              </Link>
            </div>

            {/* Grid ya Related Products */}
            <div className="related-products-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px' }}>
              {relatedProducts.map((p) => (
                <div key={p.id} className="related-product-card" style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '12px', textAlign: 'center', transition: 'all 0.2s ease', cursor: 'pointer' }}
                onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    navigate(`/product/${p.id}`); // ✅ Sasa inatumia navigate
                          }}
                      >
                  <div className="related-img-wrap" style={{ width: '100%', height: '150px', overflow: 'hidden', borderRadius: '8px', marginBottom: '10px', backgroundColor: '#f9f9f9' }}>
                    <img 
                      src={p.cover_image_url || 'https://via.placeholder.com/200x200?text=No+Image'} 
                      alt={p.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/200x200?text=No+Image'; }}
                    />
                  </div>
                  <p className="related-product-name" style={{ fontSize: '14px', fontWeight: '600', color: '#333', margin: '0 0 5px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {p.name}
                  </p>
                  <div className="related-product-price" style={{ fontSize: '13px', fontWeight: '700', color: '#ff6a00' }}>
                    TSH {Number(p.price).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            {/* Loading Skeleton */}
            {loadingRelated && (
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '10px' }}>
                {[...Array(4)].map((_, i) => (
                  <div key={i} style={{ width: '180px', height: '220px', backgroundColor: '#f3f4f6', borderRadius: '12px', animation: 'pulse 1.5s ease-in-out infinite' }} />
                ))}
              </div>
            )}
          </section>
        )}
      </div>

      {!isMobile && <Footer />}

      {isImageViewerOpen && selectedImage && (
        <div className="image-viewer-overlay" onClick={() => setIsImageViewerOpen(false)}>
          <div className="image-viewer-content" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setIsImageViewerOpen(false)} className="viewer-close-btn">
              <X size={20} />
            </button>
            <img 
              src={selectedImage} 
              alt={selectedImageTitle}
              className="viewer-image"
            />
            {selectedImageTitle && (
              <div className="viewer-title">{selectedImageTitle}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}