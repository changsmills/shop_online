// src/components/ProductDetails.jsx
import React, { useState, useEffect, useRef, Suspense } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../ProductDetails.css";

import api from "../axiosConfig"; 

import { toast } from 'react-hot-toast';
import { Link } from "react-router-dom";
import { 
  Package, Zap, Clock, Factory, MapPin, Phone, Instagram, 
  ShieldCheck, Box, Video, FileText, Store, X, ChevronRight, Eye
} from 'lucide-react';

const ProductGallery = React.lazy(() => import("../components/ProductGallery"));
const ProductInfo = React.lazy(() => import("../components/ProductInfo"));
const SkeletonProductDetails = React.lazy(() => import("../components/SkeletonProductDetails"));

export default function ProductDetails() {
  const { id } = useParams();
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

        let storeData = null;
        let variationsData = [];
        let mediaData = [];

        let sList = [];
        if (productData?.store_id) {
          try {
            const sProductsRes = await api.get(`/products/?store_id=${productData.store_id}`);
            sList = sProductsRes.data.results || sProductsRes.data || [];
            sList = sList.filter(p => p.id !== id);
            setStoreProducts(sList.slice(0, 10));
            console.log("✅ [Fetch 2] Store products (bidhaa za duka) zimepatikana.");
          } catch (err) {
            console.error("❌ [Fetch 2] Imeshindwa kupata bidhaa za duka kwa store_id:", productData.store_id, err.message);
          }

          try {
            const uniqueCats = [...new Set(sList.map(p => p.sub_category_name).filter(Boolean))];
            setStoreCategories(uniqueCats);
            setActiveCategory(productData.sub_category_name);
          } catch (err) {
            console.error("❌ [Processing] Imeshindwa kuchuja subcategories.", err.message);
          }
        }

        if (productData?.leaf_category_id) {
          try {
            const variationsRes = await api.get(`/products/?leaf_category_id=${productData.leaf_category_id}`);
            let vList = variationsRes.data.results || variationsRes.data || [];
            vList = vList.filter(p => p.id !== id);
            variationsData = vList.slice(0, 5);
            console.log("✅ [Fetch 3] Variations (bidhaa za kategoria) zimepatikana.");
          } catch (err) {
            console.error("❌ [Fetch 3] Imeshindwa kupata variations kwa leaf_category_id:", productData.leaf_category_id, err.message);
          }
        }

        if (productData.store_id) {
          try {
            const storeRes = await api.get(`/stores/${productData.store_id}/`);
            storeData = storeRes.data;
            console.log("✅ [Fetch 4] Store data (maelezo ya duka) imepatikana.");
          } catch (err) {
            console.error("❌ [Fetch 4] Imeshindwa kabisa kupata store kwa ID:", productData.store_id, "Error:", err.message);
          }
        }

        try {
          const mediaRes = await api.get(`/product-media/?product_id=${id}`);
          mediaData = mediaRes.data.results || mediaRes.data || [];
          console.log("✅ [Fetch 6] Media (picha/video) imepatikana.");
        } catch (err) {
          console.error("❌ [Fetch 6] Imeshindwa kupata media kwa product_id:", id, err.message);
        }

        try {
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
        } catch (err) {
          console.error("❌ [State] Imeshindwa kuweka product state.", err.message);
        }

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
                      <img src={item.cover_image} alt={item.name} />
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