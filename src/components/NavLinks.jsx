// src/components/NavLinks.jsx
import { useState, useEffect, useRef } from "react";
import api from "../axiosConfig";
import { createPortal } from "react-dom";
import * as LucideIcons from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import "../NavLinks.css";
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
  const categoryCacheRef = useRef({}); // ✅ Cache kwa ajili ya data
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

  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem("access_token");
      if (token) {
        setUser({ id: "authenticated" });
      } else {
        setUser(null);
      }
    };
    checkUser();
  }, []);

  useEffect(() => {
    const checkUserSupplierAndStore = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setCheckingSupplier(false);
        setCheckingStore(false);
        setHasSupplierProfile(false);
        setHasStore(false);
        return;
      }
      setCheckingSupplier(true);
      setCheckingStore(true);
      try {
        const profileRes = await api.get('/profile/');
        const profileData = profileRes.data;
        setHasSupplierProfile(profileData?.role === 'supplier');
        const storeRes = await api.get('/stores/', { params: { owner_id: profileData?.id } });
        if (storeRes.data && storeRes.data.length > 0) {
          setHasStore(true);
        } else {
          setHasStore(false);
        }
      } catch (err) {
        console.error("❌ Error checking user data:", err.response?.data || err.message);
      } finally {
        setCheckingSupplier(false);
        setCheckingStore(false);
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
          // ✅ 1. Panga kategoria kwa alfabeti (A-Z)
          const sortedData = [...data].sort((a, b) => 
            (a.name || '').localeCompare(b.name || '')
          );
          
          // ✅ 2. Ongeza 'All Categories' mwanzoni
          const allCategory = { 
            id: null, 
            name: 'All Categories', 
            name_sw: 'Kategoria Zote' 
          };
          
          setCategories([allCategory, ...sortedData]);
          setSelectedParent(allCategory); // Chagua 'All Categories' kama default
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedParent) {
      setViewMode('products');
      
      // ✅ Kama ni 'All Categories', usifanye fetch maalum
      if (selectedParent.id === null) {
        setSubCategories([]);
        setFeaturedProducts([]);
        setLeafsForSub([]);
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

    // ✅ Angalia cache kwanza
    if (categoryCacheRef.current[cacheKey]) {
      setLeafsForSub(categoryCacheRef.current[cacheKey]);
      return;
    }

    setLoadingLeafs(true);

    try {
      console.log(`⏳ [FETCH] Inapakia products za subcategory ${subCategoryId}...`);
      const response = await api.get('/products/', {
        params: {
          sub_category: subCategoryId,
          limit: 17,
          ordering: '-views'
        }
      });

      const data = response.data.results || response.data || [];

      const result = data.map((product) => ({
        id: product.id,
        leaf_category_id: product.leaf_category_id || product.id,
        cover_image_url: product.cover_image_url,
        name: product.leaf_category_name || product.name,
        name_sw: product.leaf_category_name || product.name
      }));

      // ✅ Hifadhi kwenye cache
      categoryCacheRef.current[cacheKey] = result;
      setLeafsForSub(result);
      setLoadingLeafs(false);

    } catch (error) {
      console.error("❌ [fetchLeafsBySub] Error:", error);
      setLeafsForSub([]);
      setLoadingLeafs(false);
    }
  }
}
    fetchLeafsBySub();
  }, [selectedSubForLeaf, viewMode]);

 async function fetchSubCategories(parentId) {
  if (!parentId) return;

  // ✅ Angalia cache kwanza
  if (categoryCacheRef.current[parentId]?.subCategories) {
    const cachedSubs = categoryCacheRef.current[parentId].subCategories;
    setSubCategories(cachedSubs);
    if (cachedSubs.length > 0) {
      setSelectedSubForLeaf(cachedSubs[0]);
    }
    return;
  }

  try {
    console.log(`⏳ [FETCH] Inapakia subcategories za category ${parentId}...`);
    const response = await api.get('/subcategories/', {
      params: { category_id: parentId }
    });

    const sortedData = (response.data || []).sort((a, b) => 
      (a.name || '').localeCompare(b.name || '')
    );

    // ✅ Hifadhi kwenye cache
    categoryCacheRef.current[parentId] = {
      ...categoryCacheRef.current[parentId],
      subCategories: sortedData
    };

    console.log(`✅ [SUCCESS] Subcategories ${sortedData.length} zimehifadhiwa!`);
    setSubCategories(sortedData);

    if (sortedData.length > 0) {
      setSelectedSubForLeaf(sortedData[0]);
    }
  } catch (error) {
    console.error("❌ [fetchSubCategories] Error:", error);
  }
}

  async function fetchFeaturedLeafs(parentId) {
  if (!parentId) return;

  // ✅ Angalia cache kwanza
  if (categoryCacheRef.current[parentId]?.leafs) {
    setFeaturedProducts(categoryCacheRef.current[parentId].leafs);
    setLoadingLeafs(false);
    return;
  }

  setLoadingLeafs(true);

  try {
    console.log(`⏳ [FETCH] Inapakia products za category ${parentId}...`);
    
    const response = await api.get('/products/', {
      params: {
        parent_category: parentId,
        limit: 17,
        ordering: '-views'
      }
    });

    const data = response.data.results || response.data || [];
    
    const result = data.map((product) => ({
      id: product.id,
      leaf_category_id: product.leaf_category_id || product.id,
      cover_image_url: product.cover_image_url,
      name: product.leaf_category_name || product.name,
      name_sw: product.leaf_category_name || product.name
    }));

    // ✅ Hifadhi kwenye cache
    categoryCacheRef.current[parentId] = {
      ...categoryCacheRef.current[parentId],
      leafs: result
    };
    
    setFeaturedProducts(result);
    setLoadingLeafs(false);

  } catch (error) {
    console.error("❌ [fetchFeaturedLeafs] Error:", error);
    setFeaturedProducts([]);
    setLoadingLeafs(false);
  }
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
    if (menuName === 'buyerCentral' && e) {
      const rect = e.currentTarget.getBoundingClientRect();
      setBuyerMenuPos({ top: rect.bottom, left: rect.left });
    }
    if (menuName === 'helpCenter' && e) {
      const rect = e.currentTarget.getBoundingClientRect();
      setHelpMenuPos({ top: rect.bottom, left: rect.left });
    }
    if (menuName === 'protections' && e) {
      const rect = e.currentTarget.getBoundingClientRect();
      setProtectionsMenuPos({ top: rect.bottom, left: rect.left });
    }
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
      setActiveNav(null);
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
            navigate(`/dashboard/sellerboard/${storeData[0].id}`);
            return;
          } else {
            navigate('/create-store');
            return;
          }
        }
        navigate('/dashboard/seller');
      } else {
        navigate('/dashboard/register-supplier');
      }
    } catch (err) {
      console.error("🔥 Error:", err.response?.data || err.message);
      navigate('/dashboard/register-supplier');
    }
  };

  if (isMobile) {
    return (
      <div className="mobile-bottom-nav">
        <Link to="/" className="mobile-nav-item"><LucideIcons.Home size={24} /><span>{t('home')}</span></Link>
        <Link to="/categories" className="mobile-nav-item"><LucideIcons.Grid size={24} /><span>{t('categories')}</span></Link>
        <Link to="/cart" className="mobile-nav-item"><LucideIcons.ShoppingCart size={24} /><span>{t('cart')}</span></Link>
        <Link to="/dashboard/login" className="mobile-nav-item"><LucideIcons.User size={24} /><span>{t('account')}</span></Link>
      </div>
    );
  }

  return (
    <nav className="nav-links-container">
      <div className="nav-group-left">
        {/* ALL CATEGORIES */}
        <div
          className="category-toggle-wrapper"
          onMouseEnter={(e) => handleMouseEnter('categories', e)}
          onMouseLeave={handleMouseLeave}
        >
          <span className="category-toggle">
            <LucideIcons.Menu size={20} strokeWidth={2.5} />
            {t('all_categories')}
          </span>
          {activeNav === 'categories' && <div className="nav-underline" />}

          {activeMenu === 'categories' && createPortal(
            <div
              className="mega-menu-container"
              onMouseEnter={() => handleMouseEnter('categories')}
              onMouseLeave={handleMouseLeave}
            >
              <div className="mega-menu-inner">
                <aside className="mega-menu-sidebar">
                  {viewMode === 'products' ? (
                    categories.map((cat) => (
                      <div
                        key={cat.id}
                        className={`sidebar-item ${selectedParent?.id === cat.id ? 'active' : ''}`}
                        onMouseEnter={() => setSelectedParent(cat)}
                      >
                        <div className="sidebar-item-content">
                          <DynamicIcon name={cat.icon_name} />
                          <span className="sidebar-item-text">{getDisplayName(cat)}</span>
                        </div>
                        <LucideIcons.ChevronRight className="sidebar-item-arrow" size={16} />
                      </div>
                    ))
                  ) : (
                    <>
                      <div onClick={() => setViewMode('products')} className="sidebar-back-header">
                        <LucideIcons.ChevronLeft size={18} />
                        {t('back')}
                      </div>
                      {subCategories.map((sub) => (
                        <div
                          key={sub.id}
                          onMouseEnter={() => setSelectedSubForLeaf(sub)}
                          className={`sidebar-item ${selectedSubForLeaf?.id === sub.id ? 'active' : ''}`}
                        >
                          <span className="sidebar-item-text">{getDisplayName(sub)}</span>
                        </div>
                      ))}
                    </>
                  )}
                </aside>

                <main className="mega-menu-content">
                  <div className="content-header">
                    <h3>
                      {viewMode === 'products'
                        ? `Top Categories: ${getDisplayName(selectedParent)}`
                        : getDisplayName(selectedSubForLeaf)}
                    </h3>
                    {viewMode === 'products' && (
                      <button onClick={() => setViewMode('subcategories')} className="view-all-btn">
                        {t('view_all')} <LucideIcons.ChevronRight size={14} />
                      </button>
                    )}
                  </div>

<div className="category-grid">
  {viewMode === 'products' ? (
    <>
      {loadingLeafs ? (
        // ✅ SKELETON LOADING
        [...Array(8)].map((_, idx) => (
          <div key={`skeleton-${idx}`} className="grid-item skeleton-item">
            <div className="image-circle skeleton-circle"></div>
            <p className="skeleton-text"></p>
          </div>
        ))
      ) : featuredProducts.length > 0 ? (
        // ✅ DATA IPO - SAWA NA DASHBOARD
        featuredProducts.map((leaf) => (
          <Link to={`/category/${leaf.leaf_category_id}`} key={leaf.id} className="grid-item">
            <div className="image-circle">
              <img
                src={leaf.cover_image_url || placeholderImg}
                alt={i18n.language === 'sw' ? (leaf.name_sw || leaf.name) : leaf.name}
                onError={(e) => { e.target.src = placeholderImg; }}
              />
            </div>
            <p className="grid-text">
              {i18n.language === 'sw' ? (leaf.name_sw || leaf.name) : leaf.name}
            </p>
          </Link>
        ))
      ) : (
        // ✅ EMPTY STATE
        <div className="empty-state" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '48px' }}>📦</div>
          <p style={{ fontSize: '16px', color: '#666', fontWeight: 'bold' }}>
            Hakuna bidhaa katika kategoria hii
          </p>
        </div>
      )}
      
      {/* ✅ SEE ALL */}
      {!loadingLeafs && featuredProducts.length > 0 && (
        <div onClick={() => setViewMode('subcategories')} className="grid-item see-all-card">
          <div className="image-circle see-all-circle">
            <LucideIcons.Plus size={30} color="#ff6a00" />
          </div>
          <p className="see-all-text">{t('see_all')}</p>
        </div>
      )}
    </>
  ) : (
    // ✅ KWA SUBCATEGORIES
    loadingLeafs ? (
      // Skeleton
      [...Array(8)].map((_, idx) => (
        <div key={`skeleton-sub-${idx}`} className="grid-item skeleton-item">
          <div className="image-circle skeleton-circle"></div>
          <p className="skeleton-text"></p>
        </div>
      ))
    ) : leafsForSub.length > 0 ? (
      leafsForSub.map((leaf) => (
        <Link to={`/category/${leaf.id}`} key={leaf.id} className="grid-item">
          <div className="image-circle">
            <img
              src={leaf.cover_image_url || leaf.image_url || placeholderImg}
              alt={i18n.language === 'sw' ? (leaf.name_sw || leaf.name) : leaf.name}
              onError={(e) => { e.target.src = placeholderImg; }}
            />
          </div>
          <p className="grid-text">
            {i18n.language === 'sw' ? (leaf.name_sw || leaf.name) : leaf.name}
          </p>
        </Link>
      ))
    ) : (
      // Empty state kwa subcategories
      <div className="empty-state" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
        <div style={{ fontSize: '48px' }}>📦</div>
        <p style={{ fontSize: '16px', color: '#666', fontWeight: 'bold' }}>
          Hakuna bidhaa katika subcategory hii
        </p>
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

        {/* SKYFALL ADS */}
        <Link to="/advertise" className="nav-item">
          <span>{t('skyfall_ads')}</span>
        </Link>

        {/* ORDER PROTECTIONS */}
        <div
          ref={protectionsRef}
          className="category-toggle-wrapper"
          onMouseEnter={(e) => handleMouseEnter('protections', e)}
          onMouseLeave={handleMouseLeave}
        >
          <Link className="nav-item">
            <span>{t('order_protections')}</span>
          </Link>
          {activeMenu === 'protections' && <div className="nav-underline" />}

          {activeMenu === 'protections' && createPortal(
            <div
              className="dropdown-menu-portal"
              onMouseEnter={() => handleMouseEnter('protections')}
              onMouseLeave={handleMouseLeave}
              style={{ top: `${protectionsMenuPos.top}px` }}
            >
              <div className="dropdown-menu-inner dropdown-grid-3">
                <div>
                  <h4 className="dropdown-header-title">{t('payment_protection')}</h4>
                  <ul className="dropdown-list">
                    <li className="dropdown-list-item">
                      <LucideIcons.Lock size={16} />
                      <Link to="/payment-protection">{t('your_payment_protected')}</Link>
                    </li>
                    <li className="dropdown-list-item">
                      <LucideIcons.CreditCard size={16} />
                      <Link to="/refund-policy">{t('refund_policy')}</Link>
                    </li>
                    <li className="dropdown-list-item">
                      <LucideIcons.ShieldCheck size={16} />
                      <Link to="/buyer-protection">{t('buyer_protection')}</Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="dropdown-header-title">{t('product_issues')}</h4>
                  <ul className="dropdown-list">
                    <li className="dropdown-list-item">
                      <LucideIcons.FileWarning size={16} />
                      <Link to="/dispute">{t('file_dispute')}</Link>
                    </li>
                    <li className="dropdown-list-item">
                      <LucideIcons.Flag size={16} />
                      <Link to="/report-product">{t('report_bad_product')}</Link>
                    </li>
                    <li className="dropdown-list-item">
                      <LucideIcons.MessageCircle size={16} />
                      <Link to="/contact-support">{t('contact_support')}</Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="dropdown-header-title">{t('verified_products')}</h4>
                  <ul className="dropdown-list">
                    <li className="dropdown-list-item">
                      <LucideIcons.CheckCircle size={16} />
                      <Link to="/verification">{t('product_verification')}</Link>
                    </li>
                    <li className="dropdown-list-item">
                      <LucideIcons.Star size={16} />
                      <Link to="/reviews">{t('buyer_reviews')}</Link>
                    </li>
                    <li className="dropdown-list-item">
                      <LucideIcons.Truck size={16} />
                      <Link to="/shipping-protection">{t('shipping_protection')}</Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>,
            document.body
          )}
        </div>
      </div>

      <div className="nav-group-right">
        {/* BUYER CENTRAL */}
        <span
          ref={buyerRef}
          className="nav-item category-toggle-wrapper"
          onMouseEnter={(e) => handleMouseEnter('buyerCentral', e)}
          onMouseLeave={handleMouseLeave}
        >
          <span>{t('buyer_central')}</span>
          {activeMenu === 'buyerCentral' && <div className="nav-underline" />}
        </span>
        {activeMenu === 'buyerCentral' && createPortal(
          <div
            className="dropdown-menu-portal"
            onMouseEnter={() => handleMouseEnter('buyerCentral')}
            onMouseLeave={handleMouseLeave}
            style={{ top: `${buyerMenuPos.top}px` }}
          >
            <div className="dropdown-menu-inner dropdown-grid-4">
              <div>
                <h4 className="dropdown-header-title">{t('why_skyfall')}</h4>
                <ul className="dropdown-list">
                  <li className="dropdown-list-item"><Link to="/about-skyfall">{t('what_is_skyfall')}</Link></li>
                  <li className="dropdown-list-item"><Link to="/how-to-buy">{t('how_to_buy')}</Link></li>
                  <li className="dropdown-list-item"><Link to="/wholesale-benefits">{t('wholesale_benefits')}</Link></li>
                  <li className="dropdown-list-item"><Link to="/blogs">{t('business_articles')}</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="dropdown-header-title">{t('business_services')}</h4>
                <ul className="dropdown-list">
                  <li className="dropdown-list-item"><Link to="/protections">{t('payment_protection')}</Link></li>
                  <li className="dropdown-list-item"><Link to="/logistics">{t('track_logistics')}</Link></li>
                  <li className="dropdown-list-item"><Link to="/quotes">{t('invoice_requests')}</Link></li>
                  <li className="dropdown-list-item"><Link to="/verification">{t('product_verification')}</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="dropdown-header-title">{t('support_help')}</h4>
                <ul className="dropdown-list">
                  <li className="dropdown-list-item"><Link to="/help-center">{t('for_buyers')}</Link></li>
                  <li className="dropdown-list-item"><Link to="/dispute">{t('open_dispute')}</Link></li>
                  <li className="dropdown-list-item"><Link to="/report">{t('report_issue')}</Link></li>
                  <li className="dropdown-list-item"><a href="https://wa.me/255...">{t('chat_whatsapp')}</a></li>
                </ul>
              </div>
              <div>
                <h4 className="dropdown-header-title">{t('our_partners')}</h4>
                <div className="partner-card">
                  <div className="partner-logo">SF</div>
                  <div>
                    <div className="partner-title">{t('connect_your_store')}</div>
                    <p className="partner-description">{t('register_store_description')}</p>
                    <Link to="/create-store" className="partner-link">{t('start_now')}</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}

        {/* HELP CENTER */}
        <span
          ref={helpRef}
          className="nav-item category-toggle-wrapper"
          onMouseEnter={(e) => handleMouseEnter('helpCenter', e)}
          onMouseLeave={handleMouseLeave}
        >
          <span>{t('help_center')}</span>
          {activeMenu === 'helpCenter' && <div className="nav-underline" />}
        </span>
        {activeMenu === 'helpCenter' && createPortal(
          <div
            className="dropdown-menu-portal"
            onMouseEnter={() => handleMouseEnter('helpCenter')}
            onMouseLeave={handleMouseLeave}
            style={{ top: `${helpMenuPos.top}px` }}
          >
            <div className="dropdown-menu-inner dropdown-grid-4">
              <div>
                <h4 className="dropdown-header-title">{t('buyer_help')}</h4>
                <ul className="dropdown-list">
                  <li className="dropdown-list-item"><Link to="/help-center">{t('help_center_desc')}</Link></li>
                  <li className="dropdown-list-item"><Link to="/how-to-buy">{t('how_to_buy')}</Link></li>
                  <li className="dropdown-list-item"><Link to="/shipping-info">{t('shipping_info')}</Link></li>
                  <li className="dropdown-list-item"><Link to="/refund-policy">{t('refund_policy')}</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="dropdown-header-title">{t('security_policies')}</h4>
                <ul className="dropdown-list">
                  <li className="dropdown-list-item"><Link to="/dispute">{t('open_dispute')}</Link></li>
                  <li className="dropdown-list-item"><Link to="/report-abuse">{t('report_scam')}</Link></li>
                  <li className="dropdown-list-item"><Link to="/terms">{t('terms_conditions')}</Link></li>
                  <li className="dropdown-list-item"><Link to="/privacy">{t('privacy_policy')}</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="dropdown-header-title">{t('contact_us')}</h4>
                <ul className="dropdown-list">
                  <li className="dropdown-list-item"><a href="https://wa.me/255...">{t('chat_whatsapp')}</a></li>
                  <li className="dropdown-list-item"><Link to="/contact-us">{t('email_us')}</Link></li>
                  <li className="dropdown-list-item"><Link to="/office-location">{t('our_offices')}</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="dropdown-header-title">{t('learn_more')}</h4>
                <div className="learn-more-card">
                  <div className="learn-more-header">
                    <LucideIcons.PlayCircle size={24} />
                    <span>{t('video_tutorials')}</span>
                  </div>
                  <p className="learn-more-text">{t('video_description')}</p>
                  <Link to="/tutorials" className="learn-more-link">{t('watch_videos')}</Link>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}

        {/* SELL ON SKYFALL */}
        <div
          onClick={handleSellNavigation}
          className={`nav-sell-link ${user ? 'nav-sell-link-transparent' : ''}`}
          onMouseEnter={() => setActiveNav('sell')}
          onMouseLeave={() => setActiveNav(null)}
        >
          <span>{t('sell_on_skyfall')}</span>
          {activeNav === 'sell' && <div className="nav-underline" />}
        </div>
      </div>
    </nav>
  );
}