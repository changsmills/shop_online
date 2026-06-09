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
      if (!leafId) return;
      setLoading(true);
      
      try {
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
        setProducts(prodData || []);

      } catch (err) {
        console.error("Full Error Debug:", err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchPageData();
  }, [leafId]);

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

        {/* Kichwa cha ukurasa - muhimu kwa UX */}
        <div style={{ 
          padding: isMobile ? '10px 20px 0' : '20px', 
          fontSize: isMobile ? '18px' : '24px', 
          fontWeight: 'bold' 
        }}>
          {hierarchy.leaf}
        </div>

        <div className="content-layout">
          <section className="products-display-area" style={{ 
            padding: isMobile ? '10px' : '20px',
            minHeight: '60vh'
          }}>
            {loading ? (
              <div className="loading-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
                <Loader2 className="animate-spin" size={40} color="#ff6600" strokeWidth={2.5} />
                <p style={{ color: '#666', marginTop: '10px' }}>Inapakia bidhaa...</p>
              </div>
            ) : products.length > 0 ? (
              <div className="products-grid">
                {products.map((item) => (
                  <div key={item.id} className="product-wrapper" style={{ textAlign: 'center' }}>
                    <div style={{ 
                      width: '100%', 
                      aspectRatio: '1/1', 
                      borderRadius: '50%', 
                      overflow: 'hidden',
                      backgroundColor: '#f5f5f5',
                      marginBottom: '8px',
                      border: '1px solid #eee',
                      cursor: 'pointer'
                    }} onClick={() => navigate(`/product/${item.id}`)}>
                      <img 
                        src={item.product_media?.[0]?.media_url || '/placeholder.jpg'} 
                        alt={item.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <p style={{ 
                      fontSize: isMobile ? '10px' : '12px', 
                      margin: '0 0 4px 0', 
                      fontWeight: '500',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {item.name}
                    </p>
                    {/* 👇 ONGEZA BEI IKIWA UNAITAKA (hiari) */}
                    {item.price && (
                      <p style={{ 
                        fontSize: isMobile ? '10px' : '12px', 
                        margin: 0, 
                        color: '#ff6600', 
                        fontWeight: 'bold' 
                      }}>
                        TSh {Number(item.price).toLocaleString()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state" style={{ textAlign: 'center', padding: '50px 20px' }}>
                <PackageOpen size={60} color="#ddd" style={{ marginBottom: '15px' }} />
                <h2 style={{ fontSize: '18px', color: '#333' }}>Hakuna bidhaa!</h2>
                <p style={{ color: '#999', fontSize: '14px', marginBottom: '20px' }}>
                  Samahani, kategoria ya "{hierarchy.leaf}" haina bidhaa kwa sasa.
                </p>
                <button className="go-back-btn" onClick={() => navigate(-1)} style={{ 
                  padding: '10px 25px', 
                  borderRadius: '20px', 
                  border: 'none', 
                  background: '#ff6600', 
                  color: 'white',
                  cursor: 'pointer' 
                }}>
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