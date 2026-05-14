import { useState, useEffect, useRef } from "react";
import { supabase } from "../supabaseClient";
import { createPortal } from "react-dom";
import * as LucideIcons from "lucide-react"; 
import { Link, useNavigate } from "react-router-dom"; // Ongeza useNavigate
import "../NavLinks.css";
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext.jsx';


export default function NavLinks() {
  const { t, i18n } = useTranslation();
   const { language } = useLanguage(); // Ongeza hii
  const [forceUpdate, setForceUpdate] = useState(0); // Ongeza hii
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
// Unaweza kutumia picha yoyote ya placeholder hapa
const placeholderImg = "https://via.placeholder.com/150?text=Skyfall+Product";

// Refs za kupata position sahihi ya kila element
const categoriesRef = useRef(null);
const exposeRef = useRef(null);
const protectionsRef = useRef(null);
const buyerRef = useRef(null);
const helpRef = useRef(null);

// State za positions (zote zinatumia left + width)
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

 // Badilisha hii
useEffect(() => {
  setForceUpdate(prev => prev + 1);
}, [language]);

// Iwe hivi (iongeze i18n.language pia)
useEffect(() => {
  setForceUpdate(prev => prev + 1);
  console.log("Language changed to:", language, i18n.language);
}, [language, i18n.language]);



useEffect(() => {
  // Angalia kama kuna mtu aliyelogin sasa hivi
  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user ?? null);
  };
  checkUser();

  // Sikiliza mabadiliko (mfano: akilogout au akilogin)
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    setUser(session?.user ?? null);
  });

  return () => subscription.unsubscribe();
}, []);

useEffect(() => {
  const checkUserStore = async () => {
    if (!user) {
      console.log("❌ No user, checkingStore = false");
      setCheckingStore(false);
      return;
    }
    
    console.log("🔍 User ID:", user.id);
    
    try {
      // Badilisha kutoka .maybeSingle() hadi .then() au .select() tu
      const { data, error } = await supabase
        .from('stores_engine')
        .select('id, store_name, owner_id')
        .eq('owner_id', user.id);
      
      console.log("📦 Query result:", { data, error });
      
      if (error) throw error;
      
      // Angalia kama kuna data (inaweza kuwa multiple rows)
      if (data && data.length > 0) {
        setHasStore(true);
        console.log("✅ Store found! Number of stores:", data.length);
      } else {
        setHasStore(false);
        console.log("❌ No store found for this user");
      }
    } catch (err) {
      console.error("❌ Error checking store:", err.message);
      setHasStore(false);
    } finally {
      setCheckingStore(false);
    }
  };
  
  checkUserStore();
}, [user]);

 useEffect(() => {
  async function fetchCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')  // '*' inachukua name, name_sw, icon_name, na columns zingine zote
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
  // Tunavuta bidhaa ambazo parent_category_id inafanana na ID ya kategoria kuu
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
    .eq('parent_category_id', parentId) // TUNATUMIA COLUMN MPYA HAPA
    .not('cover_image', 'is', null)
    .limit(50); // Vuta nyingi kidogo ili tuchuje unique kashu

  if (!error && data) {
    // Hapa tunahakikisha kategoria moja inatokea mara moja tu (Unique)
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

    setFeaturedProducts(uniqueCategories.slice(0, 17)); // Chukua 17 tu za mwanzo
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
        .eq('category_id', selectedSubForLeaf.id) // Hii inachuja bidhaa za sub-category husika
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
              name_sw: item.leaf_categories.name_sw,  // Ongeza hii line
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
  console.log("getDisplayName called - language:", i18n.language, "item:", item.name, "result:", result);
  return result;
};

const handleMouseEnter = (menuName, e) => {
  if (timeoutRef.current) clearTimeout(timeoutRef.current);
  setActiveMenu(menuName);
  setActiveNav(menuName);

  // Kama ni Buyer Central
  if (menuName === 'buyerCentral' && e) {
    const rect = e.currentTarget.getBoundingClientRect();
    setBuyerMenuPos({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX  // Badilisha: right → left
    });
  }
  
  // Kama ni Help Center
  if (menuName === 'helpCenter' && e) {
    const rect = e.currentTarget.getBoundingClientRect();
    setHelpMenuPos({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX  // Badilisha: right → left
    });
  }
  
  // Kama ni Expose Store (Skyfall Ads)
  if (menuName === 'exposeStore' && e) {
    const rect = e.currentTarget.getBoundingClientRect();
    setExposeMenuPos({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX  // Hii tayari iko sawa
    });
  }

  // Kama ni Order Protections
  if (menuName === 'protections' && e) {
    const rect = e.currentTarget.getBoundingClientRect();
    setProtectionsMenuPos({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX  // Badilisha: right → left
    });
  }
};

const handleMouseLeave = () => {
  timeoutRef.current = setTimeout(() => {
    setActiveMenu(null);
    //setActiveNav(null); // Ongeza hii - inaondoa active indicator
  }, 200);
};

  const DynamicIcon = ({ name, size = 18 }) => {
    const IconComponent = LucideIcons[name] || LucideIcons.Package;
    return <IconComponent size={size} />;
  };
// Add these style constants before the return statement (karibu na line 150)
const dropdownLinkStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '10px 12px',
  borderRadius: '8px',
  textDecoration: 'none',
  color: '#333',
  transition: 'background-color 0.2s ease',
  cursor: 'pointer'
};

const iconCircleStyle = (bgColor) => ({
  width: '36px',
  height: '50px',
  borderRadius: '50%',
  backgroundColor: bgColor,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0
});

// ADD THESE NEW STYLES FOR THE BUYER CENTRAL DROPDOWN:
const headerStyle = {
  fontSize: '16px',
  fontWeight: '600',
  marginBottom: '15px',
  color: '#111',
  borderLeft: '3px solid #ff6a00',
  paddingLeft: '12px'
};

const ulStyle = {
  listStyle: 'none',
  padding: 0,
  margin: 0
};

const liStyle = {
  marginBottom: '12px',
  fontSize: '13px'
};

const linkStyle = {
  textDecoration: 'none',
  color: '#555',
  transition: 'color 0.2s ease'
};

// Active indicator style - mstari wa chini
const activeIndicatorStyle = (isActive) => ({
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-8px',
    left: '0',
    right: '0',
    height: '3px',
    backgroundColor: '#ff6a00',
    borderRadius: '2px',
    transition: 'width 0.2s ease',
    width: isActive ? '100%' : '0%'
  }
});

const handleSellNavigation = () => {
  if (!user) {
    navigate('/dashboard/login', { 
      state: { message: t('please_login') }
    });
    return;
  }
  
  // User ameingia, angalia kama ana store
  if (hasStore) {
    navigate('/dashboard/physical/123'); // Au store ID yoyote
  } else {
    navigate('/create-store');
  }
};

// Ongeza kwenye style constants zako
const protectionIconStyle = {
  width: '28px',
  height: '28px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0
};

const updatePosition = (ref) => {
  if (ref && ref.current) {
    const rect = ref.current.getBoundingClientRect();
    return {
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
      width: rect.width
    };
  }
  return { top: 0, left: 0, width: 0 };
};

useEffect(() => {
  console.log("=== NAVLINKS MOUNTED/RE-RENDERED ===");
  console.log("Current language:", i18n.language);
  console.log("Categories count:", categories.length);
  if (categories.length > 0) {
    console.log("First category name:", categories[0].name);
    console.log("First category name_sw:", categories[0].name_sw);
  }
}, [i18n.language, categories]);

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
  
  {/* Active Indicator - Bottom Line */}
  {activeNav === 'categories' && (
    <div style={{
      position: 'absolute',
      bottom: '-8px',
      left: '0',
      right: '0',
      height: '3px',
      backgroundColor: '#ff6a00',
      borderRadius: '2px',
      transition: 'all 0.2s ease'
    }} />
  )}

  {activeMenu === 'categories' && createPortal(
    <div 
      className="mega-menu-container" 
      onMouseEnter={() => handleMouseEnter('categories')} 
      onMouseLeave={handleMouseLeave} 
      style={{ 
        position: 'fixed', 
        top: '100px', 
        left: '0', 
        right: '0', 
        height: '520px', 
        zIndex: 9999, 
        backgroundColor: 'white', 
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
      }}
    >
      <div className="mega-menu-inner" style={{ display: 'flex', height: '100%' }}>
        
        <aside className="mega-menu-sidebar" style={{ width: '280px', borderRight: '1px solid #eee', overflowY: 'auto' }}>
          {viewMode === 'products' ? (
            categories.map((cat) => (
              <div 
                key={cat.id} 
                className={`sidebar-item ${selectedParent?.id === cat.id ? 'active' : ''}`} 
                onMouseEnter={() => setSelectedParent(cat)} 
                style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 20px', cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <DynamicIcon name={cat.icon_name} />
                  <span>{getDisplayName(cat)}</span>
                </div>
                <LucideIcons.ChevronRight size={16} />
              </div>
            ))
          ) : (
            <>
              <div 
                onClick={() => setViewMode('products')} 
                className="sidebar-back-header" 
                style={{ 
                  padding: '15px 20px', 
                  cursor: 'pointer', 
                  fontWeight: 'bold', 
                  color: '#ff6a00', 
                  borderBottom: '1px solid #eee', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px' 
                }}
              >
                <LucideIcons.ChevronLeft size={18} /> {t('back')}
              </div>
              {subCategories.map((sub) => (
                <div 
                  key={sub.id} 
                  onMouseEnter={() => setSelectedSubForLeaf(sub)} 
                  className={`sidebar-item ${selectedSubForLeaf?.id === sub.id ? 'active' : ''}`} 
                  style={{ padding: '12px 25px', cursor: 'pointer', fontSize: '14px' }}
                >
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
              <button 
                onClick={() => setViewMode('subcategories')} 
                className="view-all-btn" 
                style={{ 
                  color: '#ff6a00', 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer', 
                  fontWeight: 'bold', 
                  display: 'flex', 
                  alignItems: 'center' 
                }}
              >
                {t('view_all')} <LucideIcons.ChevronRight size={14} />
              </button>
            )}
          </div>

          <div className="category-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '20px' }}>
            {viewMode === 'products' ? (
              <>
                {featuredProducts.map((leaf) => (
                  <Link 
                    to={`/category/${leaf.leaf_category_id}`} 
                    key={leaf.id} 
                    className="grid-item" 
                    style={{ textDecoration: 'none', color: 'inherit', textAlign: 'center' }}
                  >
                    <div className="image-circle" style={{ width: '90px', height: '90px', borderRadius: '50%', backgroundColor: '#f5f5f5', margin: '0 auto 10px', overflow: 'hidden', border: '1px solid #eee' }}>
                      <img 
                        src={leaf.cover_image || placeholderImg} 
                        alt={getDisplayName(leaf.leaf_categories)}
                        onError={(e) => { e.target.src = placeholderImg; }} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                    </div>
                    <p className="grid-text" style={{ fontSize: '12px', margin: 0 }}>
                      {getDisplayName(leaf.leaf_categories) || "Kategoria"}
                    </p>
                  </Link>
                ))}

                <div 
                  onClick={() => setViewMode('subcategories')} 
                  className="grid-item see-all-card" 
                  style={{ textAlign: 'center', cursor: 'pointer' }}
                >
                  <div className="image-circle see-all-circle" style={{ width: '90px', height: '90px', borderRadius: '50%', border: '2px dashed #ff6a00', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.3s ease' }}>
                    <LucideIcons.Plus size={30} color="#ff6a00" />
                  </div>
                  <p style={{ color: '#ff6a00', fontWeight: 'bold', fontSize: '12px' }}>{t('see_all')}</p>
                </div>
              </>
            ) : (
              leafsForSub.map((leaf) => (
                <Link 
                  to={`/category/${leaf.id}`} 
                  key={leaf.id} 
                  className="grid-item" 
                  style={{ textDecoration: 'none', color: 'inherit', textAlign: 'center' }}
                >
                  <div className="image-circle" style={{ width: '90px', height: '90px', borderRadius: '50%', backgroundColor: '#f9f9f9', margin: '0 auto 10px', overflow: 'hidden', border: '1px solid #eee' }}>
                    <img 
                      src={leaf.image_url || placeholderImg} 
                      alt={getDisplayName(leaf)}
                      onError={(e) => { e.target.src = placeholderImg; }}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
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

<div 
  ref={exposeRef} 
  className="nav-wrapper" 
  onMouseEnter={(e) => handleMouseEnter('exposeStore', e)} 
  onMouseLeave={handleMouseLeave}
  style={{ position: 'relative', paddingBottom: '8px' }}
>
  <Link
    className="nav-item" 
    style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '7px',
      textDecoration: 'none', 
      color: '#111',
      padding: '0 10px'
    }}
  >
    <LucideIcons.Zap 
      size={20}
      style={{ color: '#ff6a00', flexShrink: 0 }} 
    /> 
    <span style={{ 
      fontSize: '15px',
      fontWeight: '600',
      whiteSpace: 'nowrap',
      lineHeight: 'normal'
    }}>
      {t('skyfall_ads')}
    </span>
  </Link>

  {/* Active Indicator - Bottom Line */}
  {activeMenu === 'exposeStore' && (
    <div style={{ 
      position: 'fixed', 
      top: `${exposeMenuPos.top + 8}px`, // Ongeza kapengo kidogo toka juu
      left: `${exposeMenuPos.left}px`,   // Itakaa kuanzia pale neno lilipo
      width: '850px',                    // Weka upana ule unaoutaka
      backgroundColor: 'white', 
      boxShadow: '0 20px 40px rgba(0,0,0,0.12)', 
      borderRadius: '12px', 
      padding: '40px', 
      zIndex: 100000,
      border: '1px solid #e5e7eb',
      display: 'grid',
      gridTemplateColumns: '1.2fr 1fr 1fr', 
      gap: '40px'
    }} />
  )}

  {activeMenu === 'exposeStore' && createPortal(
    <div 
      onMouseEnter={() => handleMouseEnter('exposeStore')} 
      onMouseLeave={handleMouseLeave}
      style={{ 
        position: 'fixed', 
        top: `${exposeMenuPos.top}px`, 
        left: '20px', 
        right: '20px', 
        backgroundColor: 'white', 
        boxShadow: '0 20px 40px rgba(0,0,0,0.12)', 
        borderRadius: '0 0 12px 12px', 
        padding: '40px', 
        zIndex: 100000,
        border: '1px solid #e5e7eb',
        borderTop: 'none',
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr 1fr', 
        gap: '50px'
      }}
    >
      {/* SEHEMU YA 1: BANNER YA KUVUTIA */}
      <div style={{ 
        backgroundColor: '#fff7f2', 
        padding: '30px', 
        borderRadius: '12px', 
        border: '1px solid #ffe8d9',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        <h4 style={{ 
          fontSize: '20px', 
          fontWeight: '700', 
          color: '#ff6a00', 
          marginBottom: '15px',
          lineHeight: '1.2'
        }}>
          Ongeza Mauzo na <br/> Skyfall Advertising
        </h4>
        <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.7', marginBottom: '25px' }}>
          Usisubiri wateja wakutafute. Huduma ya matangazo inakuweka mstari wa mbele mbele ya maelfu ya wanunuzi wa jumla kila siku nchi nzima.
        </p>
        <Link to="/ad-request" style={{ 
          backgroundColor: '#ff6a00', 
          color: 'white', 
          padding: '12px 24px', 
          borderRadius: '6px', 
          textDecoration: 'none', 
          fontWeight: '600',
          display: 'inline-block',
          textAlign: 'center',
          fontSize: '14px',
          width: 'fit-content',
          transition: 'background 0.3s'
        }}>
          Anza Kutangaza Sasa
        </Link>
      </div>

      {/* SEHEMU YA 2: FAIDA ZA KUTANGAZA */}
      <div>
        <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#111', marginBottom: '20px' }}>
          Kwanini Utangaze?
        </h4>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          <li style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
            <div style={{ color: '#27ae60', marginTop: '2px' }}><LucideIcons.TrendingUp size={20} /></div>
            <div>
              <div style={{ fontWeight: '600', fontSize: '14px', color: '#333' }}>Ongeza Watazamaji</div>
              <div style={{ fontSize: '13px', color: '#666' }}>Bidhaa zako huonekana mara 5 zaidi ya duka la kawaida.</div>
            </div>
          </li>
          <li style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
            <div style={{ color: '#0071dc', marginTop: '2px' }}><LucideIcons.Target size={20} /></div>
            <div>
              <div style={{ fontWeight: '600', fontSize: '14px', color: '#333' }}>Wateja Walengwa</div>
              <div style={{ fontSize: '13px', color: '#666' }}>Tangaza moja kwa moja kwa watu wanaotafuta unachouza.</div>
            </div>
          </li>
          <li style={{ display: 'flex', gap: '15px' }}>
            <div style={{ color: '#f1c40f', marginTop: '2px' }}><LucideIcons.ShieldCheck size={20} /></div>
            <div>
              <div style={{ fontWeight: '600', fontSize: '14px', color: '#333' }}>Jenga Uaminifu</div>
              <div style={{ fontSize: '13px', color: '#666' }}>Maduka yanayotangaza huonekana kuwa thabiti na serious.</div>
            </div>
          </li>
        </ul>
      </div>

      {/* SEHEMU YA 3: VIFURUSHI */}
      <div>
        <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#111', marginBottom: '20px' }}>
          Vifurushi vya Matangazo
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Link to="/ads/keyword" style={{ textDecoration: 'none', color: '#555', fontSize: '14px', padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>Keyword Advertising</Link>
          <Link to="/ads/banner" style={{ textDecoration: 'none', color: '#555', fontSize: '14px', padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>Banner Ads (Home Page)</Link>
          <Link to="/ads/top-ranking" style={{ textDecoration: 'none', color: '#555', fontSize: '14px', padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>Top Ranking Products</Link>
          <Link to="/ads/analytics" style={{ textDecoration: 'none', color: '#555', fontSize: '14px', padding: '8px 0' }}>Ripoti ya Matangazo</Link>
        </div>
        
        <div style={{ 
          marginTop: '30px', 
          padding: '15px', 
          backgroundColor: '#f9fafb', 
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <LucideIcons.PhoneCall size={18} color="#666" />
          <span style={{ fontSize: '13px', color: '#666' }}>Msaada: <b>07XX XXX XXX</b></span>
        </div>
      </div>
    </div>,
    document.body
  )}
</div>

        <div 
         ref={protectionsRef}
  className="nav-wrapper" 
  onMouseEnter={(e) => handleMouseEnter('protections', e)} 
  onMouseLeave={handleMouseLeave}
  style={{ position: 'relative', paddingBottom: '8px' }}
>
  <Link
    className="nav-item" 
    style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '5px',
      textDecoration: 'none',
      color: '#111'
    }}
  >
    <LucideIcons.ShieldCheck size={18} style={{ color: '#0071dc' }} /> 
    <span>{t('order_protections')}</span>
  </Link>

  {/* Active Indicator - Bottom Line */}
  {activeMenu === 'protections' && (
    <div style={{
      position: 'absolute',
      bottom: '-8px',
      left: '0',
      right: '0',
      height: '3px',
      backgroundColor: '#ff6a00',
      borderRadius: '2px',
      transition: 'all 0.2s ease'
    }} />
  )}

  {activeMenu === 'protections' && createPortal(
    <div 
      onMouseEnter={() => handleMouseEnter('protections')} 
      onMouseLeave={handleMouseLeave}
      style={{ 
        position: 'fixed', 
        top: `${protectionsMenuPos.top + 5}px`, 
        left: '20px',
        right: '20px',
        width: 'auto',
        backgroundColor: 'white', 
        boxShadow: '0 15px 35px rgba(0,0,0,0.2)', 
        borderRadius: '4px', 
        padding: '30px',
        zIndex: 10000,
        border: '1px solid #ddd',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '40px'
      }}
    >
      {/* SEHEMU YA 1: ULINZI WA MALIPO */}
     {/* SEHEMU YA 1: ULINZI WA MALIPO */}
<div>
  <h4 style={headerStyle}>Ulinzi wa Malipo</h4>
  <ul style={ulStyle}>
    <li style={{ ...liStyle, display: 'flex', alignItems: 'center', gap: '10px' }}>
      <LucideIcons.Lock size={16} color="#27ae60" />
      <Link to="/payment-protection" style={linkStyle}>Malipo yako yanalindwa</Link>
    </li>
    <li style={{ ...liStyle, display: 'flex', alignItems: 'center', gap: '10px' }}>
      <LucideIcons.CreditCard size={16} color="#27ae60" />  {/* Badilisha hapa */}
      <Link to="/refund-policy" style={linkStyle}>Sera ya Kurudisha Pesa</Link>
    </li>
    <li style={{ ...liStyle, display: 'flex', alignItems: 'center', gap: '10px' }}>
      <LucideIcons.ShieldCheck size={16} color="#27ae60" />
      <Link to="/buyer-protection" style={linkStyle}>Ulinzi wa Mnunuzi</Link>
    </li>
  </ul>
</div>

      {/* SEHEMU YA 2: UKIWA NA TATIZO LA BIDHAA */}
      <div>
        <h4 style={headerStyle}>Ukiwa na Tatizo la Bidhaa</h4>
        <ul style={ulStyle}>
          <li style={{ ...liStyle, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <LucideIcons.FileWarning size={16} color="#dc2626" />
            <Link to="/dispute" style={linkStyle}>Fungua Shauri (Dispute)</Link>
          </li>
          <li style={{ ...liStyle, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <LucideIcons.Flag size={16} color="#dc2626" />
            <Link to="/report-product" style={linkStyle}>Ripoti Bidhaa Mbovu</Link>
          </li>
          <li style={{ ...liStyle, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <LucideIcons.MessageCircle size={16} color="#dc2626" />
            <Link to="/contact-support" style={linkStyle}>Wasiliana na Msaada</Link>
          </li>
        </ul>
      </div>

      {/* SEHEMU YA 3: UHAKIKI WA BIDHAA */}
      <div>
        <h4 style={headerStyle}>Uhakiki wa Bidhaa</h4>
        <ul style={ulStyle}>
          <li style={{ ...liStyle, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <LucideIcons.CheckCircle size={16} color="#0071dc" />
            <Link to="/verification" style={linkStyle}>Bidhaa Zilizothibitishwa</Link>
          </li>
          <li style={{ ...liStyle, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <LucideIcons.Star size={16} color="#0071dc" />
            <Link to="/reviews" style={linkStyle}>Mapitio ya Wanunuzi</Link>
          </li>
          <li style={{ ...liStyle, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <LucideIcons.Truck size={16} color="#0071dc" />
            <Link to="/shipping-protection" style={linkStyle}>Ulinzi wa Usafirishaji</Link>
          </li>
        </ul>
      </div>
    </div>,
    document.body
  )}
</div>

      </div>

{/* RIGHT SIDE LINKS */}
<div className="nav-group-right" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>

  {/* BUYER CENTRAL */}
  <span 
  ref={buyerRef}
    className="nav-item" 
    onMouseEnter={(e) => handleMouseEnter('buyerCentral', e)}
    onMouseLeave={handleMouseLeave}
    style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '5px', 
      whiteSpace: 'nowrap', 
      cursor: 'pointer',
      position: 'relative',
      paddingBottom: '8px'
    }}
  >
    <LucideIcons.Users size={18} /> 
    <span>{t('buyer_central')}</span>
    <LucideIcons.ChevronDown size={14} />

    {/* Active Indicator - Bottom Line */}
    {activeMenu === 'buyerCentral' && (
      <div style={{
        position: 'absolute',
        bottom: '-8px',
        left: '0',
        right: '0',
        height: '3px',
        backgroundColor: '#ff6a00',
        borderRadius: '2px',
        transition: 'all 0.2s ease'
      }} />
    )}
  </span>

  {activeMenu === 'buyerCentral' && createPortal(
    <div 
      onMouseEnter={() => handleMouseEnter('buyerCentral')} 
      onMouseLeave={handleMouseLeave}
      style={{ 
        position: 'fixed', 
        top: `${buyerMenuPos.top + 5}px`, 
        left: '20px',
        right: '20px',
        width: 'auto',
        backgroundColor: 'white', 
        boxShadow: '0 15px 35px rgba(0,0,0,0.2)', 
        borderRadius: '4px', 
        padding: '20px 30px',
        zIndex: 10000,
        border: '1px solid #ddd',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr 1.2fr',
        gap: '30px'
      }}
    >
     {/* SEHEMU YA 1: KWANINI SKYFALL (ABOUT) */}
<div>
  <h4 style={headerStyle}>Kwanini Skyfall?</h4>
  <ul style={ulStyle}>
    <li style={liStyle}>
      <Link to="/about-skyfall" style={linkStyle}>
        Skyfall ni nini?
      </Link>
    </li>

   <li style={liStyle}>
  <Link to="/how-to-buy" style={linkStyle}>
    Jinsi ya kununua (Guide)
  </Link>
</li>

    <li style={liStyle}>
      <Link to="/wholesale-benefits" style={linkStyle}>Faida za wanachama</Link>
    </li>
    <li style={liStyle}>
      <Link to="/blogs" style={linkStyle}>Makala za Biashara</Link>
    </li>
  </ul>
</div>

      {/* SEHEMU YA 2: HUDUMA ZA BIASHARA */}
      <div>
        <h4 style={headerStyle}>Huduma za Biashara</h4>
        <ul style={ulStyle}>
          <li style={liStyle}><Link to="/protections" style={linkStyle}>Ulinzi wa Malipo</Link></li>
          <li style={liStyle}><Link to="/logistics" style={linkStyle}>Fuatilia Stendi (Logistics)</Link></li>
          <li style={liStyle}><Link to="/quotes" style={linkStyle}>Maombi ya Invoice</Link></li>
          <li style={liStyle}><Link to="/verification" style={linkStyle}>Uhakiki wa Bidhaa</Link></li>
        </ul>
      </div>

      {/* SEHEMU YA 3: KITUO CHA MSAADA */}
      <div>
        <h4 style={headerStyle}>Msaada & Huduma</h4>
        <ul style={ulStyle}>
          <li style={liStyle}><Link to="/help-center" style={linkStyle}>Kwa Wanunuzi</Link></li>
          <li style={liStyle}><Link to="/dispute" style={linkStyle}>Fungua Shauri (Dispute)</Link></li>
          <li style={liStyle}><Link to="/report" style={linkStyle}>Ripoti Tatizo</Link></li>
          <li style={liStyle}><a href="https://wa.me/255..." style={linkStyle}>Chat nasi WhatsApp</a></li>
        </ul>
      </div>

      {/* SEHEMU YA 4: PARTNER / PROMO SECTION */}
      <div style={{ borderLeft: '1px solid #eee', paddingLeft: '30px' }}>
        <h4 style={headerStyle}>Washirika Wetu</h4>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '15px', 
          padding: '15px', 
          border: '1px solid #eee', 
          borderRadius: '8px',
          backgroundColor: '#f9f9f9'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff6a00' }}>SF</div>
          <div>
            <div style={{ fontWeight: '600', fontSize: '14px' }}>Unganisha Duka Lako</div>
            <p style={{ fontSize: '12px', color: '#666', margin: '4px 0' }}>Sajili duka lako uanze kuuza jumla nchi nzima.</p>
            <Link to="/create-store" style={{ color: '#ff6a00', fontSize: '12px', fontWeight: 'bold', textDecoration: 'none' }}>Anza Sasa →</Link>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )}
  
  {/* HELP CENTER */}
  <span 
  ref={helpRef}
    className="nav-item" 
    onMouseEnter={(e) => handleMouseEnter('helpCenter', e)}
    onMouseLeave={handleMouseLeave}
    style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '5px', 
      whiteSpace: 'nowrap', 
      cursor: 'pointer',
      position: 'relative',
      paddingBottom: '8px'
    }}
  >
    <LucideIcons.Headset size={18} /> 
    <span>{t('help_center')}</span>
    <LucideIcons.ChevronDown size={14} />

    {/* Active Indicator - Bottom Line */}
    {activeMenu === 'helpCenter' && (
      <div style={{
        position: 'absolute',
        bottom: '-8px',
        left: '0',
        right: '0',
        height: '3px',
        backgroundColor: '#ff6a00',
        borderRadius: '2px',
        transition: 'all 0.2s ease'
      }} />
    )}
  </span>

  {activeMenu === 'helpCenter' && createPortal(
    <div 
      onMouseEnter={() => handleMouseEnter('helpCenter')} 
      onMouseLeave={handleMouseLeave}
      style={{ 
        position: 'fixed', 
        top: `${helpMenuPos.top + 5}px`, 
        left: '20px',
        right: '20px', 
        width: 'auto', 
        backgroundColor: 'white', 
        boxShadow: '0 15px 35px rgba(0,0,0,0.2)', 
        borderRadius: '4px', 
        padding: '30px',
        zIndex: 10000,
        border: '1px solid #ddd',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr 1.2fr',
        gap: '40px'
      }}
    >
      {/* SEHEMU YA 1: MSAADA KWA WANUNUZI */}
      <div>
        <h4 style={headerStyle}>Msaada kwa Wanunuzi</h4>
        <ul style={ulStyle}>
          <li style={liStyle}><Link to="/help-center" style={linkStyle}>Kituo cha Msaada (FAQ)</Link></li>
          <li style={liStyle}><Link to="/how-to-buy" style={linkStyle}>Jinsi ya kununua</Link></li>
          <li style={liStyle}><Link to="/shipping-info" style={linkStyle}>Maelezo ya Usafirishaji</Link></li>
          <li style={liStyle}><Link to="/refund-policy" style={linkStyle}>Sera ya kurudisha pesa</Link></li>
        </ul>
      </div>

      {/* SEHEMU YA 2: USALAMA & SERA */}
      <div>
        <h4 style={headerStyle}>Usalama & Sheria</h4>
        <ul style={ulStyle}>
          <li style={liStyle}><Link to="/dispute" style={linkStyle}>Fungua Shauri (Dispute)</Link></li>
          <li style={liStyle}><Link to="/report-abuse" style={linkStyle}>Ripoti utapeli/ubadhifu</Link></li>
          <li style={liStyle}><Link to="/terms" style={linkStyle}>Vigezo na Masharti</Link></li>
          <li style={liStyle}><Link to="/privacy" style={linkStyle}>Sera ya Faragha</Link></li>
        </ul>
      </div>

      {/* SEHEMU YA 3: WASILIANA NASI */}
      <div>
        <h4 style={headerStyle}>Wasiliana Nasi</h4>
        <ul style={ulStyle}>
          <li style={liStyle}><a href="https://wa.me/255..." style={linkStyle}>Chat na Msaidizi (WhatsApp)</a></li>
          <li style={liStyle}><Link to="/contact-us" style={linkStyle}>Tutumie Barua Pepe</Link></li>
          <li style={liStyle}><Link to="/office-location" style={linkStyle}>Ofisi zetu zilipo</Link></li>
        </ul>
      </div>

      {/* SEHEMU YA 4: MWONGOZO WA VIDEO (PROMO SECTION) */}
      <div style={{ borderLeft: '1px solid #eee', paddingLeft: '30px' }}>
        <h4 style={headerStyle}>Jifunze zaidi</h4>
        <div style={{ 
          padding: '15px', 
          border: '1px solid #eef2ff', 
          borderRadius: '8px',
          backgroundColor: '#f8faff'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <LucideIcons.PlayCircle size={24} color="#0071dc" />
            <span style={{ fontWeight: '600', fontSize: '14px' }}>Video Tutorials</span>
          </div>
          <p style={{ fontSize: '12px', color: '#666', lineHeight: '1.5' }}>
            Tazama video fupi za jinsi ya kutumia Skyfall kupata bidhaa bora kwa bei ya jumla.
          </p>
          <Link to="/tutorials" style={{ color: '#0071dc', fontSize: '12px', fontWeight: 'bold', textDecoration: 'none', display: 'block', marginTop: '10px' }}>
            Tazama Video →
          </Link>
        </div>
      </div>
    </div>,
    document.body
  )}

{/* SELL ON SKYFALL - LOGIN/SELL BUTTON */}
<div 
  onClick={handleSellNavigation}
  className="nav-sell-link" 
  onMouseEnter={() => setActiveNav('sell')}
  onMouseLeave={() => setActiveNav(null)}
  style={{ 
    display: 'flex', 
    alignItems: 'center', 
    gap: '8px', 
    whiteSpace: 'nowrap', 
    flexShrink: 0,
    padding: '8px 12px',
    border: '1px solid #eee',
    borderRadius: '4px',
    textDecoration: 'none',
    color: 'inherit',
    backgroundColor: user ? 'transparent' : '#fff7f2',
    position: 'relative',
    cursor: 'pointer'
  }}
>
  <LucideIcons.Store size={18} color={user ? "currentColor" : "#ff6a00"} />
  
  {/* Loading state wakati tunacheck store */}
  {user && checkingStore ? (
    <LucideIcons.Loader2 size={14} className="animate-spin" style={{ marginLeft: '4px' }} />
  ) : (
    <span style={{ fontWeight: '500' }}>
  {!user && t('login_to_sell')}
  {user && !hasStore && t('create_your_store')}
  {user && hasStore && t('my_store_dashboard')}
</span>
  )}
  
  {/* Active Indicator - Bottom Line (kwa hover tu) */}
  {activeNav === 'sell' && (
    <div style={{
      position: 'absolute',
      bottom: '-8px',
      left: '0',
      right: '0',
      height: '3px',
      backgroundColor: '#ff6a00',
      borderRadius: '2px',
      transition: 'all 0.2s ease'
    }} />
  )}
</div>

</div>
    </nav>
  );
}