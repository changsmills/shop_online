// src/components/CategoryProducts.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import Header from "../components/Header";
import Footer from "../components/Footer";
import DashboardCard from "../components/DashboardCard"; // ✅ Ongeza hii!
import { ChevronRight } from "lucide-react";
import "../CategoryProducts.css";

export default function CategoryProducts() {
  const { leafId } = useParams();
  const [products, setProducts] = useState([]);
  const [hierarchy, setHierarchy] = useState({ category: "Marketplace", sub: "General", leaf: "Products" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
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
            product_media ( media_url, media_type, product_id )
          `)
          .eq('leaf_category_id', leafId)
          .order('created_at', { ascending: false });

        if (prodError) throw prodError;
        setProducts(prodData || []);
      } catch (err) {
        console.error(err);
        setError(err.message || "Kuna tatizo la kupakia data");
      } finally {
        setLoading(false);
      }
    }
    fetchPageData();
  }, [leafId]);

  const getProductImage = (item) => {
    const imageMedia = item.product_media?.find(m => m.media_type === 'image');
    if (imageMedia?.media_url) return imageMedia.media_url;
    if (item.cover_image) return item.cover_image;
    return "https://placehold.co/400x400?text=No+Image";
  };

  // ========== SKELETON LOADING ==========
  if (loading) {
    return (
      <div className="cat-page skeleton">
        <Header search="" setSearch={() => {}} />
        <div className="cat-skeleton-wrapper">
          <div className="cat-skeleton-breadcrumb"></div>
          <div className="cat-skeleton-grid">
            {Array.from({ length: isMobile ? 6 : 12 }).map((_, i) => (
              <div key={i} className="cat-skeleton-card">
                <div className="cat-skeleton-img"></div>
                <div className="cat-skeleton-text"></div>
                <div className="cat-skeleton-text short"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cat-page error">
        <Header search="" setSearch={() => {}} />
        <div className="cat-error-container">
          <p className="cat-error-msg">{error}</p>
          <button className="cat-error-btn" onClick={() => window.location.reload()}>
            Jaribu tena
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cat-page">
      <Header search="" setSearch={() => {}} />
      <div className="cat-header-spacer"></div>

      <main className="cat-main">
        {/* Breadcrumb */}
        <nav className="cat-breadcrumb">
          <div className="cat-breadcrumb-items">
            <span className="cat-breadcrumb-link" onClick={() => navigate('/')}>Home</span>
            <ChevronRight className="cat-breadcrumb-icon" />
            <span className="cat-breadcrumb-text">{hierarchy.category}</span>
            <ChevronRight className="cat-breadcrumb-icon" />
            <span className="cat-breadcrumb-text">{hierarchy.sub}</span>
            <ChevronRight className="cat-breadcrumb-icon" />
            <span className="cat-breadcrumb-current">{hierarchy.leaf}</span>
          </div>
        </nav>

        {/* Products Grid using DashboardCard */}
        <div className="cat-products-grid">
          {products.map((item) => (
            <DashboardCard
              key={item.id}
              image={getProductImage(item)}
              title={item.name}
              price={item.price}
              originalPrice={item.original_price}
              isMobile={isMobile}
              onClick={() => navigate(`/product/${item.id}`)}
            />
          ))}
        </div>
      </main>

      <div className="cat-footer-wrapper">
        {!isMobile && <Footer />}
      </div>
    </div>
  );
}