import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ChevronRight, Loader2, PackageOpen } from "lucide-react";
import "./CategoryProducts.css";

export default function CategoryProducts() {
  const { leafId } = useParams();
  const [products, setProducts] = useState([]);
  const [hierarchy, setHierarchy] = useState({ category: "Marketplace", sub: "General", leaf: "Products" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  // Detect mobile screen
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    async function fetchPageData() {
      if (!leafId) {
        setError("Leaf ID haipo");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      
      try {
        console.log("Fetching leaf category with ID:", leafId);
        const { data: leaf, error: leafErr } = await supabase
          .from('leaf_categories')
          .select('name, sub_category_id')
          .eq('id', leafId)
          .single();

        if (leafErr) throw leafErr;

        if (leaf) {
          const { data: subData, error: subErr } = await supabase
            .from('sub_categories')
            .select('name, category_id')
            .eq('id', leaf.sub_category_id)
            .single();

          let mainCatName = "Marketplace";
          if (subData?.category_id) {
            const { data: mainData } = await supabase
              .from('categories')
              .select('name')
              .eq('id', subData.category_id)
              .single();
            if (mainData) mainCatName = mainData.name;
          }

          setHierarchy({
            category: mainCatName,
            sub: subData?.name || "General",
            leaf: leaf.name || "Products"
          });
        }

        console.log("Fetching products for leaf ID:", leafId);
        const { data: prodData, error: prodError } = await supabase
          .from('products_engines')
          .select(`
            *,
            product_media (
              media_url,
              media_type,
              product_id
            )
          `)
          .eq('leaf_category_id', leafId)
          .order('created_at', { ascending: false });

        if (prodError) throw prodError;
        console.log(`Products found: ${prodData?.length || 0}`);
        setProducts(prodData || []);

      } catch (err) {
        console.error("Full Error Debug:", err);
        setError(err.message || "Kuna tatizo la kupakia data");
      } finally {
        setLoading(false);
      }
    }
    
    fetchPageData();
  }, [leafId]);

  // Helper function to get first image URL
  const getProductImage = (item) => {
    const imageMedia = item.product_media?.find(m => m.media_type === 'image');
    return imageMedia?.media_url || '/placeholder.jpg';
  };

  return (
    <div className="category-page-container">
      <Header />
      <div className="header-spacer"></div> 

      <main className="category-main-content">
        {/* Breadcrumb - Inaonekana desktop tu */}
        {!isMobile && (
          <nav className="breadcrumb-nav">
            <div className="breadcrumb-links">
              <span className="breadcrumb-item clickable" onClick={() => navigate('/')}>Home</span> 
              <ChevronRight size={14} />
              <span className="breadcrumb-item">{hierarchy.category}</span> 
              <ChevronRight size={14} />
              <span className="breadcrumb-item">{hierarchy.sub}</span> 
              <ChevronRight size={14} />
              <span className="breadcrumb-item active">{hierarchy.leaf}</span>
            </div>
          </nav>
        )}

        {/* Kichwa cha ukurasa */}
        <div className="category-header">
          <h1>{hierarchy.leaf}</h1>
        </div>

        <div className="content-layout">
          <section className="products-display-area">
            {loading ? (
              <div className="loading-container">
                <Loader2 className="animate-spin" size={40} color="#ff6600" strokeWidth={2.5} />
                <p>Inapakia bidhaa...</p>
              </div>
            ) : error ? (
              <div className="error-state">
                <p>{error}</p>
                <button onClick={() => window.location.reload()}>Jaribu tena</button>
              </div>
            ) : products.length > 0 ? (
              <div className="products-grid">
                {products.map((item) => (
                  <div key={item.id} className="product-wrapper" onClick={() => navigate(`/product/${item.id}`)}>
                    <div className="product-image-container">
                      <img 
                        src={getProductImage(item)} 
                        alt={item.name}
                        loading="lazy"
                      />
                    </div>
                    <div className="product-info">
                      <p className="product-name">{item.name}</p>
                      {item.price && (
                        <p className="product-price">
                          TSh {Number(item.price).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <PackageOpen size={60} color="#ddd" />
                <h2>Hakuna bidhaa!</h2>
                <p>Samahani, kategoria ya "{hierarchy.leaf}" haina bidhaa kwa sasa.</p>
                <button className="go-back-btn" onClick={() => navigate(-1)}>
                  Rudi Nyuma
                </button>
              </div>
            )}
          </section>
        </div>
      </main>
      {!isMobile && <Footer />}
    </div>
  );
}