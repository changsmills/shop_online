import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { CheckCircle, Star, Filter, ChevronRight, ChevronLeft, Loader2, PackageOpen } from "lucide-react";
import CategoryCard from "../components/CategoryCard";
import "./CategoryProducts.css"; // Hakikisha umeunda hii file

export default function CategoryProducts() {
  const { leafId } = useParams();
  const [products, setProducts] = useState([]);
  const [hierarchy, setHierarchy] = useState({ category: "Marketplace", sub: "General", leaf: "Products" });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

        <div className="content-layout">

          <section className="products-display-area">
            {loading ? (
              <div className="loading-container">
                <Loader2 className="animate-spin" size={50} color="#ff6600" strokeWidth={3} />
                <p>Fetching products...</p>
              </div>
            ) : products.length > 0 ? (
              <div className="products-grid">
                {products.map((item) => (
                  <CategoryCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <PackageOpen size={80} color="#ddd" className="empty-icon" />
                <h2>No products found!</h2>
                <p>Samahani, kategoria ya "{hierarchy.leaf}" haina bidhaa kwa sasa.</p>
                <button className="go-back-btn" onClick={() => navigate(-1)}>
                  Go Back
                </button>
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}