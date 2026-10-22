// src/components/NavLinks.jsx
import { useState, useEffect, useRef } from "react";
import api from "../axiosConfig";
import { createPortal } from "react-dom";
import * as LucideIcons from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function NavLinks({ isMobile }) {
  const { t, i18n } = useTranslation();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedParent, setSelectedParent] = useState(null);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [leafsForSub, setLeafsForSub] = useState([]);
  const [selectedSubForLeaf, setSelectedSubForLeaf] = useState(null);
  const [viewMode, setViewMode] = useState('products');
  const categoryCacheRef = useRef({});
  const [loadingLeafs, setLoadingLeafs] = useState(false);
  const [activeNav, setActiveNav] = useState(null);
  const [hasStore, setHasStore] = useState(false);
  const [checkingStore, setCheckingStore] = useState(true);
  const [hasSupplierProfile, setHasSupplierProfile] = useState(false);
  const [checkingSupplier, setCheckingSupplier] = useState(true);

  const [buyerMenuPos, setBuyerMenuPos] = useState({ top: 0, left: 0 });
  const [helpMenuPos, setHelpMenuPos] = useState({ top: 0, left: 0 });
  const [protectionsMenuPos, setProtectionsMenuPos] = useState({ top: 0, left: 0 });

  const timeoutRef = useRef(null);
  const placeholderImg = "https://via.placeholder.com/150?text=Skyfall+Product";

  const protectionsRef = useRef(null);
  const buyerRef = useRef(null);
  const helpRef = useRef(null);

  // ========== LOGIC ZOTE ZILIBAKI SAWA ==========
  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem("access_token");
      if (token) setUser({ id: "authenticated" });
      else setUser(null);
    };
    checkUser();
  }, []);

  useEffect(() => {
    const checkUserSupplierAndStore = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setCheckingSupplier(false); setCheckingStore(false);
        setHasSupplierProfile(false); setHasStore(false);
        return;
      }
      setCheckingSupplier(true); setCheckingStore(true);
      try {
        const profileRes = await api.get('/profile/');
        const profileData = profileRes.data;
        setHasSupplierProfile(profileData?.role === 'supplier');
        const storeRes = await api.get('/stores/', { params: { owner_id: profileData?.id } });
        setHasStore(storeRes.data && storeRes.data.length > 0);
      } catch (err) {
        console.error("❌ Error checking user data:", err.response?.data || err.message);
      } finally {
        setCheckingSupplier(false); setCheckingStore(false);
      }
    };
    checkUserSupplierAndStore();
  }, [user]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await api.get('/categories/', { params: { ordering: 'name' } });
        const data = response.data;
        if (data && data.length > 0) {
          const sortedData = [...data].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
          const allCategory = { id: null, name: 'All Categories', name_sw: 'Kategoria Zote' };
          setCategories([allCategory, ...sortedData]);
          setSelectedParent(allCategory);
        }
      } catch (error) { console.error("Error fetching categories:", error); }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedParent) {
      setViewMode('products');
      if (selectedParent.id === null) {
        setSubCategories([]); setFeaturedProducts([]); setLeafsForSub([]);
        return;
      }
      fetchSubCategories(selectedParent.id);
      fetchFeaturedLeafs(selectedParent.id);
    }
  }, [selectedParent]);

  useEffect(() => {
    async function fetchLeafsBySub() {
      if (viewMode === 'subcategories' && selectedSubForLeaf) {
        const subCategoryId = selectedSubForLeaf.id;
        const cacheKey = `sub_${subCategoryId}`;
        if (categoryCacheRef.current[cacheKey]) {
          setLeafsForSub(categoryCacheRef.current[cacheKey]);
          return;
        }
        setLoadingLeafs(true);
        try {
          const response = await api.get('/products/', { params: { sub_category: subCategoryId, limit: 17, ordering: '-views' } });
          const data = response.data.results || response.data || [];
          const result = data.map((product) => ({
            id: product.id, leaf_category_id: product.leaf_category_id || product.id,
            cover_image_url: product.cover_image_url, name: product.leaf_category_name || product.name,
            name_sw: product.leaf_category_name || product.name
          }));
          categoryCacheRef.current[cacheKey] = result;
          setLeafsForSub(result);
        } catch (error) { console.error(error); setLeafsForSub([]); }
        finally { setLoadingLeafs(false); }
      }
    }
    fetchLeafsBySub();
  }, [selectedSubForLeaf, viewMode]);

  async function fetchSubCategories(parentId) {
    if (!parentId) return;
    if (categoryCacheRef.current[parentId]?.subCategories) {
      const cachedSubs = categoryCacheRef.current[parentId].subCategories;
      setSubCategories(cachedSubs);
      if (cachedSubs.length > 0) setSelectedSubForLeaf(cachedSubs[0]);
      return;
    }
    try {
      const response = await api.get('/subcategories/', { params: { category_id: parentId } });
      const sortedData = (response.data || []).sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      categoryCacheRef.current[parentId] = { ...categoryCacheRef.current[parentId], subCategories: sortedData };
      setSubCategories(sortedData);
      if (sortedData.length > 0) setSelectedSubForLeaf(sortedData[0]);
    } catch (error) { console.error(error); }
  }

  async function fetchFeaturedLeafs(parentId) {
    if (!parentId) return;
    if (categoryCacheRef.current[parentId]?.leafs) {
      setFeaturedProducts(categoryCacheRef.current[parentId].leafs);
      setLoadingLeafs(false);
      return;
    }
    setLoadingLeafs(true);
    try {
      const response = await api.get('/products/', { params: { parent_category: parentId, limit: 17, ordering: '-views' } });
      const data = response.data.results || response.data || [];
      const result = data.map((product) => ({
        id: product.id, leaf_category_id: product.leaf_category_id || product.id,
        cover_image_url: product.cover_image_url, name: product.leaf_category_name || product.name,
        name_sw: product.leaf_category_name || product.name
      }));
      categoryCacheRef.current[parentId] = { ...categoryCacheRef.current[parentId], leafs: result };
      setFeaturedProducts(result);
    } catch (error) { console.error(error); setFeaturedProducts([]); }
    finally { setLoadingLeafs(false); }
  }

  const getDisplayName = (item) => {
    if (!item) return '';
    if (item.id === null) return i18n.language === 'sw' ? 'Kategoria Zote' : 'All Categories';
    return i18n.language === 'sw' ? (item.name_sw || item.name) : item.name;
  };

  const handleMouseEnter = (menuName, e) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMenu(menuName);
    setActiveNav(menuName);
    if (e) {
      const rect = e.currentTarget.getBoundingClientRect();
      if (menuName === 'buyerCentral') setBuyerMenuPos({ top: rect.bottom, left: rect.left });
      if (menuName === 'helpCenter') setHelpMenuPos({ top: rect.bottom, left: rect.left });
      if (menuName === 'protections') setProtectionsMenuPos({ top: rect.bottom, left: rect.left });
    }
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null); setActiveNav(null);
    }, 200);
  };

  const DynamicIcon = ({ name, size = 18 }) => {
    const IconComponent = LucideIcons[name] || LucideIcons.Package;
    return <IconComponent size={size} />;
  };

  const handleSellNavigation = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (token) {
        const profileRes = await api.get('/profile/');
        const profileData = profileRes.data;
        if (profileData?.role === 'supplier') {
          const storeRes = await api.get('/stores/', { params: { owner_id: profileData.id } });
          const storeData = storeRes.data;
          if (storeData && storeData.length > 0) {
            const store = storeData[0];
            const storeId = store.id;
            const verificationStatus = store.verification_status || store.status;
            if (verificationStatus === 'pending' || verificationStatus === 'unverified') navigate(`/store-pending/${storeId}`);
            else navigate(`/dashboard/sellerboard/${storeId}`);
            return;
          } else { navigate('/create-store'); return; }
        }
        navigate('/dashboard/seller');
      } else { navigate('/dashboard/register-supplier'); }
    } catch (err) {
      console.error("🔥 Error:", err.response?.data || err.message);
      navigate('/dashboard/register-supplier');
    }
  };

  // ========== MOBILE NAV ==========
  if (isMobile) {
    return (
      <div className="fixed bottom-0 left-0 w-full h-[60px] bg-white dark:bg-[#1e293b] border-t border-gray-200 dark:border-gray-700 flex justify-around items-center z-[99999] pb-[env(safe-area-inset-bottom)]">
        <Link to="/" className="flex flex-col items-center text-gray-600 dark:text-gray-400 hover:text-orange-500 text-[10px] gap-1"><LucideIcons.Home size={24} /><span>{t('home')}</span></Link>
        <Link to="/categories" className="flex flex-col items-center text-gray-600 dark:text-gray-400 hover:text-orange-500 text-[10px] gap-1"><LucideIcons.Grid size={24} /><span>{t('categories')}</span></Link>
        <Link to="/cart" className="flex flex-col items-center text-gray-600 dark:text-gray-400 hover:text-orange-500 text-[10px] gap-1"><LucideIcons.ShoppingCart size={24} /><span>{t('cart')}</span></Link>
        <Link to="/dashboard/login" className="flex flex-col items-center text-gray-600 dark:text-gray-400 hover:text-orange-500 text-[10px] gap-1"><LucideIcons.User size={24} /><span>{t('account')}</span></Link>
      </div>
    );
  }

  // ========== DESKTOP NAV (TAILWIND) ==========
  return (

    <nav className="flex justify-between items-center 
    max-w-[1250px] mx-auto px-6 md:px-12 h-[48px]
     w-full border-b border-gray-200 dark:border-gray-800">
      
           {/* LEFT GROUP */}
      <div className="flex items-center gap-4 ">
        
        {/* ALL CATEGORIES (Hii tunaiacha kama ilivyo kwa sababu inatumia logic ya kuchagua category) */}
        <div
          className="relative inline-flex items-center py-2 cursor-pointer group px-3"
          onMouseEnter={(e) => handleMouseEnter('categories', e)}
          onMouseLeave={handleMouseLeave}
        >
          <span className="flex items-center gap-2 text-[15px] font-bold 
          text-black dark:text-white group-hover:text-orange-500 transition-colors">
            <LucideIcons.Menu size={20} strokeWidth={2.5} />
            {t('all_categories')}
          </span>
          {activeNav === 'categories' && <div className="absolute -bottom-2 left-0 right-0 h-[3px] bg-orange-500 rounded-sm" />}

          {activeMenu === 'categories' && createPortal(
            <div
              className="fixed top-[105px] left-0 right-0 h-[520px] z-[999] bg-white dark:bg-black shadow-[0_4px_20px_rgba(0,0,0,0.15)] border-t border-gray-100 dark:border-gray-800 animate-[fadeInDown_0.2s_ease]"
              onMouseEnter={() => handleMouseEnter('categories')}
              onMouseLeave={handleMouseLeave}
            >
              <div className="flex h-full w-full">
                {/* SIDEBAR */}
               <aside className="w-[280px] flex-shrink-0 bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800 py-4 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-gray-900 dark:[&::-webkit-scrollbar-thumb]:bg-gray-600">
                    {viewMode === 'products' ? (
                    categories.map((cat) => (
                      <div
                        key={cat.id}
                        className={`flex justify-between items-center px-5 py-3 cursor-pointer transition-colors text-sm gap-2.5 ${
                          selectedParent?.id === cat.id
                            ? 'bg-orange-50 dark:bg-orange-500/10 text-orange-500 border-r-[3px] border-orange-500'
                            : 'text-black dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-800 hover:text-orange-500'
                        }`}
                        onMouseEnter={() => setSelectedParent(cat)}
                      >
                        <div className="flex items-center gap-2.5">
                          <DynamicIcon name={cat.icon_name} />
                          <span className="font-medium">{getDisplayName(cat)}</span>
                        </div>
                        <LucideIcons.ChevronRight className={`w-4 h-4 ${selectedParent?.id === cat.id ? 'text-orange-500' : 'text-gray-400'}`} />
                      </div>
                    ))
                  ) : (
                    <>
                      <div onClick={() => setViewMode('products')} className="flex items-center gap-2 px-5 py-4 cursor-pointer font-bold text-orange-500 border-b border-gray-200 dark:border-gray-700 hover:text-orange-600">
                        <LucideIcons.ChevronLeft size={18} /> {t('back')}
                      </div>
                      {subCategories.map((sub) => (
                        <div
                          key={sub.id}
                          onMouseEnter={() => setSelectedSubForLeaf(sub)}
                          className={`px-5 py-3 cursor-pointer text-sm transition-colors ${
                            selectedSubForLeaf?.id === sub.id
                              ? 'bg-orange-50 dark:bg-orange-500/10 text-orange-500 border-r-[3px] border-orange-500'
                              : 'text-black dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-800 hover:text-orange-500'
                          }`}
                        >
                          <span className="font-medium">{getDisplayName(sub)}</span>
                        </div>
                      ))}
                    </>
                  )}
                </aside>

                {/* CONTENT */}
                <main className="flex-1 p-8 bg-white dark:bg-[#1e293b] overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-orange-500 [&::-webkit-scrollbar-thumb]:rounded-full">
                  <div className="flex justify-between items-center mb-6 pb-3 border-b-2 border-gray-100 dark:border-gray-800">
                    <h3 className="text-lg font-bold text-black dark:text-white">
                      {viewMode === 'products' ? `Top Categories: ${getDisplayName(selectedParent)}` : getDisplayName(selectedSubForLeaf)}
                    </h3>
                    <button 
                      onClick={() => { setActiveMenu(null); setActiveNav(null); }}
                      className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all active:scale-95"
                    >
                      <LucideIcons.X size={20} />
                    </button>
                  </div>

                  {/* GRID */}
                  <div className="grid grid-cols-[repeat(auto-fill,minmax(130px,1fr))] gap-5 mt-2">
                    {viewMode === 'products' ? (
                      loadingLeafs ? (
                        [...Array(8)].map((_, idx) => (
                          <div key={`skeleton-${idx}`} className="flex flex-col items-center animate-pulse">
                            <div className="w-[90px] h-[90px] rounded-full bg-gray-200 dark:bg-gray-700 mb-2.5"></div>
                            <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                          </div>
                        ))
                      ) : featuredProducts.length > 0 ? (
                        <>
                          {featuredProducts.map((leaf) => (
                            <Link to={`/category/${leaf.leaf_category_id}`} key={leaf.id} className="flex flex-col items-center group">
                              <div className="w-[90px] h-[90px] rounded-full overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 transition-all duration-300 group-hover:border-orange-500 group-hover:scale-105 group-hover:shadow-[0_5px_15px_rgba(255,106,0,0.15)]">
                                <img src={leaf.cover_image_url || placeholderImg} alt={i18n.language === 'sw' ? (leaf.name_sw || leaf.name) : leaf.name} className="w-full h-full object-cover" onError={(e) => { e.target.src = placeholderImg; }} />
                              </div>
                              <p className="text-xs mt-2 text-gray-700 dark:text-gray-300 font-medium text-center group-hover:text-orange-500 transition-colors">
                                {i18n.language === 'sw' ? (leaf.name_sw || leaf.name) : leaf.name}
                              </p>
                            </Link>
                          ))}
                          <div onClick={() => setViewMode('subcategories')} className="flex flex-col items-center cursor-pointer group">
                            <div className="w-[90px] h-[90px] rounded-full flex items-center justify-center border-2 border-dashed border-orange-500 bg-orange-50 dark:bg-orange-500/10 transition-all group-hover:scale-105 group-hover:bg-orange-100">
                              <LucideIcons.Plus size={30} className="text-orange-500" />
                            </div>
                            <p className="text-xs mt-2 text-orange-500 font-bold">{t('see_all')}</p>
                          </div>
                        </>
                      ) : (
                        <div className="col-span-full flex flex-col items-center py-10">
                          <span className="text-5xl mb-3">📦</span>
                          <p className="text-base font-bold text-gray-700 dark:text-gray-300">Hakuna bidhaa katika kategoria hii</p>
                        </div>
                      )
                    ) : (
                      loadingLeafs ? (
                        [...Array(8)].map((_, idx) => (
                          <div key={`skeleton-sub-${idx}`} className="flex flex-col items-center animate-pulse">
                            <div className="w-[90px] h-[90px] rounded-full bg-gray-200 dark:bg-gray-700 mb-2.5"></div>
                            <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                          </div>
                        ))
                      ) : leafsForSub.length > 0 ? (
                        leafsForSub.map((leaf) => (
                          <Link to={`/category/${leaf.id}`} key={leaf.id} className="flex flex-col items-center group">
                            <div className="w-[90px] h-[90px] rounded-full overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 transition-all duration-300 group-hover:border-orange-500 group-hover:scale-105">
                              <img src={leaf.cover_image_url || leaf.image_url || placeholderImg} alt={leaf.name} className="w-full h-full object-cover" onError={(e) => { e.target.src = placeholderImg; }} />
                            </div>
                            <p className="text-xs mt-2 text-gray-700 dark:text-gray-300 font-medium text-center group-hover:text-orange-500 transition-colors">
                              {i18n.language === 'sw' ? (leaf.name_sw || leaf.name) : leaf.name}
                            </p>
                          </Link>
                        ))
                      ) : (
                        <div className="col-span-full flex flex-col items-center py-10">
                          <span className="text-5xl mb-3">📦</span>
                          <p className="text-base font-bold text-gray-700 dark:text-gray-300">Hakuna bidhaa katika subcategory hii</p>
                        </div>
                      )
                    )}
                  </div>
                </main>
              </div>
            </div>,
            document.body
          )}
        </div>

        {/* SKYFALL ADS (Iliyorekebishwa kwa CSS Group Hover) */}
        <div className="relative group py-2 cursor-pointer flex items-center">
          <Link 
            to="/advertise" 
            className="text-[15px] font-bold text-black dark:text-white group-hover:text-orange-500 transition-colors"
          >
           <span className="text-[15px] font-bold text-black dark:text-white group-hover:text-orange-500 transition-colors"> {t('skyfall_ads')}</span>
          </Link>
          {/* Mstari wa chini unapogusa */}
          <div className="absolute -bottom-2 left-0 right-0 h-[3px] bg-orange-500 rounded-sm scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
        </div>

                {/* ORDER PROTECTIONS (Full Width Dropdown) */}
        <div className="relative group py-2 cursor-pointer flex items-center">
          <span className="text-[15px] font-bold text-black dark:text-white group-hover:text-orange-500 transition-colors">
            {t('order_protections')}
          </span>
          
          {/* Mstari wa chini unapogusa */}
          <div className="absolute -bottom-[1px] left-0 right-0 h-[3px] bg-orange-500 rounded-sm scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

          {/* FULL WIDTH DROPDOWN - Imeongezwa urefu na padding */}
          <div className="fixed top-[105px] left-0 w-full bg-white dark:bg-black shadow-[0_15px_35px_rgba(0,0,0,0.4)] border-b border-gray-200 dark:border-gray-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:animate-smooth-dropdown z-[999]">
            
            {/* HAPA: Nimeongeza pb-12 (padding chini) na min-h ili isiwe fupi */}
            <div className="max-w-[1250px] mx-auto p-8  grid grid-cols-3 gap-10">
              
              {/* COLUMN 1: PAYMENT PROTECTION */}
              <div>
                <h4 className="text-base font-semibold text-black dark:text-white border-l-[3px] border-orange-500 pl-3 mb-4">
                  {t('payment_protection')}
                </h4>
                <ul className="list-none p-0 m-0 space-y-3">
                  <li className="flex items-center gap-2.5 text-sm">
                    <LucideIcons.Lock size={16} className="text-gray-500" />
                    <Link to="/payment-protection" className="text-gray-600 dark:text-gray-400 hover:text-orange-500 transition-colors">
                      {t('your_payment_protected')}
                    </Link>
                  </li>
                  <li className="flex items-center gap-2.5 text-sm">
                    <LucideIcons.CreditCard size={16} className="text-gray-500" />
                    <Link to="/refund-policy" className="text-gray-600 dark:text-gray-400 hover:text-orange-500 transition-colors">
                      {t('refund_policy')}
                    </Link>
                  </li>
                  <li className="flex items-center gap-2.5 text-sm">
                    <LucideIcons.ShieldCheck size={16} className="text-gray-500" />
                    <Link to="/buyer-protection" className="text-gray-600 dark:text-gray-400 hover:text-orange-500 transition-colors">
                      {t('buyer_protection')}
                    </Link>
                  </li>
                </ul>
              </div>

              {/* COLUMN 2: PRODUCT ISSUES */}
              <div>
                <h4 className="text-base font-semibold text-black dark:text-white border-l-[3px] border-orange-500 pl-3 mb-4">
                  {t('product_issues')}
                </h4>
                <ul className="list-none p-0 m-0 space-y-3">
                  <li className="flex items-center gap-2.5 text-sm">
                    <LucideIcons.FileWarning size={16} className="text-gray-500" />
                    <Link to="/dispute" className="text-gray-600 dark:text-gray-400 hover:text-orange-500 transition-colors">
                      {t('file_dispute')}
                    </Link>
                  </li>
                  <li className="flex items-center gap-2.5 text-sm">
                    <LucideIcons.Flag size={16} className="text-gray-500" />
                    <Link to="/report-product" className="text-gray-600 dark:text-gray-400 hover:text-orange-500 transition-colors">
                      {t('report_bad_product')}
                    </Link>
                  </li>
                  <li className="flex items-center gap-2.5 text-sm">
                    <LucideIcons.MessageCircle size={16} className="text-gray-500" />
                    <Link to="/contact-support" className="text-gray-600 dark:text-gray-400 hover:text-orange-500 transition-colors">
                      {t('contact_support')}
                    </Link>
                  </li>
                </ul>
              </div>

              {/* COLUMN 3: VERIFIED PRODUCTS */}
              <div>
                <h4 className="text-base font-semibold text-black dark:text-white border-l-[3px] border-orange-500 pl-3 mb-4">
                  {t('verified_products')}
                </h4>
                <ul className="list-none p-0 m-0 space-y-3">
                  <li className="flex items-center gap-2.5 text-sm">
                    <LucideIcons.CheckCircle size={16} className="text-gray-500" />
                    <Link to="/verification" className="text-gray-600 dark:text-gray-400 hover:text-orange-500 transition-colors">
                      {t('product_verification')}
                    </Link>
                  </li>
                  <li className="flex items-center gap-2.5 text-sm">
                    <LucideIcons.Star size={16} className="text-gray-500" />
                    <Link to="/reviews" className="text-gray-600 dark:text-gray-400 hover:text-orange-500 transition-colors">
                      {t('buyer_reviews')}
                    </Link>
                  </li>
                  <li className="flex items-center gap-2.5 text-sm">
                    <LucideIcons.Truck size={16} className="text-gray-500" />
                    <Link to="/shipping-protection" className="text-gray-600 dark:text-gray-400 hover:text-orange-500 transition-colors">
                      {t('shipping_protection')}
                    </Link>
                  </li>
                </ul>
              </div>

            </div>
          </div>
        </div>

      </div>

           {/* RIGHT GROUP */}
      <div className="flex items-center gap-4 flex-shrink-0">
        
        {/* BUYER CENTRAL (Dropdown ya CSS - FIXED) */}
        <div className="relative group py-2 cursor-pointer flex items-center">
          <span className="text-[15px] font-bold text-black dark:text-white group-hover:text-orange-500 transition-colors">
            {t('buyer_central')}
          </span>
          
          {/* Mstari wa chini unapogusa */}
          <div className="absolute -bottom-[1px] left-0 right-0 h-[3px] bg-orange-500 rounded-sm scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

          {/* DROPDOWN YA BUYER CENTRAL - FIXED, top-[97px], right-0 */}
          <div className="fixed top-[105px] right-0 w-[900px] 
          bg-white dark:bg-black shadow-[0_15px_35px_rgba(0,0,0,0.4)] 
          border-b border-x border-gray-200 dark:border-gray-800 rounded-b-xl opacity-0 
          invisible group-hover:opacity-100 group-hover:visible group-hover:animate-smooth-dropdown z-[999]">
            <div className="p-8 pb-12 grid grid-cols-4 gap-10">
              <div>
                <h4 className="text-base font-semibold text-black dark:text-white border-l-[3px] border-orange-500 pl-3 mb-4">{t('why_skyfall')}</h4>
                <ul className="list-none p-0 m-0 space-y-3">
                  <li><Link to="/about-skyfall" className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500">{t('what_is_skyfall')}</Link></li>
                  <li><Link to="/how-to-buy" className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500">{t('how_to_buy')}</Link></li>
                  <li><Link to="/wholesale-benefits" className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500">{t('wholesale_benefits')}</Link></li>
                  <li><Link to="/blogs" className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500">{t('business_articles')}</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-base font-semibold text-black dark:text-white border-l-[3px] border-orange-500 pl-3 mb-4">{t('business_services')}</h4>
                <ul className="list-none p-0 m-0 space-y-3">
                  <li><Link to="/protections" className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500">{t('payment_protection')}</Link></li>
                  <li><Link to="/logistics" className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500">{t('track_logistics')}</Link></li>
                  <li><Link to="/quotes" className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500">{t('invoice_requests')}</Link></li>
                  <li><Link to="/verification" className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500">{t('product_verification')}</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-base font-semibold text-black dark:text-white border-l-[3px] border-orange-500 pl-3 mb-4">{t('support_help')}</h4>
                <ul className="list-none p-0 m-0 space-y-3">
                  <li><Link to="/help-center" className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500">{t('for_buyers')}</Link></li>
                  <li><Link to="/dispute" className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500">{t('open_dispute')}</Link></li>
                  <li><Link to="/report" className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500">{t('report_issue')}</Link></li>
                  <li><a href="https://wa.me/255754394845" className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500">{t('chat_whatsapp')}</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-base font-semibold text-black dark:text-white border-l-[3px] border-orange-500 pl-3 mb-4">{t('our_partners')}</h4>
                <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="text-2xl font-bold text-orange-500">SF</div>
                  <div>
                    <div className="font-semibold text-sm text-black dark:text-white">{t('connect_your_store')}</div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-2">{t('register_store_description')}</p>
                    <Link to="/create-store" className="text-xs font-bold text-orange-500 hover:underline">{t('start_now')}</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* HELP CENTER (Dropdown ya CSS - FIXED) */}
        <div className="relative group py-2 cursor-pointer flex items-center">
          <span className="text-[15px] font-bold text-black dark:text-white group-hover:text-orange-500 transition-colors">
            {t('help_center')}
          </span>
          
          {/* Mstari wa chini unapogusa */}
          <div className="absolute -bottom-[1px] left-0 right-0 h-[3px] bg-orange-500 rounded-sm scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

          {/* DROPDOWN YA HELP CENTER - FIXED, top-[97px], right-0 */}
          <div className="fixed top-[105px] right-0 w-[900px] bg-white dark:bg-black shadow-[0_15px_35px_rgba(0,0,0,0.4)] border-b border-x border-gray-200 dark:border-gray-800 rounded-b-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:animate-smooth-dropdown z-[9999]">
            <div className="p-8 pb-12 grid grid-cols-4 gap-10">
              <div>
                <h4 className="text-base font-semibold text-black dark:text-white border-l-[3px] border-orange-500 pl-3 mb-4">{t('buyer_help')}</h4>
                <ul className="list-none p-0 m-0 space-y-3">
                  <li><Link to="/help-center" className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500">{t('help_center_desc')}</Link></li>
                  <li><Link to="/how-to-buy" className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500">{t('how_to_buy')}</Link></li>
                  <li><Link to="/shipping-info" className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500">{t('shipping_info')}</Link></li>
                  <li><Link to="/refund-policy" className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500">{t('refund_policy')}</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-base font-semibold text-black dark:text-white border-l-[3px] border-orange-500 pl-3 mb-4">{t('security_policies')}</h4>
                <ul className="list-none p-0 m-0 space-y-3">
                  <li><Link to="/dispute" className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500">{t('open_dispute')}</Link></li>
                  <li><Link to="/report-abuse" className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500">{t('report_scam')}</Link></li>
                  <li><Link to="/terms" className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500">{t('terms_conditions')}</Link></li>
                  <li><Link to="/privacy" className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500">{t('privacy_policy')}</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-base font-semibold text-black dark:text-white border-l-[3px] border-orange-500 pl-3 mb-4">{t('contact_us')}</h4>
                <ul className="list-none p-0 m-0 space-y-3">
                  <li><a href="https://wa.me/255..." className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500">{t('chat_whatsapp')}</a></li>
                  <li><Link to="/contact-us" className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500">{t('email_us')}</Link></li>
                  <li><Link to="/office-location" className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500">{t('our_offices')}</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-base font-semibold text-black dark:text-white border-l-[3px] border-orange-500 pl-3 mb-4">{t('learn_more')}</h4>
                <div className="p-4 bg-[#f8faff] dark:bg-gray-800 rounded-lg border border-blue-50 dark:border-gray-700">
                  <div className="flex items-center gap-2 mb-2">
                    <LucideIcons.PlayCircle size={24} className="text-blue-500" />
                    <span className="font-semibold text-sm text-black dark:text-white">{t('video_tutorials')}</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{t('video_description')}</p>
                  <Link to="/tutorials" className="block mt-3 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">{t('watch_videos')}</Link>
                </div>
              </div>
            </div>
          </div>
        </div>

              {/* SELL ON SKYFALL */}
        <div
          onClick={handleSellNavigation}
          className={`relative flex items-center justify-center px-3 py-2 rounded-md border text-sm font-medium transition-all duration-200 cursor-pointer ${ /* 🔥 ONGEZA 'relative' HAPA */
            user 
              ? 'bg-transparent border-gray-200 dark:border-gray-700 text-black dark:text-white hover:border-orange-500 hover:text-orange-500' 
              : 'bg-orange-50 dark:bg-[#1e293b] border-orange-100 dark:border-gray-700 text-black dark:text-white hover:border-orange-500 hover:bg-orange-100 dark:hover:bg-gray-800 hover:text-orange-500'
          }`}
          onMouseEnter={() => setActiveNav('sell')}
          onMouseLeave={() => setActiveNav(null)}
        >
          <span>{t('sell_on_skyfall')}</span>
          {/* 🔥 ONDOA top-[47px], acha -bottom-2 pekee */}
          {activeNav === 'sell' && <div className="absolute -bottom-2 left-0 right-0 h-[3px] bg-orange-500 rounded-sm"/>}
        </div>

      </div>
    </nav>
  );
}