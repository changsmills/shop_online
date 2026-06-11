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

  const getProductImage = (item) => {
  const imageMedia = item.product_media?.find(m => m.media_type === 'image');
  if (imageMedia?.media_url) return imageMedia.media_url;
  // Tumia placeholder ya nje inayofanya kazi (hakikisha inapatikana kwenye simu pia)
  return "https://placehold.co/400x400?text=No+Image";
};

  return (
    <div className="category-page-container">
      <Header />
      <div className="header-spacer"></div> 

      <main className="category-main-content">
  <nav className="breadcrumb-nav">
    <div className="breadcrumb-links" style={{
      fontSize: isMobile ? '10px' : '13px',
      gap: isMobile ? '4px' : '8px',
      flexWrap: 'wrap'
    }}>
      <span className="breadcrumb-item clickable" onClick={() => navigate('/')}>Home</span> 
      <ChevronRight size={isMobile ? 10 : 14} />
      <span className="breadcrumb-item">{hierarchy.category}</span> 
      <ChevronRight size={isMobile ? 10 : 14} />
      <span className="breadcrumb-item">{hierarchy.sub}</span> 
      <ChevronRight size={isMobile ? 10 : 14} />
      <span className="breadcrumb-item active">{hierarchy.leaf}</span>
    </div>
  </nav>

  <div className="products-grid" style={{
    display: 'grid',
    gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
    gap: '15px',
    padding: '10px'
  }}>
    {products.map((item) => (
      <div key={item.id} className="product-wrapper" onClick={() => navigate(`/product/${item.id}`)} style={{ textAlign: 'center', cursor: 'pointer' }}>
        <div className="product-image-container" style={{
          width: '100%',
          aspectRatio: '1 / 1',
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1px solid #eee',
          backgroundColor: '#f5f5f5',
          marginBottom: '8px'
        }}>
          <img 
            src={getProductImage(item)} 
            alt={item.name}
            loading="lazy"
            onError={(e) => { e.target.src = "https://placehold.co/400x400?text=No+Image"; }}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
          />
        </div>
        <div className="product-info">
          <p className="product-name" style={{ fontSize: isMobile ? '12px' : '14px', fontWeight: '500', margin: '0 0 4px 0' }}>{item.name}</p>
          {item.price && <p className="product-price" style={{ fontSize: isMobile ? '12px' : '14px', color: '#ff6600', fontWeight: 'bold', margin: 0 }}>TSh {Number(item.price).toLocaleString()}</p>}
        </div>
      </div>
    ))}
  </div>
</main>

      {!isMobile && <Footer />}
    </div>
  );
}