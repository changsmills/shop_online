import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductGallery from "../components/ProductGallery";
import ProductInfo from "../components/ProductInfo";
import "../ProductDetails.css";
import { supabase } from "../supabaseClient";
import { toast } from 'react-hot-toast';
import { Link } from "react-router-dom";
import { 
  Package, Zap, Clock, Factory, MapPin, Phone, Instagram, 
  ShieldCheck, Box, Video, FileText, Store, X, ChevronRight, Eye
} from 'lucide-react';

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

  // Detect mobile screen
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
      }
    }
    if (id) getFullProductData();
  }, [id]);

  // Weka huu useEffect baada ya useEffect wa mobile detection
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

  if (!product) return (
    <div className="loader-container">
      <div className="spinner"></div>
      <p>Inapakia bidhaa...</p>
    </div>
  );

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

  // Function ya kufungua image viewer
  const openImageViewer = (imageUrl, title) => {
    setSelectedImage(imageUrl);
    setSelectedImageTitle(title);
    setIsImageViewerOpen(true);
  };

  return (
    <div className="product-page-root">
      <div ref={headerRef}>
        <Header />
      </div>

      <div 
  className="container-wrapper"
  style={{ 
    boxSizing: 'border-box',
    paddingTop: isMobile ? '80px' : `${headerHeight}px`,
    transition: 'padding-top 0.2s ease',
    paddingLeft: isMobile ? '0 !important' : '0',
    paddingRight: isMobile ? '0 !important' : '0',
    margin: isMobile ? '0 !important' : '0 auto',
    maxWidth: isMobile ? '100% !important' : '100%',
    width: isMobile ? '100% !important' : '100%',
    display: isMobile ? 'block' : 'flex',
    flexDirection: 'column',
    minHeight: isMobile ? 'auto' : '100vh'
  }}
>
        {/* Breadcrumb - Ipo juu ya bluu */}
        <nav className="breadcrumb-nav" style={{ 
          padding: isMobile ? '0' : '20px 20px 10px 20px',
          maxWidth: isMobile ? '100%' : '1400px',
          width: isMobile ? '100%' : '100%',
          marginTop: isMobile ? '60px' : '0 auto',
          paddingLeft: isMobile ? '12px' : '0'
          
        }}>
          <span>Home</span> <span className="sep">/</span> 
          <span>Products</span> <span className="sep">/</span> 
          <span className="active-path">{product.name}</span>
        </nav>

        {/* 
          Main - Sasa tumetumia flex: 1 kuiga SearchPage!
          Rangi ya bluu inajaza kioo chote (haina margin upande wowote).
        */}
        <main className="product-main-layout" style={{
          flex: isMobile ? 'none' : '1',
          padding: isMobile ? '0 !important' : '0',
           //paddingTop: isMobile ? '50px' : `${headerHeight}px`,
          margin: isMobile ? '0 !important' : '0', /* IMPORTANT: margin imeondolewa kabisa kwa Desktop! */
          backgroundColor: "white",
          width: '100%',
          maxWidth: isMobile ? '100% !important' : '1400px',
          alignSelf: isMobile ? 'stretch' : 'center', /* Inajenga upana wake */
          borderRadius: isMobile ? '0 !important' : '20px',
          boxSizing: 'border-box'
        }}>
           
   <div className="main-grid-container" style={{
  display: 'flex',
  flexDirection: isMobile ? 'column' : 'row',
  width: isMobile ? '100vw !important' : '100%',
  flex: isMobile ? 'none' : '1',
  height: isMobile ? 'auto' : 'auto',
  maxWidth: isMobile ? '100% !important' : '100%',
  padding: isMobile ? '0 !important' : '0',
  margin: isMobile ? '0 !important' : '0 auto',
  boxSizing: 'border-box',
  overflow: isMobile ? 'visible' : 'visible',
  backgroundColor: isMobile ? 'transparent' : 'transparent',
  alignItems: isMobile ? 'stretch' : 'flex-start', // 🔥 HAPA: Inazuia sidebar kujipandisha urefu
  position: 'relative',
  gap: isMobile ? '0' : '0'
}}>
  
      {/* ================= UPANDE WA KUSHOTO (PICHA - 65%) ================= */}
    <div className="left-content" style={{ 
      display: 'flex',
      flexDirection: 'column',
      flex: isMobile ? 'none' : '0 0 65%',
      width: isMobile ? '100% !important' : '100%',
      height: isMobile ? 'auto' : 'auto',
      padding: isMobile ? '0 !important' : '0',
      margin: isMobile ? '0 !important' : '0',
      boxSizing: 'border-box',
      overflow: isMobile ? 'visible' : 'visible',
      backgroundColor: 'transparent'
    }}>
      <section className="product-hero-section" style={{ 
        padding: isMobile ? '0 !important' : '0',
        margin: isMobile ? '0 !important' : '0',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: 'auto'
      }}>
        <ProductGallery product={product} isMobile={isMobile} />
      </section>

      {/* Product Description - Maelezo ya bidhaa */}
      <div className="product-description-section" style={{ 
        marginTop: '24px',
        paddingLeft: isMobile ? '0 !important' : '0', 
        paddingRight: isMobile ? '0 !important' : '0',
        width: '100%'
      }}>
        <h3 className="text-lg font-bold mb-3 text-gray-800">Maelezo ya Bidhaa</h3>
        <div className="prose prose-sm max-w-none text-gray-600">
          <p>{product?.description || "Hakuna maelezo ya ziada kwa bidhaa hii."}</p>
        </div>
      </div>

      {/* ========================================================== */}
      {/* 🔥 SEHEMU ILIYOKOSA: STORE DETAILS FOR MOBILE (IMERUDISHWA) */}
      {/* ========================================================== */}
      {isMobile && product.stores && (
        <div className="mobile-store-details" style={{ 
          marginTop: '20px',
          paddingLeft: '0 !important',
          paddingRight: '0 !important',
          width: '100% !important'
        }}>
          {/* Store Header Card */}
          <div className="store-header-card" style={{
            backgroundColor: '#fff',
            borderRadius: '16px',
            padding: '16px',
            marginBottom: '16px',
            border: '1px solid #eee',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: '#fff5ed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Store size={24} color="#ff6a00" />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#1f2937' }}>
                  {product.stores?.store_name || "Duka la Mfanyabiashara"}
                </h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                  <ShieldCheck size={12} color="#10b981" />
                  <span style={{ fontSize: '11px', color: '#10b981', fontWeight: '500' }}>
                    {product.stores?.is_verified ? "Verified Seller" : "Seller"}
                  </span>
                  <span style={{ fontSize: '11px', color: '#ccc' }}>•</span>
                  <span style={{ fontSize: '11px', color: '#666' }}>{product.stores?.business_type || "Business"}</span>
                </div>
              </div>
              <Link to={`/store/${product.store_id}`} style={{
                padding: '6px 14px',
                backgroundColor: '#ff6a00',
                color: 'white',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '600',
                textDecoration: 'none'
              }}>View Store</Link>
            </div>
          </div>

          {/* Office Image - Click to view larger */}
          {product.stores?.office_images?.length > 0 && (
            <div className="office-image-section" style={{ marginBottom: '16px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '10px', color: '#333', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={16} color="#ff6a00" /> Physical Location
              </h4>
              <div 
                style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer' }}
                onClick={() => openImageViewer(product.stores.office_images[0], "Office Location")}
              >
                <img 
                  src={product.stores.office_images[0]} 
                  alt="Office" 
                  style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: '10px',
                  right: '10px',
                  background: 'rgba(0,0,0,0.6)',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '20px',
                  fontSize: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <Eye size={12} /> Click to zoom
                </div>
                <div style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '10px',
                  background: 'rgba(0,0,0,0.7)',
                  color: 'white',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  fontSize: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <MapPin size={12} /> Verified Location
                </div>
              </div>
            </div>
          )}

          {/* TIN Certificate */}
          {product.stores?.tin_image_url && (
            <div className="tin-certificate-section" style={{ marginBottom: '16px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '10px', color: '#333', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FileText size={16} color="#ff6a00" /> TIN Certificate
              </h4>
              <div 
                style={{ border: '1px solid #eee', borderRadius: '12px', overflow: 'hidden', background: '#f9fafb', padding: '10px', cursor: 'pointer' }}
                onClick={() => openImageViewer(product.stores.tin_image_url, "TIN Certificate")}
              >
                <img 
                  src={product.stores.tin_image_url} 
                  alt="TIN" 
                  style={{ width: '100%', height: 'auto', maxHeight: '120px', objectFit: 'contain' }}
                />
                <div style={{ textAlign: 'center', marginTop: '5px', fontSize: '10px', color: '#888' }}>
                  🔍 Bonyeza kuona picha kubwa
                </div>
              </div>
            </div>
          )}

          {/* Store Products - VERTICAL LIST on Mobile */}
          {storeProducts.length > 0 && (
            <div className="store-products-section" style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#333', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Package size={16} color="#ff6a00" /> Bidhaa za Duka hili ({storeProducts.length})
                </h4>
                <Link to={`/store/${product.store_id}`} style={{ fontSize: '12px', color: '#ff6a00', fontWeight: '600', textDecoration: 'none' }}>
                  Ona zote →
                </Link>
              </div>
              
              <div className="store-products-vertical" style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}>
                {storeProducts.map(item => (
                  <Link 
                    key={item.id} 
                    to={`/product/${item.id}`} 
                    style={{ textDecoration: 'none' }}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  >
                    <div style={{
                      display: 'flex',
                      gap: '12px',
                      backgroundColor: '#fff',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      border: item.id === id ? '2px solid #ff6a00' : '1px solid #eee',
                      padding: '10px',
                    }}>
                      <img 
                        src={item.cover_image} 
                        alt={item.name} 
                        style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <p style={{ fontSize: '13px', fontWeight: '600', margin: 0, color: '#333' }}>
                          {item.name}
                        </p>
                        <p style={{ fontSize: '14px', color: '#ff6a00', fontWeight: '700', margin: '6px 0 0' }}>
                          TSh {Number(item.price).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Store Metrics */}
          <div className="store-metrics-section" style={{ marginBottom: '16px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '10px', color: '#333' }}>📊 Taarifa za Duka</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              {[
                { label: 'MOQ', value: product.stores?.moq || 'N/A' },
                { label: 'Lead Time', value: product.stores?.lead_time || 'N/A' },
                { label: 'Working Hours', value: product.stores?.working_hours || 'N/A' },
                { label: 'Capacity', value: product.stores?.supply_capacity || 'N/A' }
              ].map((item, idx) => (
                <div key={idx} style={{ backgroundColor: '#f8fafc', padding: '10px', borderRadius: '10px' }}>
                  <div style={{ fontSize: '10px', color: '#888', marginBottom: '4px' }}>{item.label}</div>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: '#333' }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div className="social-links-section" style={{ marginBottom: '16px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '10px', color: '#333' }}>🔗 Wasiliana Nasi</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {product.stores?.google_maps_url && (
                <a href={product.stores.google_maps_url} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', background: '#f1f5f9', borderRadius: '30px', textDecoration: 'none', fontSize: '12px', fontWeight: '500', color: '#333' }}>
                  <MapPin size={14} color="#ef4444" /> Location
                </a>
              )}
              {product.stores?.instagram_handle && (
                <a href={`https://instagram.com/${product.stores.instagram_handle.replace('@','')}`} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', background: '#f1f5f9', borderRadius: '30px', textDecoration: 'none', fontSize: '12px', fontWeight: '500', color: '#333' }}>
                  <Instagram size={14} color="#e1306c" /> Instagram
                </a>
              )}
              {product.stores?.phone_number && (
                <a href={`tel:${product.stores.phone_number}`} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', background: '#f1f5f9', borderRadius: '30px', textDecoration: 'none', fontSize: '12px', fontWeight: '500', color: '#333' }}>
                  <Phone size={14} color="#10b981" /> Call
                </a>
              )}
            </div>
          </div>

          {/* Address */}
          {(product.stores?.physical_address || product.stores?.city) && (
            <div className="address-section" style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MapPin size={16} color="#888" />
                <span style={{ fontSize: '12px', color: '#555', flex: 1 }}>
                  {product.stores?.physical_address || ''}{product.stores?.city ? `, ${product.stores.city}` : ''}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    
     {/* ========================================================== */}
      {/* 🔥 SEHEMU YA STORE - KWA DESKTOP (ULIYOTUMA) 🔥 */}
      {/* ========================================================== */}
      {!isMobile && (
        <section className="product-bottom-details" style={{ marginTop: '30px' }}>
          <div className="verification-header-box">
            <div className="header-text">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#16a34a', marginBottom: '8px' }}>
                <ShieldCheck size={20} />
                <span style={{ fontWeight: '700', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Official Verified Store</span>
              </div>
              <h2 style={{ margin: 0, fontSize: '22px', color: '#111827', fontWeight: '800' }}>Store Showroom & Verification</h2>
              <p style={{ margin: '5px 0 0', color: '#4b5563', fontSize: '14px' }}>
                Gundua bidhaa nyingine na uhakiki wa duka la <strong>{product.stores?.store_name}</strong>
              </p>
            </div>
          </div>

          <div className="showroom-horizontal-scroll" style={{ marginBottom: '35px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#374151' }}>Bidhaa za Duka hili ({storeProducts.length})</h4>
              <Link to={`/store/${product.store_id}`} style={{ fontSize: '13px', color: '#ea580c', fontWeight: '700', textDecoration: 'none' }}>Ona zote →</Link>
            </div>
            <div className="no-scrollbar" style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '12px', scrollSnapType: 'x mandatory' }}>
              {storeProducts.map(item => (
                <Link key={item.id} to={`/product/${item.id}`} style={{ flex: '0 0 145px', textDecoration: 'none', scrollSnapAlign: 'start' }}
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                  <div style={{ width: '145px', height: '145px', borderRadius: '20px', padding: '4px',
                    border: item.id === id ? '3.5px solid #ea580c' : '1px solid #e5e7eb', background: '#fff', position: 'relative', overflow: 'hidden' }}>
                    <img src={item.cover_image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px' }} />
                    {item.id === id && (
                      <div style={{ position: 'absolute', bottom: '8px', left: '50%', transform: 'translateX(-50%)',
                        background: '#ea580c', color: '#fff', fontSize: '9px', fontWeight: '800', padding: '3px 8px', borderRadius: '6px', whiteSpace: 'nowrap' }}>
                        INATAZAMWA
                      </div>
                    )}
                  </div>
                  <p style={{ fontSize: '12px', color: '#374151', marginTop: '8px', textAlign: 'center', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.name}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          <div className="details-content-vertical" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="store-visuals-section">
              {product.stores?.office_images?.length > 0 && (
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '15px', left: '15px', background: 'rgba(255,255,255,0.9)', padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '5px', backdropFilter: 'blur(4px)' }}>
                    <MapPin size={14} color="#ea580c" /> Physical Location Verified
                  </div>
                  <img src={product.stores.office_images[0]} alt="Verified Office" style={{ width: '100%', height: '320px', borderRadius: '24px', objectFit: 'cover' }} />
                </div>
              )}
            </div>
            <div className="store-full-details-card" style={{ padding: '30px', background: '#ffffff', borderRadius: '28px', border: '1px solid #f3f4f6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '25px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#111827' }}>{product.stores?.store_name}</h3>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                    <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>TIN: {product.stores?.tin_number}</span>
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>•</span>
                    <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>{product.stores?.business_type}</span>
                  </div>
                </div>
                <Link to={`/store/${product.store_id}`} style={{ padding: '12px 24px', background: '#111827', color: '#fff', borderRadius: '12px', fontSize: '13px', fontWeight: '700', textDecoration: 'none' }}>Tembelea Duka</Link>
              </div>
              {product.stores?.tin_image_url && (
                <div style={{ marginTop: '20px', marginBottom: '20px', border: '2px dashed #e5e7eb', borderRadius: '20px', overflow: 'hidden', background: '#f9fafb', padding: '15px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', color: '#374151' }}>
                    <FileText size={16} color="#ea580c" />
                    <span style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase' }}>Hati ya TIN (Verified)</span>
                  </div>
                  <img src={product.stores.tin_image_url} style={{ width: '100%', height: 'auto', maxHeight: '200px', objectFit: 'contain', borderRadius: '12px' }} alt="TIN Certificate" />
                </div>
              )}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
                {product.stores?.google_maps_url && (
                  <a href={product.stores.google_maps_url} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 15px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', textDecoration: 'none', color: '#1e293b', fontSize: '13px', fontWeight: '700' }}>
                    <MapPin size={16} color="#ef4444" /> Google Maps
                  </a>
                )}
                {product.stores?.instagram_handle && (
                  <a href={`https://instagram.com/${product.stores.instagram_handle.replace('@','')}`} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 15px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', textDecoration: 'none', color: '#1e293b', fontSize: '13px', fontWeight: '700' }}>
                    <Instagram size={16} color="#e1306c" /> Instagram
                  </a>
                )}
                {product.stores?.tiktok_handle && (
                  <a href={`https://tiktok.com/@${product.stores.tiktok_handle.replace('@','')}`} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 15px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', textDecoration: 'none', color: '#1e293b', fontSize: '13px', fontWeight: '700' }}>
                    <Video size={16} color="#000" /> TikTok
                  </a>
                )}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '15px', marginTop: '30px', marginBottom: '30px' }}>
                {[
                  { icon: <Package size={18} />, label: 'MOQ', value: product.stores?.moq },
                  { icon: <Zap size={18} />, label: 'LEAD TIME', value: product.stores?.lead_time },
                  { icon: <Clock size={18} />, label: 'WORKING HOURS', value: product.stores?.working_hours },
                  { icon: <Factory size={18} />, label: 'CAPACITY', value: product.stores?.supply_capacity },
                  { icon: <Box size={18} />, label: 'PACKAGING', value: product.stores?.packaging_type }
                ].map((stat, i) => (
                  <div key={i} style={{ padding: '15px', background: '#f8fafc', borderRadius: '18px', border: '1px solid #f1f5f9' }}>
                    <div style={{ color: '#64748b', marginBottom: '8px' }}>{stat.icon}</div>
                    <span style={{ display: 'block', fontSize: '10px', color: '#94a3b8', fontWeight: '800', letterSpacing: '0.5px' }}>{stat.label}</span>
                    <p style={{ margin: '2px 0 0', fontSize: '13px', fontWeight: '700', color: '#1e293b' }}>{stat.value || 'N/A'}</p>
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', paddingTop: '25px', borderTop: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', background: '#fff7ed', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ea580c' }}><MapPin size={20} /></div>
                  <div><span style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#94a3b8' }}>OFFICE ADDRESS</span><p style={{ margin: 0, fontSize: '13px', color: '#475569', lineHeight: '1.5' }}>{product.stores?.physical_address}, {product.stores?.city}</p></div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', background: '#f0f9ff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284c7' }}><Phone size={20} /></div>
                  <div><span style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#94a3b8' }}>CONTACT US</span><p style={{ margin: 0, fontSize: '13px', color: '#475569', fontWeight: '600' }}>{product.stores?.phone_number}</p></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      
    </div>

  {/* ================= UPANDE WA KULIA (INFO - 35% + STICKY) ================= */}
  <div className="right-sidebar" style={{ 
    flex: isMobile ? 'none' : '0 0 35%',
    width: isMobile ? '100% !important' : '100%',
    height: isMobile ? 'auto' : 'fit-content',   // 🔥 Hifadhi urefu wake halisi
    padding: isMobile ? '0 !important' : '20px 20px 0 0',
    boxSizing: 'border-box',
    margin: isMobile ? '0 !important' : '0',
    position: isMobile ? 'relative' : 'sticky',  // 🔥 Inafanya kuwa sticky kwenye desktop
    top: isMobile ? 'auto' : `${headerHeight + 20}px`, // 🔥 Inakaa chini ya Header
    alignSelf: isMobile ? 'stretch' : 'flex-start', // 🔥 Inazuia kushtuka urefu
    backgroundColor: 'white',
    borderLeft: isMobile ? 'none' : '1px solid #e5e7eb',
    display: 'flex',
    flexDirection: 'column'
  }}>
    <div style={{
      flex: 1,
      width: '100%',
      height: '100%'
    }}>
      <ProductInfo 
        product={product} 
        storeProducts={storeProducts} 
        onRate={handleRateProduct} 
        isMobile={isMobile} 
      />
    </div>
  </div>

</div>

        </main>
      </div>
      {!isMobile && <Footer />}

      {/* ========== IMAGE VIEWER MODAL (KWA KUBONYEZA PICHA) ========== */}
      {isImageViewerOpen && selectedImage && (
        <div 
          className="image-viewer-overlay"
          onClick={() => setIsImageViewerOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.95)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'fadeIn 0.2s ease'
          }}
        >
          <div 
            className="image-viewer-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: '90%',
              maxHeight: '90%'
            }}
          >
            <button 
              onClick={() => setIsImageViewerOpen(false)}
              style={{
                position: 'absolute',
                top: '-40px',
                right: '0',
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                cursor: 'pointer',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={20} />
            </button>
            <img 
              src={selectedImage} 
              alt={selectedImageTitle}
              style={{
                maxWidth: '100%',
                maxHeight: '85vh',
                objectFit: 'contain',
                borderRadius: '8px'
              }}
            />
            {selectedImageTitle && (
              <div style={{
                position: 'absolute',
                bottom: '-30px',
                left: 0,
                right: 0,
                textAlign: 'center',
                color: 'white',
                fontSize: '14px'
              }}>
                {selectedImageTitle}
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .store-products-horizontal::-webkit-scrollbar {
          height: 3px;
        }
        .store-products-horizontal::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .store-products-horizontal::-webkit-scrollbar-thumb {
          background: #ff6a00;
          border-radius: 10px;
        }
        /* ===== MOBILE FULL SCREEN FIX ===== */
        @media (max-width: 768px) {
          .product-page-root {
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .container-wrapper {
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .product-main-layout {
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            border-radius: 0 !important;
          }
          .main-grid-container {
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .left-content, .product-hero-section {
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          /* Remove border-radius from gallery on mobile */
          .gallery-mobile-simple,
          .mobile-main-display,
          .mobile-main-display video,
          .mobile-main-display img {
            border-radius: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}