import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../axiosConfig";
import Header from "../components/Header";
import Footer from "../components/Footer";
import DashboardCard from "../components/DashboardCard";
import { ChevronRight, List } from "lucide-react";
import "../CategoryProducts.css";

export default function CategoryProducts() {
  const { leafId } = useParams();
  const navigate = useNavigate();
  
  const [products, setProducts] = useState([]);
  const [hierarchy, setHierarchy] = useState({ category: "Marketplace", sub: "General", leaf: "Products" });
  const [filters, setFilters] = useState([]);
  const [activeFilterId, setActiveFilterId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // ========== RESPONSIVE ==========
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ========== CHECK LEAF ID ==========
  useEffect(() => {
    if (!leafId) {
      console.error("❌ leafId is undefined! Redirecting to homepage...");
      navigate('/');
    }
  }, [leafId, navigate]);

  // ========== FETCH DATA ==========
  useEffect(() => {
    async function fetchPageData() {
      if (!leafId) {
        setError("Leaf ID haipo - URL inahitaji ID ya category");
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        // ==========================================
        // 1. GET LEAF CATEGORY
        // ==========================================
        let leaf = null;
        try {
          const leafRes = await api.get(`/leaf-categories/${leafId}/`);
          leaf = leafRes.data;
          console.log("✅ [Leaf] Leaf data retrieved:", leaf);
        } catch (leafErr) {
          console.error("❌ [Leaf] Failed to fetch leaf category:", leafErr.response?.data || leafErr.message);
          if (leafErr.response?.status === 404) {
            setError(`Category ${leafId} haipo kwenye mfumo.`);
          } else {
            setError("Imeshindwa kupata kategoria ya leaf.");
          }
          setLoading(false);
          return;
        }

        let mainCatName = "Marketplace";
        let subName = "General";
        let subId = null;

        if (leaf && leaf.sub_category_id) {
          subId = leaf.sub_category_id;

          // ==========================================
          // 2. GET SUB CATEGORY
          // ==========================================
          let subData = null;
          try {
            const subRes = await api.get(`/subcategories/${subId}/`);
            subData = subRes.data;
            console.log("✅ [Sub] Subcategory data retrieved:", subData);
          } catch (subErr) {
            console.error("❌ [Sub] Failed to fetch subcategory:", subErr.response?.data || subErr.message);
            // Continue with defaults
          }
          
          if (subData) {
            subName = subData.name;
            if (subData.category_id) {
              // ==========================================
              // 3. GET MAIN CATEGORY
              // ==========================================
              try {
                const mainRes = await api.get(`/categories/${subData.category_id}/`);
                if (mainRes.data) {
                  mainCatName = mainRes.data.name;
                  console.log("✅ [Main] Main category data retrieved:", mainRes.data);
                }
              } catch (mainErr) {
                console.error("❌ [Main] Failed to fetch main category:", mainErr.response?.data || mainErr.message);
                // Continue with default
              }
            }
          }
        }

        setHierarchy({
          category: mainCatName,
          sub: subName,
          leaf: leaf?.name || "Products"
        });

        // ==========================================
        // 4. GET FILTERS (Leaf categories for this subId)
        // ==========================================
        if (subId) {
          try {
            const filtersRes = await api.get('/leaf-categories/', {
              params: { sub_category_id: subId }
            });
            const allFilters = filtersRes.data.results || filtersRes.data || [];
            setFilters(allFilters);
            console.log(`✅ [Filters] ${allFilters.length} filters retrieved`);
          } catch (filterErr) {
            console.error("❌ [Filters] Failed to fetch filters:", filterErr.response?.data || filterErr.message);
            // Continue without filters
          }
        }

        // ==========================================
        // 5. GET PRODUCTS
        // ==========================================
        const currentFilterId = activeFilterId || leafId;
        console.log(`🔍 [Products] Fetching products for leaf_category_id: ${currentFilterId}`);

        let productsData = [];
        try {
          const productsRes = await api.get('/products/', {
            params: { 
              leaf_category: currentFilterId,
              ordering: '-created_at' 
            }
          });
          productsData = productsRes.data.results || productsRes.data || [];
          console.log(`✅ [Products] ${productsData.length} products retrieved`);
          console.log("📦 [Products] Product data:", productsData);
        } catch (prodErr) {
          console.error("❌ [Products] Failed to fetch products:", prodErr.response?.data || prodErr.message);
          if (prodErr.response?.status === 404) {
            setError(`Hakuna bidhaa zilizopatikana kwa kategoria hii.`);
          } else {
            setError("Imeshindwa kupata bidhaa za kategoria hii.");
          }
          setLoading(false);
          return;
        }

        setProducts(productsData);

      } catch (err) {
        console.error("❌ [General] Unexpected error in fetchPageData:", err);
        setError("Kuna tatizo la jumla la mtandao au msimbo.");
      } finally {
        setLoading(false);
      }
    }
    fetchPageData();
  }, [leafId, activeFilterId]);

  // ========== GET IMAGE ==========
  const getProductImage = (item) => {
    if (item.cover_image_url) return item.cover_image_url;
    if (item.cover_image) return item.cover_image;
    return "https://placehold.co/400x400?text=No+Image";
  };

  // ========== SKELETON LOADING ==========
  if (loading) {
    return (
      <div className="cat-page">
        <div className="sticky-header">
          <Header search="" setSearch={() => {}} />
        </div>
        <div className="main-content">
          <div className="content-container-simple">
            <main className="cat-main-layout">
              {/* Skeleton Sidebar */}
              <aside className="cat-filter-sidebar skeleton-sidebar">
                <div className="filter-header skeleton-header">
                  <div className="skeleton-line" style={{ width: '70%', height: '24px' }}></div>
                </div>
                <ul className="filter-list">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <li key={i} className="filter-item skeleton-item">
                      <div className="skeleton-line" style={{ width: '80%', height: '20px' }}></div>
                    </li>
                  ))}
                </ul>
              </aside>

              {/* Skeleton Content */}
              <div className="cat-products-content">
                <div className="cat-breadcrumb skeleton-breadcrumb">
                  <div className="skeleton-line" style={{ width: '40%', height: '20px' }}></div>
                </div>
                <div className="cat-products-grid skeleton-grid">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="skeleton-card">
                      <div className="skeleton-image"></div>
                      <div className="skeleton-text">
                        <div className="skeleton-line" style={{ width: '70%' }}></div>
                        <div className="skeleton-line" style={{ width: '50%' }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }

  // ========== ERROR ==========
  if (error) {
    return (
      <div className="cat-page error">
        <div className="sticky-header">
          <Header search="" setSearch={() => {}} />
        </div>
        <div className="main-content">
          <div className="content-container-simple">
            <div className="cat-error-container">
              <p className="cat-error-msg">{error}</p>
              <button onClick={() => navigate('/')} className="error-back-btn">
                Rudi Nyumbani
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ========== RENDER ==========
  return (
    <div className="cat-page">
      {/* HEADER - Full width */}
      <div className="sticky-header">
        <Header search="" setSearch={() => {}} />
      </div>
      
      {/* MAIN CONTENT - Flexbox Layout */}
      <div className="main-content">
        <div className="content-container-simple">
          <main className="cat-main-layout">
            
            {/* SIDEBAR - 30% upande wa kushoto */}
            {!isMobile && (
              <aside className="cat-filter-sidebar">
                <div className="filter-header">
                  <List size={16} /> 
                  <span>Kategoria Zote</span>
                </div>
                <ul className="filter-list">
                  {/* Current category */}
                  <li 
                    className={`filter-item ${!activeFilterId || activeFilterId === leafId ? 'active' : ''}`}
                    onClick={() => setActiveFilterId(leafId)}
                  >
                    {hierarchy.leaf}
                  </li>
                  
                  {/* Other categories */}
                  {filters.map((filter) => (
                    filter.id !== leafId && (
                      <li 
                        key={filter.id}
                        className={`filter-item ${activeFilterId === filter.id ? 'active' : ''}`}
                        onClick={() => setActiveFilterId(filter.id)}
                      >
                        {filter.name}
                      </li>
                    )
                  ))}
                </ul>
              </aside>
            )}

            {/* CONTENT - 70% upande wa kulia */}
            <div className="cat-products-content">
              
              {/* Breadcrumb */}
              <nav className="cat-breadcrumb">
                <div className="cat-breadcrumb-items">
                  <span onClick={() => navigate('/')}>Home</span>
                  <ChevronRight size={14} />
                  <span>{hierarchy.category}</span>
                  <ChevronRight size={14} />
                  <span>{hierarchy.sub}</span>
                  <ChevronRight size={14} />
                  <span className="current">{hierarchy.leaf}</span>
                </div>
              </nav>

              {/* Products Grid */}
              <div className="cat-products-grid">
                {products.length > 0 ? (
                  products.map((item) => (
                    <DashboardCard
                      key={item.id}
                      image={getProductImage(item)}
                      title={item.name}
                      price={item.price}
                      originalPrice={item.original_price}
                      isMobile={isMobile}
                      onClick={() => navigate(`/product/${item.id}`)}
                    />
                  ))
                ) : (
                  <div className="no-products-msg">
                    <p>Hakuna bidhaa katika kategoria hii.</p>
                  </div>
                )}
              </div>
            </div>
          </main>

          {/* FOOTER - Full width */}
          <div className="footer-wrapper">
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}