import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ChevronRight, Loader2, PackageOpen } from "lucide-react";

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

  useEffect(() => {
    console.log("Products loaded:", products.length);
    if (products.length > 0) {
      console.log("Sample cover_image:", products[0].cover_image);
    }
  }, [products]);

  if (loading) {
    return (
      <div style={{ backgroundColor: '#f7f8fa', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header search="" setSearch={() => {}} />
        <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
            <Loader2 className="animate-spin" size={40} color="#ff6600" />
            <p style={{ marginLeft: '12px', color: '#666' }}>Inapakia...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ backgroundColor: '#f7f8fa', minHeight: '100vh' }}>
        <Header search="" setSearch={() => {}} />
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <p style={{ color: '#dc2626' }}>{error}</p>
          <button onClick={() => window.location.reload()} style={{ marginTop: '16px', padding: '8px 20px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '8px' }}>Jaribu tena</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#f7f8fa', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header search="" setSearch={() => {}} />
      <div style={{ height: isMobile ? '10px' : '100px' }}></div>

      <main style={{ flex: 1, maxWidth: '1400px', margin: '0 auto', width: '100%', padding: '0 20px' }}>
        {/* Breadcrumb */}
        <nav style={{ marginBottom: '16px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: isMobile ? '4px' : '8px',
            fontSize: isMobile ? '10px' : '13px'
          }}>
            <span style={{ cursor: 'pointer', color: '#333' }} onClick={() => navigate('/')}>Home</span>
            <ChevronRight size={isMobile ? 10 : 14} />
            <span style={{ color: '#666' }}>{hierarchy.category}</span>
            <ChevronRight size={isMobile ? 10 : 14} />
            <span style={{ color: '#666' }}>{hierarchy.sub}</span>
            <ChevronRight size={isMobile ? 10 : 14} />
            <span style={{ color: '#ff6600', fontWeight: 'bold' }}>{hierarchy.leaf}</span>
          </div>
        </nav>

        {/* Products Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
          gap: isMobile ? '10px' : '15px',
          padding: isMobile ? '8px' : '10px'
        }}>
          {products.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(`/product/${item.id}`)}
              style={{ textAlign: 'center', cursor: 'pointer' }}
            >
              {/* Image Container - RESPONSIVE: 100% width, aspect-ratio 1:1, no fixed px */}
              <div style={{
                width: '100%',
                aspectRatio: '1 / 1',
                borderRadius: isMobile ? '10px' : '12px',
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
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                    display: 'block'
                  }}
                />
              </div>

              {/* Product Info */}
              <div>
                <p style={{
                  fontSize: isMobile ? '12px' : '14px',
                  fontWeight: '500',
                  margin: '0 0 4px 0',
                  color: '#333',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>{item.name}</p>
                {item.price && (
                  <p style={{
                    fontSize: isMobile ? '11px' : '13px',
                    color: '#ff6600',
                    fontWeight: 'bold',
                    margin: 0
                  }}>
                    TSh {Number(item.price).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      {!isMobile && <Footer />}
    </div>
  );
}