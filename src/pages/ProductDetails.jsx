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