import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../axiosConfig";
import Header from "../components/Header";
import Footer from "../components/Footer";
import DashboardCard from "../components/DashboardCard";
import { Link } from "react-router-dom";
import { ChevronRight, List } from "lucide-react";
//import "../CategoryProducts.css";

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


// 1. Ongeza hizi state karibu na state zingine
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

// 2. Ongeza function ya kuchuja bei (Inaweza kuitwa wakati wa filter)
  const handlePriceFilter = () => {
  // Piga API upya au chuja products zilizopo
  // Kwa sasa tutatumia products zilizopo kwa mfano huu:
  const filtered = products.filter(p => {
    const price = parseFloat(p.price);
    const min = minPrice ? parseFloat(minPrice) : 0;
    const max = maxPrice ? parseFloat(maxPrice) : Infinity;
    return price >= min && price <= max;
  });
  setProducts(filtered); // Hii inabadilisha matokeo
};

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
        // 1. GET LEAF CATEGORY (INABAKI KWA FILTERS NA FALLBACK)
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

        // 🔥 SubId bado inahitajika kwa FILTERS (Sidebar)
        let subId = null;
        if (leaf && leaf.sub_category_id) {
          subId = leaf.sub_category_id;
        }

        // ==========================================
        // 2. GET FILTERS (Leaf categories for this subId)
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
        // 3. GET PRODUCTS (Sasa IMEBORESHA - HAPA NDIO MAJINA YANATOKA)
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
          
          // ✅ Jaza hierarchy kutoka kwenye bidhaa ya kwanza (Ikiwa ipo)
          if (productsData.length > 0) {
            const firstProduct = productsData[0];
            setHierarchy({
              category: firstProduct.category_name || "Marketplace",
              sub: firstProduct.sub_category_name || "General",
              leaf: firstProduct.leaf_category_name || "Products"
            });
            console.log("✅ [Hierarchy] Majina yamewekwa kutoka kwenye bidhaa:", {
              category: firstProduct.category_name,
              sub: firstProduct.sub_category_name,
              leaf: firstProduct.leaf_category_name
            });
          } else if (leaf) {
            // ✅ Fallback: Ikiwa hakuna bidhaa, tumia majina kutoka Leaf Category
            setHierarchy({
              category: "Marketplace",
              sub: "General",
              leaf: leaf?.name || "Products"
            });
          }
          
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

   if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#f8f9fa] dark:bg-black">
        <div className="sticky top-0 z-[100] w-full">
          <Header showBack={true} search="" setSearch={() => {}} />
        </div>
        <div className="flex-1 flex justify-center p-5 pt-[5px] md:pt-[10px]">
          <div className="w-full max-w-[1400px]">
            <main className="flex flex-col lg:flex-row gap-6 md:gap-[30px] mb-10">
              {/* Skeleton Sidebar */}
              <aside className="w-full lg:w-[30%] lg:max-w-[30%] bg-white dark:bg-[#111] rounded-xl p-5 shadow-sm">
                <div className="pb-4 border-b-2 border-[#e9ecef] dark:border-[#1f1f1f] mb-4">
                  <div className="h-6 w-[70%] bg-gray-200 dark:bg-[#1a1a1a] rounded animate-pulse"></div>
                </div>
                <ul className="list-none p-0 m-0 flex flex-col gap-2">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <li key={i} className="py-3 px-4">
                      <div className="h-5 w-[80%] bg-gray-200 dark:bg-[#1a1a1a] rounded animate-pulse"></div>
                    </li>
                  ))}
                </ul>
              </aside>

              {/* Skeleton Content */}
              <div className="flex-1 min-w-0">
                <div className="mb-6 p-4 bg-white dark:bg-[#111] rounded-xl shadow-sm">
                  <div className="h-5 w-[40%] bg-gray-200 dark:bg-[#1a1a1a] rounded animate-pulse"></div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="bg-white dark:bg-[#111] rounded-xl p-4 shadow-sm">
                      <div className="w-full h-[200px] bg-gray-200 dark:bg-[#1a1a1a] rounded-lg mb-4 animate-pulse"></div>
                      <div className="flex flex-col gap-2.5">
                        <div className="h-4 w-[70%] bg-gray-200 dark:bg-[#1a1a1a] rounded animate-pulse"></div>
                        <div className="h-4 w-[50%] bg-gray-200 dark:bg-[#1a1a1a] rounded animate-pulse"></div>
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

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-[#f8f9fa] dark:bg-black">
        <div className="sticky top-0 z-[100] w-full">
          <Header search="" setSearch={() => {}} />
        </div>
        <div className="flex-1 flex justify-center p-5 pt-[80px] md:pt-[100px]">
          <div className="w-full max-w-[1400px]">
            <div className="flex flex-col items-center justify-center p-10 md:p-20 bg-white dark:bg-[#111] rounded-xl text-center">
              <p className="text-lg md:text-xl text-red-500 mb-5">{error}</p>
              <button onClick={() => navigate('/')} className="px-8 py-3 bg-[#3182ce] hover:bg-[#2c5282] text-white border-none rounded-lg text-base cursor-pointer transition-colors">
                Rudi Nyumbani
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa] dark:bg-black font-sans">
      {/* HEADER */}
      <div className="sticky top-0 z-[100] w-full">
          <Header showBack={true} search="" setSearch={() => {}} />
      </div>
      
      {/* MAIN CONTENT */}
      <div className="flex-1 flex justify-center p-2.5 md:p-5  ">
        <div className="w-full max-w-[1400px]">
          <main className="flex flex-col lg:flex-row gap-4 md:gap-[30px] mb-10">
            
            {/* SIDEBAR (Desktop tu) */}
            {!isMobile && (
              <aside className="w-full lg:w-[30%] lg:max-w-[30%] bg-white dark:bg-[#111] rounded-xl p-5 shadow-sm h-fit sticky top-[90px]">
                <div className="flex items-center gap-2.5 font-semibold text-lg pb-4 border-b-2 border-[#e9ecef] dark:border-[#1f1f1f] mb-4 text-[#2d3748] dark:text-white">
                  <List size={16} /> 
                  <span>Kategoria Zote</span>
                </div>

                <ul className="list-none p-0 m-0">
                  <li 
                    className={`py-3 px-4 mb-1 rounded-lg cursor-pointer transition-all duration-300 text-[15px] ${!activeFilterId || activeFilterId === leafId ? 'bg-[#ebf8ff] dark:bg-[#0f172a] text-[#2b6cb0] dark:text-[#60a5fa] font-semibold border-l-[3px] border-[#3182ce]' : 'text-[#4a5568] dark:text-[#94a3b8] hover:bg-[#f7fafc] dark:hover:bg-[#1a1a1a] hover:text-[#2b6cb0] dark:hover:text-[#60a5fa]'}`}
                    onClick={() => setActiveFilterId(leafId)}
                  >
                    {hierarchy.leaf}
                  </li>
                  
                  {filters.map((filter) => (
                    filter.id !== leafId && (
                      <li 
                        key={filter.id}
                        className={`py-3 px-4 mb-1 rounded-lg cursor-pointer transition-all duration-300 text-[15px] ${activeFilterId === filter.id ? 'bg-[#ebf8ff] dark:bg-[#0f172a] text-[#2b6cb0] dark:text-[#60a5fa] font-semibold border-l-[3px] border-[#3182ce]' : 'text-[#4a5568] dark:text-[#94a3b8] hover:bg-[#f7fafc] dark:hover:bg-[#1a1a1a] hover:text-[#2b6cb0] dark:hover:text-[#60a5fa]'}`}
                        onClick={() => setActiveFilterId(filter.id)}
                      >
                        {filter.name}
                      </li>
                    )
                  ))}
                </ul>

                {/* ✅ Filter ya Bei */}
                <div className="mt-6 pt-4 border-t border-[#e9ecef] dark:border-[#1f1f1f]">
                  <div className="text-sm font-semibold text-[#2d3748] dark:text-white mb-3">Bei (TSh)</div>
                  <div className="flex items-center gap-2">
                    <input 
                      type="number" 
                      placeholder="Min" 
                      value={minPrice} 
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-full p-2 border border-[#e2e8f0] dark:border-[#334155] rounded-md text-sm outline-none bg-white dark:bg-[#0f172a] text-black dark:text-white focus:border-[#ff6a00]"
                    />
                    <span className="text-gray-400">-</span>
                    <input 
                      type="number" 
                      placeholder="Max" 
                      value={maxPrice} 
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full p-2 border border-[#e2e8f0] dark:border-[#334155] rounded-md text-sm outline-none bg-white dark:bg-[#0f172a] text-black dark:text-white focus:border-[#ff6a00]"
                    />
                  </div>
                  <button onClick={handlePriceFilter} className="w-full mt-3 py-2 bg-[#3182ce] hover:bg-[#2c5282] text-white border-none rounded-md font-semibold text-sm cursor-pointer transition-colors">
                    Filter
                  </button>
                </div>
              </aside>
            )}

            {/* CONTENT */}
            <div className="flex-1 min-w-0">
              
              {/* Breadcrumb */}
              <nav className="mb-4 md:mb-6 p-2.5 md:px-5 md:py-4 bg-white dark:bg-[#111] rounded-xl shadow-sm">
                <div className="flex items-center gap-1 md:gap-2 text-xs md:text-sm text-[#718096] dark:text-[#94a3b8] flex-nowrap overflow-x-auto whitespace-nowrap [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  <Link to="/" className="text-brand-orange hover:text-[#e55a00] transition-colors">Home</Link>
                  <ChevronRight size={12} className="md:w-3.5 md:h-3.5 shrink-0" />
                  <span>{hierarchy.category}</span>
                  <ChevronRight size={12} className="md:w-3.5 md:h-3.5 shrink-0" />
                  <span>{hierarchy.sub}</span>
                  <ChevronRight size={12} className="md:w-3.5 md:h-3.5 shrink-0" />
                  <span className="text-[#2d3748] dark:text-white font-semibold">{hierarchy.leaf}</span>
                </div>
              </nav>

              {/* Products Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 md:gap-4 lg:gap-[25px]">
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
                  <div className="col-span-full text-center p-10 md:p-[60px_20px] bg-white dark:bg-[#111] rounded-xl text-[#718096] dark:text-[#94a3b8] text-base md:text-lg">
                    <p className="m-0">Hakuna bidhaa katika kategoria hii.</p>
                  </div>
                )}
              </div>
            </div>
          </main>

          {/* FOOTER */}
          <div className=" hidden md:block mt-auto">
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}