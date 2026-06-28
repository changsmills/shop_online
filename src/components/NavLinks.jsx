import { useState, useEffect, useRef } from "react";
import { supabase } from "../supabaseClient";
import { createPortal } from "react-dom";
import * as LucideIcons from "lucide-react"; 
import { Link, useNavigate } from "react-router-dom";
import "../NavLinks.css";
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext.jsx';

// 🔥 ONGEZA HII: Kukubali prop ya isMobile
export default function NavLinks({ isMobile }) {
  const { t, i18n } = useTranslation();
  const { language } = useLanguage();
  const [forceUpdate, setForceUpdate] = useState(0);
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
  
  const timeoutRef = useRef(null);

  const placeholderImg = "https://via.placeholder.com/150?text=Skyfall+Product";

  const categoriesRef = useRef(null);
  const exposeRef = useRef(null);
  const protectionsRef = useRef(null);
  const buyerRef = useRef(null);
  const helpRef = useRef(null);

  const [categoriesPos, setCategoriesPos] = useState({ top: 0, left: 0, width: 0 });
  const [exposePos, setExposePos] = useState({ top: 0, left: 0, width: 0 });
  const [protectionsPos, setProtectionsPos] = useState({ top: 0, left: 0, width: 0 });
  const [buyerPos, setBuyerPos] = useState({ top: 0, left: 0, width: 0 });
  const [helpPos, setHelpPos] = useState({ top: 0, left: 0, width: 0 });

  const [buyerMenuPos, setBuyerMenuPos] = useState({ top: 0, left: 0 });
  const [helpMenuPos, setHelpMenuPos] = useState({ top: 0, left: 0 });
  const [exposeMenuPos, setExposeMenuPos] = useState({ top: 0, left: 0 });
  const [protectionsMenuPos, setProtectionsMenuPos] = useState({ top: 0, left: 0 });
  const [activeNav, setActiveNav] = useState(null);
  const [hasStore, setHasStore] = useState(false);
  const [checkingStore, setCheckingStore] = useState(true);
  const [hasSupplierProfile, setHasSupplierProfile] = useState(false);
  const [checkingSupplier, setCheckingSupplier] = useState(true);

  useEffect(() => {
    setForceUpdate(prev => prev + 1);
  }, [language]);

  useEffect(() => {
    setForceUpdate(prev => prev + 1);
    console.log("Language changed to:", language, i18n.language);
  }, [language, i18n.language]);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const checkUserSupplierAndStore = async () => {
      if (!user) {
        setCheckingSupplier(false);
        setCheckingStore(false);
        setHasSupplierProfile(false);
        setHasStore(false);
        return;
      }

      setCheckingSupplier(true);
      setCheckingStore(true);

      try {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        setHasSupplierProfile(profileData?.role === 'supplier');

        const { data: storeData } = await supabase
          .from('stores_engine')
          .select('id, store_name, owner_id')
          .eq('owner_id', user.id);

        if (storeData && storeData.length > 0) {
          setHasStore(true);
        } else {
          setHasStore(false);
        }

      } catch (err) {
        console.error("❌ Error checking user data:", err.message);
      } finally {
        setCheckingSupplier(false);
        setCheckingStore(false);
      }
    };

    checkUserSupplierAndStore();
  }, [user]);

  useEffect(() => {
    async function fetchCategories() {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });
      if (!error && data) {
        setCategories(data);
        if (data.length > 0) setSelectedParent(data[0]);
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedParent) {
      setViewMode('products'); 
      fetchSubCategories(selectedParent.id);
      fetchFeaturedLeafs(selectedParent.id);
    }
  }, [selectedParent]);

  async function fetchSubCategories(parentId) {
    const { data } = await supabase
      .from('sub_categories')
      .select('*')
      .eq('category_id', parentId)
      .order('name', { ascending: true });
    if (data) {
      setSubCategories(data);
      if (data.length > 0) setSelectedSubForLeaf(data[0]);
    }
  }

  async function fetchFeaturedLeafs(parentId) {
    const { data, error } = await supabase
      .from('products_engines')
      .select(`
        leaf_category_id,
        cover_image,
        leaf_categories!inner (
           name,
         name_sw
        )
      `)
      .eq('parent_category_id', parentId)
      .not('cover_image', 'is', null)
      .limit(50);

    if (!error && data) {
      const uniqueCategories = [];
      const seenIds = new Set();

      data.forEach(item => {
        if (!seenIds.has(item.leaf_category_id)) {
          seenIds.add(item.leaf_category_id);
          uniqueCategories.push({
            id: item.leaf_category_id,
            leaf_category_id: item.leaf_category_id,
            cover_image: item.cover_image,
            leaf_categories: item.leaf_categories
          });
        }
      });

      setFeaturedProducts(uniqueCategories.slice(0, 17));
    } else {
      console.error("Error fetching products:", error);
      setFeaturedProducts([]);
    }
  }

  useEffect(() => {
    async function fetchLeafsBySub() {
      if (viewMode === 'subcategories' && selectedSubForLeaf) {
        const { data, error } = await supabase
          .from('products_engines')
          .select(`
            leaf_category_id,
            cover_image,
            leaf_categories!inner (
              name,
              name_sw
            )
          `)
          .eq('category_id', selectedSubForLeaf.id)
          .not('cover_image', 'is', null);

        if (!error && data) {
          const uniqueLeafs = [];
          const seenLeafIds = new Set();

          data.forEach(item => {
            if (!seenLeafIds.has(item.leaf_category_id)) {
              seenLeafIds.add(item.leaf_category_id);
              uniqueLeafs.push({
                id: item.leaf_category_id,
                name: item.leaf_categories.name,
                name_sw: item.leaf_categories.name_sw,
                image_url: item.cover_image
              });
            }
          });
          setLeafsForSub(uniqueLeafs);
        } else {
          setLeafsForSub([]);
        }
      }
    }
    fetchLeafsBySub();
  }, [selectedSubForLeaf, viewMode]);

  const getDisplayName = (item) => {
    if (!item) return '';
    const result = i18n.language === 'sw' ? (item.name_sw || item.name) : item.name;
    return result;
  };

   const handleMouseEnter = (menuName, e) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMenu(menuName);
    setActiveNav(menuName);

    if (menuName === 'buyerCentral' && e) {
      const rect = e.currentTarget.getBoundingClientRect();
      setBuyerMenuPos({ top: rect.bottom, left: rect.left }); // 💥 Ondoa window.scrollY na window.scrollX
    }
    if (menuName === 'helpCenter' && e) {
      const rect = e.currentTarget.getBoundingClientRect();
      setHelpMenuPos({ top: rect.bottom, left: rect.left }); // 💥 Ondoa window.scrollY na window.scrollX
    }
    if (menuName === 'exposeStore' && e) {
      const rect = e.currentTarget.getBoundingClientRect();
      setExposeMenuPos({ top: rect.bottom, left: rect.left }); // 💥 Ondoa window.scrollY na window.scrollX
    }
    if (menuName === 'protections' && e) {
      const rect = e.currentTarget.getBoundingClientRect();
      setProtectionsMenuPos({ top: rect.bottom, left: rect.left }); // 💥 Ondoa window.scrollY na window.scrollX
    }
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 200);
  };

  const DynamicIcon = ({ name, size = 18 }) => {
    const IconComponent = LucideIcons[name] || LucideIcons.Package;
    return <IconComponent size={size} />;
  };

  const headerStyle = {
    fontSize: '16px', fontWeight: '600', marginBottom: '15px', color: '#111',
    borderLeft: '3px solid #ff6a00', paddingLeft: '12px'
  };
  const ulStyle = { listStyle: 'none', padding: 0, margin: 0 };
  const liStyle = { marginBottom: '12px', fontSize: '13px' };
  const linkStyle = { textDecoration: 'none', color: '#555', transition: 'color 0.2s ease' };

  const handleSellNavigation = async () => {
    try {
      console.log("🔍 1. Inaangalia session ya user...");
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error("❌ Hitilafu ya Session:", sessionError.message);
        navigate('/dashboard/register-supplier');
        return;
      }

      const currentUser = session?.user;
      console.log("✅ 2. Session imepatikana. User ID ni:", currentUser?.id || "Hakuna user (Mgeni)");

      if (currentUser) {
        console.log("🛑 3. Inakagua kama ni Muuzaji (Supplier)");
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', currentUser.id)
          .single();

        if (!profileError && profileData?.role === 'supplier') {
          console.log("📦 4. Ni Supplier, inatafuta Store ID...");
          const { data: storeData, error: storeError } = await supabase
            .from('stores_engine')
            .select('id')
            .eq('owner_id', currentUser.id)
            .limit(1)
            .single();

          if (!storeError && storeData) {
            console.log("✅ 5. Store ID imepatikana:", storeData.id);
            navigate(`/dashboard/sellerboard/${storeData.id}`);
            return;
          } else {
            console.warn("⚠️ 6. Supplier lakini hana store iliyosajiliwa bado");
            navigate('/create-store');
            return;
          }
        }
        console.log("🚀 User ameingia! Inapeleka kwenye /dashboard/seller...");
        navigate('/dashboard/seller');
      } else {
        console.log("🚶 Ni Mgeni. Inapeleka kwenye /dashboard/register-supplier...");
        navigate('/dashboard/register-supplier');
      }
    } catch (err) {
      console.error("🔥 Error:", err);
      navigate('/dashboard/register-supplier');
    }
  };

  const protectionIconStyle = {
    width: '28px', height: '28px', borderRadius: '50%', display: 'flex',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0
  };

  const updatePosition = (ref) => {
    if (ref && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      return { top: rect.bottom + window.scrollY, left: rect.left + window.scrollX, width: rect.width };
    }
    return { top: 0, left: 0, width: 0 };
  };

  useEffect(() => {
    console.log("=== NAVLINKS MOUNTED/RE-RENDERED ===");
    console.log("Current language:", i18n.language);
  }, [i18n.language, categories]);

  // ===============================================
  // 🔥 MWANZO WA LOGIC YA MOBILE BOTTOM NAV (Imeongezwa hapa!)
  // ===============================================
  if (isMobile) {
    return (
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '60px',
        background: '#fff',
        borderTop: '1px solid #e5e7eb',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 99999,
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}>
        <Link to="/" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#666', textDecoration: 'none', fontSize: '10px' }}>
          <LucideIcons.Home size={24} />
          <span>Home</span>
        </Link>
        <Link to="/categories" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#666', textDecoration: 'none', fontSize: '10px' }}>
          <LucideIcons.Grid size={24} />
          <span>Categories</span>
        </Link>
        <Link to="/cart" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#666', textDecoration: 'none', fontSize: '10px' }}>
          <LucideIcons.ShoppingCart size={24} />
          <span>Cart</span>
        </Link>
        <Link to="/dashboard/login" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#666', textDecoration: 'none', fontSize: '10px' }}>
          <LucideIcons.User size={24} />
          <span>Account</span>
        </Link>
      </div>
    );
  }
  // ===============================================
  // MWISHO WA LOGIC YA MOBILE BOTTOM NAV
  // ===============================================

  // ===============================================
  // DESKTOP NAVIGATION (Inabaki kama ilivyo)
  // ===============================================
  return (
    <nav className="nav-links-container">
      <div className="nav-group-left">
        <div 
          className="nav-wrapper" 
          onMouseEnter={(e) => handleMouseEnter('categories', e)} 
          onMouseLeave={handleMouseLeave}
          style={{ position: 'relative', paddingBottom: '8px' }}
        >
          <span className="category-toggle" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <LucideIcons.Menu size={20} strokeWidth={2.5} /> {t('all_categories')}
          </span>
          {activeNav === 'categories' && (
            <div style={{ position: 'absolute', bottom: '-8px', left: '0', right: '0', height: '3px', backgroundColor: '#ff6a00', borderRadius: '2px', transition: 'all 0.2s ease' }} />
          )}
          {activeMenu === 'categories' && createPortal(
            <div className="mega-menu-container" onMouseEnter={() => handleMouseEnter('categories')} onMouseLeave={handleMouseLeave} style={{ position: 'fixed', top: '100px', left: '0', right: '0', height: '520px', zIndex: 9999, backgroundColor: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <div className="mega-menu-inner" style={{ display: 'flex', height: '100%' }}>
                <aside className="mega-menu-sidebar" style={{ width: '280px', borderRight: '1px solid #eee', overflowY: 'auto' }}>
                  {viewMode === 'products' ? (
                    categories.map((cat) => (
                      <div key={cat.id} className={`sidebar-item ${selectedParent?.id === cat.id ? 'active' : ''}`} onMouseEnter={() => setSelectedParent(cat)} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 20px', cursor: 'pointer' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <DynamicIcon name={cat.icon_name} />
                          <span>{getDisplayName(cat)}</span>
                        </div>
                        <LucideIcons.ChevronRight size={16} />
                      </div>
                    ))
                  ) : (
                    <>
                      <div onClick={() => setViewMode('products')} className="sidebar-back-header" style={{ padding: '15px 20px', cursor: 'pointer', fontWeight: 'bold', color: '#ff6a00', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <LucideIcons.ChevronLeft size={18} /> {t('back')}
                      </div>
                      {subCategories.map((sub) => (
                        <div key={sub.id} onMouseEnter={() => setSelectedSubForLeaf(sub)} className={`sidebar-item ${selectedSubForLeaf?.id === sub.id ? 'active' : ''}`} style={{ padding: '12px 25px', cursor: 'pointer', fontSize: '14px' }}>
                          {getDisplayName(sub)}
                        </div>
                      ))}
                    </>
                  )}
                </aside>
                <main className="mega-menu-content" style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
                  <div className="content-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>
                      {viewMode === 'products' ? `Top Categories: ${getDisplayName(selectedParent)}` : getDisplayName(selectedSubForLeaf)}
                    </h3>
                    {viewMode === 'products' && (
                      <button onClick={() => setViewMode('subcategories')} className="view-all-btn" style={{ color: '#ff6a00', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                        {t('view_all')} <LucideIcons.ChevronRight size={14} />
                      </button>
                    )}
                  </div>
                  <div className="category-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '20px' }}>
                    {viewMode === 'products' ? (
                      <>
                        {featuredProducts.map((leaf) => (
                          <Link to={`/category/${leaf.leaf_category_id}`} key={leaf.id} className="grid-item" style={{ textDecoration: 'none', color: 'inherit', textAlign: 'center' }}>
                            <div className="image-circle" style={{ width: '90px', height: '90px', borderRadius: '50%', backgroundColor: '#f5f5f5', margin: '0 auto 10px', overflow: 'hidden', border: '1px solid #eee' }}>
                              <img src={leaf.cover_image || placeholderImg} alt={getDisplayName(leaf.leaf_categories)} onError={(e) => { e.target.src = placeholderImg; }} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <p className="grid-text" style={{ fontSize: '12px', margin: 0 }}>{getDisplayName(leaf.leaf_categories) || "Kategoria"}</p>
                          </Link>
                        ))}
                        <div onClick={() => setViewMode('subcategories')} className="grid-item see-all-card" style={{ textAlign: 'center', cursor: 'pointer' }}>
                          <div className="image-circle see-all-circle" style={{ width: '90px', height: '90px', borderRadius: '50%', border: '2px dashed #ff6a00', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.3s ease' }}>
                            <LucideIcons.Plus size={30} color="#ff6a00" />
                          </div>
                          <p style={{ color: '#ff6a00', fontWeight: 'bold', fontSize: '12px' }}>{t('see_all')}</p>
                        </div>
                      </>
                    ) : (
                      leafsForSub.map((leaf) => (
                        <Link to={`/category/${leaf.id}`} key={leaf.id} className="grid-item" style={{ textDecoration: 'none', color: 'inherit', textAlign: 'center' }}>
                          <div className="image-circle" style={{ width: '90px', height: '90px', borderRadius: '50%', backgroundColor: '#f9f9f9', margin: '0 auto 10px', overflow: 'hidden', border: '1px solid #eee' }}>
                            <img src={leaf.image_url || placeholderImg} alt={getDisplayName(leaf)} onError={(e) => { e.target.src = placeholderImg; }} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                          <p className="grid-text" style={{ fontSize: '12px', margin: 0 }}>{getDisplayName(leaf)}</p>
                        </Link>
                      ))
                    )}
                  </div>
                </main>
              </div>
            </div>,
            document.body
          )}
        </div>

        <Link to="/advertise" className="nav-item" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: '#111', padding: '0 10px' }}>
          <span style={{ fontSize: '15px', fontWeight: '600', whiteSpace: 'nowrap', lineHeight: 'normal' }}>{t('skyfall_ads')}</span>
        </Link>

        <div ref={protectionsRef} className="nav-wrapper" onMouseEnter={(e) => handleMouseEnter('protections', e)} onMouseLeave={handleMouseLeave} style={{ position: 'relative', paddingBottom: '8px' }}>
          <Link className="nav-item" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: '#111' }}>
            <span style={{ fontSize: '15px' }}>{t('order_protections')}</span>
          </Link>
          {activeMenu === 'protections' && (
            <div style={{ position: 'absolute', bottom: '-8px', left: '0', right: '0', height: '3px', backgroundColor: '#ff6a00', borderRadius: '2px', transition: 'all 0.2s ease' }} />
          )}

        {activeMenu === 'protections' && createPortal(
  <div 
    onMouseEnter={() => handleMouseEnter('protections')} 
    onMouseLeave={handleMouseLeave} 
    style={{ 
      position: 'fixed', 
      top: `${protectionsMenuPos.top}px`, /* 🔥 Ondoa +5 hapa */
      left: 0, /* 🔥 Panua kabisa kushoto */
      right: 0, /* 🔥 Panua kabisa kulia */
      width: '100vw', /* 🔥 Inashika upana wote wa skrini */
      backgroundColor: 'white', 
      boxShadow: '0 15px 35px rgba(0,0,0,0.2)', 
      zIndex: 11000, /* 🔥 Ongeza index ili isifikwe na kitu kingine */
      borderBottom: '1px solid #ddd' /* 🔥 Badala ya border kuizunguka, weka chini tu */
    }}
  >
    {/* 🔥 HAPA NDIYO SIRI: Container ya ndani inaweka maandishi katikati ya heder (1250px) */}
    <div style={{ 
      maxWidth: '1250px', 
      margin: '0 auto', 
      padding: '30px 20px', 
      display: 'grid', 
      gridTemplateColumns: '1fr 1fr 1fr', 
      gap: '40px' 
    }}>
      
      {/* Sehemu yako ya kwanza: Ulinzi wa Malipo */}
      <div>
        <h4 style={headerStyle}>Ulinzi wa Malipo</h4>
        <ul style={ulStyle}>
          <li style={{ ...liStyle, display: 'flex', alignItems: 'center', gap: '10px' }}><LucideIcons.Lock size={16} color="#27ae60" /><Link to="/payment-protection" style={linkStyle}>Malipo yako yanalindwa</Link></li>
          <li style={{ ...liStyle, display: 'flex', alignItems: 'center', gap: '10px' }}><LucideIcons.CreditCard size={16} color="#27ae60" /><Link to="/refund-policy" style={linkStyle}>Sera ya Kurudisha Pesa</Link></li>
          <li style={{ ...liStyle, display: 'flex', alignItems: 'center', gap: '10px' }}><LucideIcons.ShieldCheck size={16} color="#27ae60" /><Link to="/buyer-protection" style={linkStyle}>Ulinzi wa Mnunuzi</Link></li>
        </ul>
      </div>
      
      {/* Sehemu yako ya pili: Ukiwa na Tatizo la Bidhaa */}
      <div>
        <h4 style={headerStyle}>Ukiwa na Tatizo la Bidhaa</h4>
        <ul style={ulStyle}>
          <li style={{ ...liStyle, display: 'flex', alignItems: 'center', gap: '10px' }}><LucideIcons.FileWarning size={16} color="#dc2626" /><Link to="/dispute" style={linkStyle}>Fungua Shauri (Dispute)</Link></li>
          <li style={{ ...liStyle, display: 'flex', alignItems: 'center', gap: '10px' }}><LucideIcons.Flag size={16} color="#dc2626" /><Link to="/report-product" style={linkStyle}>Ripoti Bidhaa Mbovu</Link></li>
          <li style={{ ...liStyle, display: 'flex', alignItems: 'center', gap: '10px' }}><LucideIcons.MessageCircle size={16} color="#dc2626" /><Link to="/contact-support" style={linkStyle}>Wasiliana na Msaada</Link></li>
        </ul>
      </div>
      
      {/* Sehemu yako ya tatu: Uhakiki wa Bidhaa */}
      <div>
        <h4 style={headerStyle}>Uhakiki wa Bidhaa</h4>
        <ul style={ulStyle}>
          <li style={{ ...liStyle, display: 'flex', alignItems: 'center', gap: '10px' }}><LucideIcons.CheckCircle size={16} color="#0071dc" /><Link to="/verification" style={linkStyle}>Bidhaa Zilizothibitishwa</Link></li>
          <li style={{ ...liStyle, display: 'flex', alignItems: 'center', gap: '10px' }}><LucideIcons.Star size={16} color="#0071dc" /><Link to="/reviews" style={linkStyle}>Mapitio ya Wanunuzi</Link></li>
          <li style={{ ...liStyle, display: 'flex', alignItems: 'center', gap: '10px' }}><LucideIcons.Truck size={16} color="#0071dc" /><Link to="/shipping-protection" style={linkStyle}>Ulinzi wa Usafirishaji</Link></li>
        </ul>
      </div>

    </div>
  </div>,
  document.body
)}
        </div>
      </div>

      <div className="nav-group-right" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <span ref={buyerRef} className="nav-item" onMouseEnter={(e) => handleMouseEnter('buyerCentral', e)} onMouseLeave={handleMouseLeave} style={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', cursor: 'pointer', position: 'relative', paddingBottom: '8px' }}>
          <span style={{ fontSize: '15px' }}>{t('buyer_central')}</span>
          {activeMenu === 'buyerCentral' && ( <div style={{ position: 'absolute', bottom: '-8px', left: '0', right: '0', height: '3px', backgroundColor: '#ff6a00', borderRadius: '2px', transition: 'all 0.2s ease' }} /> )}
        </span>

        {activeMenu === 'buyerCentral' && createPortal(
  <div 
    onMouseEnter={() => handleMouseEnter('buyerCentral')} 
    onMouseLeave={handleMouseLeave} 
    style={{ 
      position: 'fixed', 
      top: `${buyerMenuPos.top}px`, /* 🔥 Ondoa +5 */
      left: 0, /* 🔥 Panua kabisa */
      right: 0,
      width: '100vw', 
      backgroundColor: 'white', 
      boxShadow: '0 15px 35px rgba(0,0,0,0.2)', 
      zIndex: 11000, /* 🔥 Ongeza kuwa 11000 */
      borderBottom: '1px solid #ddd' /* Badala ya border zote, weka chini tu */
    }}
  >
    {/* 🔥 Inner Container: Hii inapanga maandishi kuwa katikati ya 1250px */}
    <div style={{ 
      maxWidth: '1250px', 
      margin: '0 auto', 
      padding: '20px 20px', 
      display: 'grid', 
      gridTemplateColumns: '1fr 1fr 1fr 1.2fr', 
      gap: '30px' 
    }}>
      
      {/* Sehemu ya Kwanza */}
      <div>
        <h4 style={headerStyle}>Kwanini Skyfall?</h4>
        <ul style={ulStyle}>
          <li style={liStyle}><Link to="/about-skyfall" style={linkStyle}>Skyfall ni nini?</Link></li>
          <li style={liStyle}><Link to="/how-to-buy" style={linkStyle}>Jinsi ya kununua (Guide)</Link></li>
          <li style={liStyle}><Link to="/wholesale-benefits" style={linkStyle}>Faida za wanachama</Link></li>
          <li style={liStyle}><Link to="/blogs" style={linkStyle}>Makala za Biashara</Link></li>
        </ul>
      </div>
      
      {/* Sehemu ya Pili */}
      <div>
        <h4 style={headerStyle}>Huduma za Biashara</h4>
        <ul style={ulStyle}>
          <li style={liStyle}><Link to="/protections" style={linkStyle}>Ulinzi wa Malipo</Link></li>
          <li style={liStyle}><Link to="/logistics" style={linkStyle}>Fuatilia Stendi (Logistics)</Link></li>
          <li style={liStyle}><Link to="/quotes" style={linkStyle}>Maombi ya Invoice</Link></li>
          <li style={liStyle}><Link to="/verification" style={linkStyle}>Uhakiki wa Bidhaa</Link></li>
        </ul>
      </div>
      
      {/* Sehemu ya Tatu */}
      <div>
        <h4 style={headerStyle}>Msaada & Huduma</h4>
        <ul style={ulStyle}>
          <li style={liStyle}><Link to="/help-center" style={linkStyle}>Kwa Wanunuzi</Link></li>
          <li style={liStyle}><Link to="/dispute" style={linkStyle}>Fungua Shauri (Dispute)</Link></li>
          <li style={liStyle}><Link to="/report" style={linkStyle}>Ripoti Tatizo</Link></li>
          <li style={liStyle}><a href="https://wa.me/255..." style={linkStyle}>Chat nasi WhatsApp</a></li>
        </ul>
      </div>
      
      {/* Sehemu ya Nne (Upande wa kulia) */}
      <div style={{ borderLeft: '1px solid #eee', paddingLeft: '30px' }}>
        <h4 style={headerStyle}>Washirika Wetu</h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', border: '1px solid #eee', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff6a00' }}>SF</div>
          <div>
            <div style={{ fontWeight: '600', fontSize: '14px' }}>Unganisha Duka Lako</div>
            <p style={{ fontSize: '12px', color: '#666', margin: '4px 0' }}>Sajili duka lako uanze kuuza jumla nchi nzima.</p>
            <Link to="/create-store" style={{ color: '#ff6a00', fontSize: '12px', fontWeight: 'bold', textDecoration: 'none' }}>Anza Sasa →</Link>
          </div>
        </div>
      </div>

    </div>
  </div>,
  document.body
)}
        
        <span ref={helpRef} className="nav-item" onMouseEnter={(e) => handleMouseEnter('helpCenter', e)} onMouseLeave={handleMouseLeave} style={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', cursor: 'pointer', position: 'relative', paddingBottom: '8px' }}>
          <span style={{ fontSize: '15px' }}>{t('help_center')}</span>
          {activeMenu === 'helpCenter' && (<div style={{ position: 'absolute', bottom: '-8px', left: '0', right: '0', height: '3px', backgroundColor: '#ff6a00', borderRadius: '2px', transition: 'all 0.2s ease' }} />)}
        </span>

        {activeMenu === 'helpCenter' && createPortal(
  <div 
    onMouseEnter={() => handleMouseEnter('helpCenter')} 
    onMouseLeave={handleMouseLeave} 
    style={{ 
      position: 'fixed', 
      top: `${helpMenuPos.top}px`, /* 🔥 Ondoa +5 */
      left: 0, /* 🔥 Panua kabisa kushoto */
      right: 0, /* 🔥 Panua kabisa kulia */
      width: '100vw', 
      backgroundColor: 'white', 
      boxShadow: '0 15px 35px rgba(0,0,0,0.2)', 
      zIndex: 11000, /* 🔥 Ongeza index ili isifikwe */
      borderBottom: '1px solid #ddd' /* 🔥 Badala ya border zote, weka chini tu */
    }}
  >
    {/* 🔥 INNER CONTAINER: Hii inaweka maandishi kuwa katikati ya 1250px */}
    <div style={{ 
      maxWidth: '1250px', 
      margin: '0 auto', 
      padding: '30px 20px', 
      display: 'grid', 
      gridTemplateColumns: '1fr 1fr 1fr 1.2fr', 
      gap: '40px' 
    }}>
      
      {/* Sehemu ya kwanza */}
      <div>
        <h4 style={headerStyle}>Msaada kwa Wanunuzi</h4>
        <ul style={ulStyle}>
          <li style={liStyle}><Link to="/help-center" style={linkStyle}>Kituo cha Msaada (FAQ)</Link></li>
          <li style={liStyle}><Link to="/how-to-buy" style={linkStyle}>Jinsi ya kununua</Link></li>
          <li style={liStyle}><Link to="/shipping-info" style={linkStyle}>Maelezo ya Usafirishaji</Link></li>
          <li style={liStyle}><Link to="/refund-policy" style={linkStyle}>Sera ya kurudisha pesa</Link></li>
        </ul>
      </div>
      
      {/* Sehemu ya pili */}
      <div>
        <h4 style={headerStyle}>Usalama & Sheria</h4>
        <ul style={ulStyle}>
          <li style={liStyle}><Link to="/dispute" style={linkStyle}>Fungua Shauri (Dispute)</Link></li>
          <li style={liStyle}><Link to="/report-abuse" style={linkStyle}>Ripoti utapeli/ubadhifu</Link></li>
          <li style={liStyle}><Link to="/terms" style={linkStyle}>Vigezo na Masharti</Link></li>
          <li style={liStyle}><Link to="/privacy" style={linkStyle}>Sera ya Faragha</Link></li>
        </ul>
      </div>
      
      {/* Sehemu ya tatu */}
      <div>
        <h4 style={headerStyle}>Wasiliana Nasi</h4>
        <ul style={ulStyle}>
          <li style={liStyle}><a href="https://wa.me/255..." style={linkStyle}>Chat na Msaidizi (WhatsApp)</a></li>
          <li style={liStyle}><Link to="/contact-us" style={linkStyle}>Tutumie Barua Pepe</Link></li>
          <li style={liStyle}><Link to="/office-location" style={linkStyle}>Ofisi zetu zilipo</Link></li>
        </ul>
      </div>
      
      {/* Sehemu ya nne (Upande wa kulia) */}
      <div style={{ borderLeft: '1px solid #eee', paddingLeft: '30px' }}>
        <h4 style={headerStyle}>Jifunze zaidi</h4>
        <div style={{ padding: '15px', border: '1px solid #eef2ff', borderRadius: '8px', backgroundColor: '#f8faff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}><LucideIcons.PlayCircle size={24} color="#0071dc" /><span style={{ fontWeight: '600', fontSize: '14px' }}>Video Tutorials</span></div>
          <p style={{ fontSize: '12px', color: '#666', lineHeight: '1.5' }}>Tazama video fupi za jinsi ya kutumia Skyfall kupata bidhaa bora kwa bei ya jumla.</p>
          <Link to="/tutorials" style={{ color: '#0071dc', fontSize: '12px', fontWeight: 'bold', textDecoration: 'none', display: 'block', marginTop: '10px' }}>Tazama Video →</Link>
        </div>
      </div>

    </div>
  </div>,
  document.body
)}

        <div onClick={handleSellNavigation} className="nav-sell-link" onMouseEnter={() => setActiveNav('sell')} onMouseLeave={() => setActiveNav(null)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', whiteSpace: 'nowrap', flexShrink: 0, padding: '8px 12px', border: '1px solid #eee', borderRadius: '4px', textDecoration: 'none', color: 'inherit', backgroundColor: user ? 'transparent' : '#fff7f2', position: 'relative', cursor: 'pointer' }}>
          <span style={{ fontWeight: '500', fontSize: '14px' }}>{t('sell_on_skyfall', 'Sell on Skyfall.com')}</span>
          {activeNav === 'sell' && (<div style={{ position: 'absolute', bottom: '-8px', left: '0', right: '0', height: '3px', backgroundColor: '#ff6a00', borderRadius: '2px', transition: 'all 0.2s ease' }} />)}
        </div>
      </div>
    </nav>
  );
}