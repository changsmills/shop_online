import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from "../supabaseClient";
import { Globe } from 'lucide-react';

// --- IMPORT ZA COMPONENTS ZAKO ---
import SearchBar from '../components/SearchBar';
import UserTools from '../components/UserTools';
import "../SearchResults.css";

export default function SearchResults({ session }) {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  
  // State
  const [search, setSearch] = useState(initialQuery);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [categoryId, setCategoryId] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  
  const navigate = useNavigate();

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

useEffect(() => {
  const handleResize = () => setIsMobile(window.innerWidth < 768);
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);

  const lastProductRef = useRef();
  
  const PRODUCTS_PER_PAGE = 50;

  // STEP 1: Tafuta Category ID kutoka kwa jina la category
  const fetchCategoryId = useCallback(async (categoryQuery) => {
    if (!categoryQuery) return null;
    
    try {
      const { data, error } = await supabase
        .from('leaf_categories')
        .select('id, name')
        .ilike('name', `%${categoryQuery}%`)
        .maybeSingle();

      if (error) {
        console.error("Error finding category:", error);
        return null;
      }
      
      if (data) {
        console.log("Category found:", data);
        setCategoryName(data.name);
        return data.id;
      }
      
      console.log("No category found for:", categoryQuery);
      return null;
    } catch (err) {
      console.error("Network error:", err);
      return null;
    }
  }, []);

  // STEP 2: Fetch products kwa kutumia Category ID (na pagination)
  const fetchProductsByCategoryId = useCallback(async (catId, pageNum = 1) => {
    if (!catId) return [];
    
    const from = (pageNum - 1) * PRODUCTS_PER_PAGE;
    const to = from + PRODUCTS_PER_PAGE - 1;
    
    try {
      const { data, error, count } = await supabase
        .from("products_engines")
        .select(`
          id, 
          name, 
          price, 
          cover_image, 
          description,
          leaf_category_id
        `, { count: 'exact' })
        .eq('leaf_category_id', catId)  // ← HAPA NDIO TUNAPITISHA ID
        .range(from, to)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching products:", error);
        return [];
      }
      
      // Check kama kuna products zaidi
      const totalFetched = pageNum * PRODUCTS_PER_PAGE;
      setHasMore(totalFetched < (count || 0));
      
      return data || [];
    } catch (err) {
      console.error("Network error:", err);
      return [];
    }
  }, []);

  // STEP 3: Main search - inapobadilika initialQuery
  useEffect(() => {
    // Ndani ya useEffect ya 'performSearch' kwenye SearchResults.js:

const performSearch = async () => {
  if (!initialQuery) {
    setProducts([]);
    setLoading(false);
    return;
  }
  
  setLoading(true);
  
  // 1. Tafuta kategoria kwanza (ili uweke title nzuri)
  const foundCategoryId = await fetchCategoryId(initialQuery);
  setCategoryId(foundCategoryId);
  
  // 2. Query ya nguvu: Tafuta bidhaa zenye jina hilo AU bidhaa zilizo kwenye kategoria hiyo
  const { data, error } = await supabase
    .from("products_engines")
    .select("id, name, price, cover_image, leaf_category_id")
    .or(`name.ilike.%${initialQuery}%,leaf_category_id.eq.${foundCategoryId || '00000000-0000-0000-0000-000000000000'}`)
    .range(0, PRODUCTS_PER_PAGE - 1)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Search Error:", error);
  } else {
    setProducts(data || []);
  }
  
  setLoading(false);
};
    
    performSearch();
  }, [initialQuery, fetchCategoryId, fetchProductsByCategoryId]);

  // STEP 4: Load more products (Infinite Scroll)
  const loadMoreProducts = useCallback(async () => {
    if (loadingMore || !hasMore || !categoryId) return;
    
    setLoadingMore(true);
    const nextPage = page + 1;
    const moreProducts = await fetchProductsByCategoryId(categoryId, nextPage);
    
    if (moreProducts.length > 0) {
      setProducts(prev => [...prev, ...moreProducts]);
      setPage(nextPage);
    }
    
    setLoadingMore(false);
  }, [loadingMore, hasMore, categoryId, page, fetchProductsByCategoryId]);

  // STEP 5: Intersection Observer kwa infinite scroll
  useEffect(() => {
    if (loading || !hasMore) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore && hasMore) {
          loadMoreProducts();
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );
    
    if (lastProductRef.current) {
      observer.observe(lastProductRef.current);
    }
    
    return () => {
      if (lastProductRef.current) {
        observer.unobserve(lastProductRef.current);
      }
    };
  }, [loading, hasMore, loadingMore, loadMoreProducts, products]);

  // Update search state pindi URL inapobadilika
  useEffect(() => {
    setSearch(initialQuery);
  }, [initialQuery]);

  return (
    <div className="alibaba-container">
      {/* HEADER */}
      <header className="alibaba-header">
        <div className="header-wrapper">
          
          <Link to="/" className="skyfall-logo">
            Skyfall<span>.com</span>
          </Link>
          
          <div className="main-search-area">
            <SearchBar search={search} setSearch={setSearch} />
          </div>

          <div className="header-right-actions">
  {!isMobile && (
    <div className="nav-action-item mini-lang">
      <Globe size={14} />
      <span className="mini-text">TZS</span>
    </div>
  )}
  
  {!isMobile && (
    <div className="nav-action-item">
      <UserTools session={session} />
    </div>
  )}
</div>

        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="alibaba-main">
        <div className="results-info-bar">

<div className="deep-search-label">
  <span className="sparkle">✦</span> 
  {products.length > 0 ? (
    categoryName ? (
      <>Bidhaa katika kategoria ya <strong>"{categoryName}"</strong></>
    ) : (
      <>Matokeo ya utafutaji wa <strong>"{initialQuery}"</strong></>
    )
  ) : (
    <>Samahani, hatukupata bidhaa kwa "{initialQuery}"</>
  )}
</div>


          {products.length > 0 && (
            <div className="results-count">
              {products.length}+ products found
            </div>
          )}
        </div>

        {loading ? (
          <div className="loading-state"><div className="loader"></div></div>
        ) : (
          <>
            <div className="alibaba-grid">
              {products.length > 0 ? (
                products.map((product, index) => (
                  <div 
                    key={product.id} 
                    className="alibaba-card"
                    ref={index === products.length - 1 ? lastProductRef : null}
                  >
                    <Link to={`/product/${product.id}`} className="card-link">
                      <div className="card-image">
                        <img 
                          src={product.cover_image || '/placeholder-image.jpg'} 
                          alt={product.name}
                          onError={(e) => {
                            e.target.src = '/placeholder-image.jpg';
                          }}
                        />
                      </div>
                      <div className="card-body">
                        <h3 className="product-title">{product.name}</h3>
                        <div className="price-tag">
                          <span className="currency">TSH</span>
                          <span className="amount">{Number(product.price).toLocaleString()}</span>
                        </div>
                        <p className="moq-info">Min. Order: 1 piece</p>
                        <div className="card-footer">
                          <span className="category-tag">{categoryName}</span>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))
              ) : (
                <div className="not-found">
                  <p>Samahani, hatukupata bidhaa zozote katika kategoria ya "{initialQuery}"</p>
                  <p className="suggestion-text">
                    Hakikisha umeandika jina la kategoria sahihi au jaribu kutafuta kategoria nyingine.
                  </p>
                  <button 
                    onClick={() => navigate('/')}
                    className="browse-all-btn"
                  >
                    Browse All Products
                  </button>
                </div>
              )}
            </div>
            
            {/* Loading more indicator */}
            {loadingMore && (
              <div className="loading-more">
                <div className="loader-small"></div>
                <span>Loading more products...</span>
              </div>
            )}
            
            {/* End of results message */}
            {!hasMore && products.length > 0 && (
              <div className="end-of-results">
                <p>✨ Umefika mwisho wa matokeo ✨</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}