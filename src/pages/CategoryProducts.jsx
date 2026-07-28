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
  const [filters, setFilters] = useState([]); // 🔥 Kategoria za upande wa kushoto
  const [activeFilterId, setActiveFilterId] = useState(null); // 🔥 Kategoria iliyochaguliwa kwenye Filter
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

   // ============================================
  // 1. PATA DATA (HIERARCHY, FILTERS, PRODUCTS)
  // ============================================
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
        console.log("📌 1. Inajarbu kupata Leaf Category kwa ID:", leafId);
        const leafRes = await api.get(`/leaf-categories/${leafId}/`);
        const leaf = leafRes.data;
        console.log("✅ Leaf category imepatikana:", leaf);

        let mainCatName = "Marketplace";
        let subName = "General";
        let subId = null;

        if (leaf && leaf.sub_category_id) {
          subId = leaf.sub_category_id;
          console.log("📌 2. Inajarbu kupata Subcategory kwa ID:", subId);
          const subRes = await api.get(`/subcategories/${subId}/`);
          const subData = subRes.data;
          console.log("✅ Subcategory imepatikana:", subData);
          
          if (subData) {
            subName = subData.name;
            if (subData.category_id) {
              console.log("📌 3. Inajarbu kupata Main Category kwa ID:", subData.category_id);
              const mainRes = await api.get(`/categories/${subData.category_id}/`);
              if (mainRes.data) mainCatName = mainRes.data.name;
              console.log("✅ Main category imepatikana:", mainCatName);
            }
          }
        }

        setHierarchy({
          category: mainCatName,
          sub: subName,
          leaf: leaf?.name || "Products"
        });

        // 🔥 2. Pata Filters
        if (subId) {
          console.log("📌 4. Inajarbu kupata Filters (Leaf categories kwa subId):", subId);
          const filtersRes = await api.get('/leaf-categories/', {
            params: { sub_category_id: subId }
          });
          const allFilters = filtersRes.data.results || filtersRes.data || [];
          setFilters(allFilters);
          console.log(`✅ ${allFilters.length} Filters zimepatikana.`);
        }

        // 🔥 3. Pata Products
        const currentFilterId = activeFilterId || leafId;
        console.log("📌 5. Inajarbu kupata Products kwa leaf_category ID:", currentFilterId);
        const productsRes = await api.get('/products/', {
          params: { 
            leaf_category: currentFilterId, 
            ordering: '-created_at' 
          }
        });

        const productsData = productsRes.data.results || productsRes.data || [];
        setProducts(productsData);
        console.log(`✅ ${productsData.length} Products zimepatikana.`);

      } catch (err) {
        console.error("❌ ERROR IMEJITOKEZA! Tafadhali angalia hapa chini:");

        // 🔥 Hapa ndipo tunapotambua chanzo halisi cha error!
        if (err.response) {
          // Server ilijibu lakini na code ya error (404, 500, n.k)
          console.error("📌 Server Status Code:", err.response.status);
          console.error("📌 API Endpoint iliyoombwa:", err.config?.url);
          console.error("📌 Error Message kutoka Backend:", err.response.data);
          
          setError(`Hitilafu kutoka server: ${err.response.status} - ${err.response.data?.detail || err.message}`);
        } else if (err.request) {
          // Ombi lilitumwa lakini hakuna jibu (Backend haijaanza / Network issue)
          console.error("📌 Ombi lilitumwa, lakini hakuna jibu kutoka Backend.");
          console.error("📌 Request object:", err.request);
          setError("Imeshindwa kuungana na server. Hakikisha Django backend imewashwa (python manage.py runserver).");
        } else {
          // Kitu kingine (kama msimbo wa JS umepasuka kabla ya kuomba API)
          console.error("📌 Error isiyojulikana (Labda logic):", err.message);
          setError("Kuna tatizo la ndani la msimbo. Angalia console.");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchPageData();
  }, [leafId, activeFilterId]);

  const getProductImage = (item) => {
    if (item.cover_image) return item.cover_image;
    return "https://placehold.co/400x400?text=No+Image";
  };

  if (loading) {
    return (
      <div className="cat-page skeleton">
        <div className="sticky-header"><Header search="" setSearch={() => {}} /></div>
        <div className="cat-skeleton-wrapper"><div className="cat-skeleton-grid">...</div></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cat-page error">
        <div className="sticky-header"><Header search="" setSearch={() => {}} /></div>
        <div className="cat-error-container"><p className="cat-error-msg">{error}</p></div>
      </div>
    );
  }

  return (
    <div className="cat-page">
      <div className="sticky-header">
        <Header search="" setSearch={() => {}} />
      </div>
      
      <div className="main-content">
        <div className="content-container-simple">
          
          <main className="cat-main-layout">
            {/* ============================================ */}
            {/* 🔥 SIDEBAR - FILTERS (Upande wa Kushoto)     */}
            {/* ============================================ */}
            {!isMobile && (
              <aside className="cat-filter-sidebar">
                <div className="filter-header">
                  <List size={16} /> 
                  <span>Kategoria Zote</span>
                </div>
                <ul className="filter-list">
                  {/* 🔥 Kategoria kuu (Iliyo mwanzo) */}
                  <li 
                    className={`filter-item ${!activeFilterId || activeFilterId === leafId ? 'active' : ''}`}
                    onClick={() => setActiveFilterId(leafId)}
                  >
                    {hierarchy.leaf}
                  </li>
                  
                  {/* 🔥 Kategoria nyingine zinazopatikana (Filters) */}
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

            {/* ============================================ */}
            {/* 🔥 CONTENT - GRID YA BIDHAA (Upande wa Kulia)*/}
            {/* ============================================ */}
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
            </div>
          </main>

          <div className="footer-wrapper">
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}