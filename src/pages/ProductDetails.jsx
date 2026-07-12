// src/components/ProductDetails.jsx
import React, { useState, useEffect, useRef, Suspense } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../ProductDetails.css";
import { supabase } from "../supabaseClient";
import { toast } from 'react-hot-toast';
import { Link } from "react-router-dom";
import { 
  Package, Zap, Clock, Factory, MapPin, Phone, Instagram, 
  ShieldCheck, Box, Video, FileText, Store, X, ChevronRight, Eye
} from 'lucide-react';

// ✅ LAZY IMPORTS
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
        const { error } = await supabase.rpc('increment_product_views', { row_id: id });
        if (!error) {
          viewedProducts.push(id);
          localStorage.setItem("viewed_products", JSON.stringify(viewedProducts));
        }
      }
    };
    incrementView();
  }, [id]);

  useEffect(() => {
    async function getFullProductData() {
      try {
        setIsLoading(true);
        const { data: productData, error: prodError } = await supabase
          .from("products_engines")
          .select("*") 
          .eq("id", id)
          .single();
        if (prodError) throw prodError;

        if (productData?.store_id) {
          const { data: sProducts } = await supabase
            .from("products_engines")
            .select("*")
            .eq("store_id", productData.store_id)
            .neq("id", id)
            .limit(10);
          setStoreProducts(sProducts || []);
        }

        const { data: variationsData } = await supabase
          .from('products_engines')
          .select('*')
          .eq('leaf_category_id', productData.leaf_category_id)
          .neq('id', id)
          .limit(5);

        let storeData = null;
        if (productData.store_id) {
          const { data: sData } = await supabase
            .from("stores_engine")
            .select("*")
            .eq("id", productData.store_id)
            .single();
          storeData = sData;
        }

        if (productData?.store_id) {
          const { data: catData } = await supabase
            .from("products_engines")
            .select("sub_category_name")
            .eq("store_id", productData.store_id);
          if (catData) {
            const uniqueCats = [...new Set(catData.map(c => c.sub_category_name))];
            setStoreCategories(uniqueCats);
          }
          setActiveCategory(productData.sub_category_name);
        }

        const { data: mediaData } = await supabase
          .from("product_media")
          .select("media_url, media_type")
          .eq("product_id", id);

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

        if (productData?.id) {
          const recentlyViewed = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
          const filtered = recentlyViewed.filter(id => id !== productData.id);
          const updated = [productData.id, ...filtered].slice(0, 10);
          localStorage.setItem("recentlyViewed", JSON.stringify(updated));
        }
      } catch (err) {
        console.error("Error fetching data:", err.message);
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
      const { error } = await supabase.rpc('increment_rating', { row_id: id, user_rating: stars });
      toast.dismiss(loadingToast);
      if (error) {
        toast.error("Imeshindikana: " + error.message);
      } else {
        toast.success(`Asante kwa rating ya nyota ${stars}!`);
        setProduct(prev => {
          const newTotal = (prev.total_reviews || 0) + 1;
          const newAverage = (((prev.average_rating || 0) * (prev.total_reviews || 0)) + stars) / newTotal;
          return { ...prev, total_reviews: newTotal, average_rating: newAverage };
        });
      }
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

  // ✅ SKELETON LOADING
  if (isLoading) {
    return <SkeletonProductDetails isMobile={isMobile} />;
  }

  return (
    <div className="product-page-root">
      <div ref={headerRef}>
        <Header />
      </div>

      <div className="product-details-container">
        {/* Breadcrumb */}
        <nav className="breadcrumb-nav">
          <span>Home</span> <span className="sep">/</span> 
          <span>Products</span> <span className="sep">/</span> 
          <span className="active-path">{product.name}</span>
        </nav>

        {/* Main Layout */}
        <main className="product-main-layout">
          <div className="main-grid-container">
            
            {/* ================= UPANDE WA KUSHOTO ================= */}
            <div className="left-content">
              <section className="product-hero-section">
                <Suspense fallback={<div className="skeleton-loader">Inapakia picha...</div>}>
                  <ProductGallery product={product} isMobile={isMobile} />
                </Suspense>
              </section>

              {/* Product Description */}
              <div className="product-description-section">
                <h3 className="text-lg font-bold mb-3 text-gray-800">Maelezo ya Bidhaa</h3>
                <div className="prose prose-sm max-w-none text-gray-600">
                  <p>{product?.description || "Hakuna maelezo ya ziada kwa bidhaa hii."}</p>
                </div>
              </div>
            </div>

            {/* ================= UPANDE WA KULIA (STICKY) ================= */}
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

        {/* ========================================================== */}
        {/* 🔥 STORE DETAILS - SASA INAONEKANA KWENYE MOBILE PIA! */}
        {/* ========================================================== */}
        {product.stores && (
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
        )}

      </div>

      {!isMobile && <Footer />}

      {/* ========== IMAGE VIEWER MODAL ========== */}
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