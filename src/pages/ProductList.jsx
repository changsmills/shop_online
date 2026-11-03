import { useMemo } from "react";
import api from "../axiosConfig";
import ProductCard from "../components/ProductCard";
import { useInfiniteQuery } from '@tanstack/react-query'; // 1. Ingiza useInfiniteQuery

const ITEMS_PER_PAGE = 30;

// 2. Function ya kuchukua data (Inatengeneza params zote zako)
const fetchProductsData = async ({ pageParam = 0, queryKey }) => {
  const [_, paramsObj] = queryKey;
  const { 
    storeId, search, categoryId, leafId, subId, parentId, 
    cleanSection, sortBy, order, minPrice, maxPrice, filterType, priorityId 
  } = paramsObj;

  const params = {};

  // 1. Filtering kwa Store na Category
  if (storeId) params.store_id = storeId;

  // 🔥 FALLBACK LOGIC: Leaf -> Sub -> Parent -> All
  if (leafId) {
    params.leaf_category = leafId;
  } else if (subId) {
    params.sub_category = subId;
  } else if (parentId) {
    params.parent_category = parentId;
  } else if (categoryId && categoryId !== 'all' && categoryId !== 'All') {
    params.parent_category = categoryId;
  }

  // 2. Search
  if (search && search.trim()) {
    params.search = search.trim();
  }

  // 3. Sorting & Section Logic
  let ordering = '';
  if (cleanSection === "Top Deals") ordering = '-created_at';
  else if (cleanSection === "New Arrivals") ordering = '-created_at';
  else if (cleanSection === "Top Rankings") ordering = '-order_count';
  else if (cleanSection === "Trending" || cleanSection === "Inayovuma Sasa") ordering = '-views';
  else if (cleanSection === "Flash Sale") {
    params.is_flash_sale = true;
    params.sale_end_date__gte = new Date().toISOString();
    ordering = '-created_at';
  } else if (cleanSection === "Featured") {
    params.is_featured = true;
    ordering = '-created_at';
  } else if (cleanSection === "Just For You") {
    ordering = '-created_at';
  } else {
    const validSortColumns = ["created_at", "price", "name", "views", "order_count", "average_rating"];
    const sortColumn = validSortColumns.includes(sortBy) ? sortBy : "created_at";
    ordering = order === "asc" ? sortColumn : `-${sortColumn}`;
  }
  if (ordering) params.ordering = ordering;

  // 4. Price filters
  if (minPrice > 0) params.price__gte = minPrice;
  if (maxPrice !== Infinity && maxPrice > 0) params.price__lte = maxPrice;

  // 5. Other filters
  if (filterType === "in_stock") params.stock_quantity__gt = 0;
  else if (filterType === "retail") params.is_retail = true;
  else if (filterType === "wholesale") params.is_wholesale = true;

  // 6. Pagination
  params.limit = ITEMS_PER_PAGE;
  params.offset = pageParam * ITEMS_PER_PAGE;

  // Tuma Request
  const response = await api.get('/products/', { params });
  let data = response.data?.results || response.data || [];

  // 🔥 SANITIZE DATA
  let sanitizedData = data.map(p => {
    const beiKubwa = parseFloat(p.price) || 0;
    const beiYaOfa = parseFloat(p.original_price) || 0;
    const discountPercent = (beiKubwa > beiYaOfa && beiYaOfa > 0) 
      ? Math.round(((beiKubwa - beiYaOfa) / beiKubwa) * 100) 
      : 0;
    return {
      ...p,
      image: p.cover_image_url || p.cover_image || "/images/placeholder.png",
      discount: discountPercent
    };
  });

  // 🔥 FILTER YA TOP DEALS
  if (cleanSection === "Top Deals" || cleanSection === "top-deals" || cleanSection === "Top deals") {
    sanitizedData = sanitizedData.filter(p => {
      const price = parseFloat(p.price) || 0;
      const originalPrice = parseFloat(p.original_price) || 0;
      return originalPrice > 0 && originalPrice < price;
    });
  }

  // 🔥 FILTER YA KUTENGANISHA SECTIONS
  const isTopDealsSection = cleanSection === "Top Deals" || cleanSection === "top-deals" || cleanSection === "Top deals";
  const isRecentlyViewedSection = cleanSection === "Recently Viewed" || cleanSection === "recently-viewed" || cleanSection === "recently_viewed";
        
  if (!isTopDealsSection && !isRecentlyViewedSection) {
    sanitizedData = sanitizedData.filter(p => {
      const price = parseFloat(p.price) || 0;
      const originalPrice = parseFloat(p.original_price) || 0;
      const isDiscounted = originalPrice > 0 && originalPrice < price;
      return !isDiscounted;
    });
  }

  // 🔥 Priority Item
  if (priorityId && pageParam === 0) {
    const priorityItem = sanitizedData.find(p => p.id === priorityId);
    if (priorityItem) {
      const otherItems = sanitizedData.filter(p => p.id !== priorityId);
      sanitizedData = [priorityItem, ...otherItems]; 
    }
  }

  // Tunarudisha data pamoja na taarifa kama kuna zaidi
  return {
    data: sanitizedData,
    nextPage: data.length === ITEMS_PER_PAGE ? pageParam + 1 : undefined,
  };
};

export default function ProductList({ 
  storeId = null,
  search,
  category = "All", 
  categoryId = null,
  leafId = null,
  subId = null,
  parentId = null,
  section = "",      
  priorityId = null, 
  sortBy = "created_at", 
  order = "desc",
  minPrice = 0, 
  maxPrice = Infinity, 
  limit = null,
  filterType = null,
  isMobile = false,
  onLoad 
}) {
  
  // 🔥 Safisha section mara moja
  const cleanSection = useMemo(() => {
    if (!section) return "";
    return section.split(' in ')[0].trim();
  }, [section]);

  // 3. Tumia useInfiniteQuery
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error
  } = useInfiniteQuery({
    queryKey: ['productsList', { 
      storeId, search, categoryId, leafId, subId, parentId, 
      cleanSection, sortBy, order, minPrice, maxPrice, filterType, priorityId 
    }],
    queryFn: fetchProductsData,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    staleTime: 1000 * 60 * 5, // Cache kwa dakika 5
  });

  // Gabanya data zote zilizochukuliwa kuwa orodha moja
  const allProducts = useMemo(() => {
    return data?.pages.flatMap(page => page.data) || [];
  }, [data]);

  // 🔥 FILTERED PRODUCTS (Kama unataka limit au local search)
  const filteredProducts = useMemo(() => {
    let result = allProducts;
    if (search && !isLoading && allProducts.length > 0) {
      result = result.filter(p => 
        p.name?.toLowerCase().includes(search.toLowerCase())
      );
    }
    return limit ? result.slice(0, limit) : result;
  }, [allProducts, search, limit, isLoading]);

  // 4. Infinite Scroll Logic
  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 500 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  };

  // 5. Add/Remove scroll listener
  // Tumeongeza setTimeout ndogo ili kuzuia kuita fetchNextPage mara nyingi
  useMemo(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasNextPage, isFetchingNextPage]);

  // 🔥 ERROR
  if (error && allProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="text-5xl mb-4">⚠️</div>
        <h3 className="text-xl font-semibold mb-2">Hitilafu Imetokea</h3>
        <p className="text-gray-500 mb-4">{error.message}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Jaribu Tena
        </button>
      </div>
    );
  }

  // 🔥 SKELETON (Inaonekana tu kama hakuna bidhaa kabisa)
  if (isLoading && allProducts.length === 0) {
    return (
      <div className="w-full">
        <div className={`grid gap-4 w-full ${isMobile ? 'grid-cols-2 px-0' : 'grid-cols-6 px-4'}`}>
          {Array.from({ length: isMobile ? 4 : 12 }).map((_, index) => (
            <div key={index} className="rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 min-h-[220px] flex flex-col animate-pulse">
              <div className="h-[150px] bg-gray-200 dark:bg-gray-700"></div>
              <div className="p-3">
                <div className="h-[14px] bg-gray-200 dark:bg-gray-700 rounded mb-2 w-[80%]"></div>
                <div className="h-[12px] bg-gray-200 dark:bg-gray-700 rounded mb-2 w-[60%]"></div>
                <div className="h-[12px] bg-gray-200 dark:bg-gray-700 rounded w-[40%]"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 🔥 EMPTY STATE (Inaonekana tu kama hakuna bidhaa na hakuna loading)
  if (!isLoading && allProducts.length === 0 && !error) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20 px-4">
        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full mb-6">
          <span className="text-5xl">📦</span>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Bidhaa Hazijapatikana
        </h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-sm text-center mb-8">
          Samahani, kwa sasa hatuna bidhaa kwenye kategoria ya 
          <span className="font-semibold text-orange-600"> "{category}"</span>. 
          Tunaongeza bidhaa mpya kila siku, tafadhali rudi baadaye!
        </p>
        <button 
          onClick={() => window.location.href = '/'}
          className="flex items-center gap-2 px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-black font-medium rounded-lg hover:bg-black dark:hover:bg-gray-200 transition-all active:scale-95 shadow-lg"
        >
          <span>←</span> Rudi Kwenye Duka
        </button>
      </div>
    );
  }

  // 🔥 MAIN RENDER
  return (
    <div className="w-full">
      <div className={`grid gap-4 w-full ${isMobile ? 'grid-cols-2 px-0' : 'grid-cols-6 px-4'}`}>
        {filteredProducts.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product}
            isMobile={isMobile}
            isPriority={product.id === priorityId}
          />
        ))}
      </div>

      {/* Loading spinner ya chini */}
      {isFetchingNextPage && (
        <div className="flex justify-center items-center py-8 gap-3">
          <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Inavuta bidhaa zaidi...</p>
        </div>
      )}
      
      {/* Mwisho wa bidhaa */}
      {!hasNextPage && allProducts.length > 0 && (
        <div className="flex items-center justify-center gap-4 my-10">
          <hr className="flex-1 border-gray-200 dark:border-gray-700" />
          <span className="text-gray-400 dark:text-gray-500 text-sm">✨ Umeifikia mwisho wa bidhaa ✨</span>
          <hr className="flex-1 border-gray-200 dark:border-gray-700" />
        </div>
      )}
    </div>
  );
}