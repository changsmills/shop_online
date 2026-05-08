import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import { CartProvider } from "./context/CartContext"; 
import BottomNav from "./components/BottomNav";
import { Toaster, toast } from 'react-hot-toast';

// Import Pages
import Home from "./pages/Home"; 
import Login from "./pages/Login"; 
import Register from "./pages/Register";
import CreateStore from "./pages/CreateStore";
import Dashboard from "./pages/Dashboard";
import ProductManagement from "./pages/ProductManagement";
import Analytics from "./pages/Analytics";
import VirtualDashboard from "./pages/VirtualDashboard";
import PhysicalDashboard from "./pages/PhysicalDashboard";
import ProductDetails from "./pages/ProductDetails"; 
import CartPage from "./pages/CartPage"; 
import CheckoutPage from "./pages/CheckoutPage"; 
import MyOrders from "./pages/MyOrders";
import AccountSettings from "./pages/AccountSettings";
import AdvertisePage from "./pages/AdvertisePage";
import UpdateProductPage from "./pages/UpdateProductPage";
import Messages from "./pages/Messages";
import NotificationsPage from "./pages/NotificationsPage";
import SkyfallBusiness from "./pages/SkyfallBusinessPage";
import CategoryProducts from "./pages/CategoryProducts";
import ProductsAll from "./pages/ProductsAll";
import HowToBuy from './pages/HowToBuy';
import SearchResults from "./pages/SearchResults";
import PricingPage from "./pages/PricingPage";
import Dispute from './pages/Dispute';
import ReportAbuse from './pages/ReportAbuse';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import ContactSupport from './pages/ContactSupport';
import HelpCenter from './pages/HelpCenter';
import ShippingInfo from './pages/ShippingInfo';
import RefundPolicy from './pages/RefundPolicy';
import ContactUs from './pages/ContactUs';
import Tutorials from './pages/Tutorials';
import WholesaleBenefits from './pages/WholesaleBenefits';
import Blogs from './pages/Blogs';
import PaymentProtection from './pages/PaymentProtection';
import Logistics from './pages/Logistics';
import Quotes from './pages/Quotes';
import Verification from './pages/Verification';
import AdRequest from './pages/AdRequest';
import StorePage from "./pages/StorePage";
import AllStores from './pages/AllStores';



// ========== COMPONENT MPYA YA KUDHIBITI BOTTOM NAV ==========
function AppContent({ session }) {
  const location = useLocation();
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  
  // ORODHA YA KURASA ZINAZOONESHA BOTTOM NAV (DASHBOARD PEKEE)
  const showBottomNavPaths = [
    "/dashboard",
    "/dashboard/analytics",
    "/dashboard/virtual",
    "/dashboard/physical/",
    "/dashboard/products",
    "/dashboard/messages",
    "/dashboard/notifications",
    "/dashboard/settings",
    "/dashboard/orders",
    "/categories",
    "/messages",
    "/profile"
  ];

  // --- ANZA MABADILIKO HAPA ---
  useEffect(() => {
    // 1. Angalia kama kuna session ya mtumiaji
    // 2. Angalia kama tayari tumeshaonyesha ujumbe huu kwenye session hii ya browser
    const hasShownWelcome = sessionStorage.getItem('welcomeShown');

    if (session && !hasShownWelcome) {
      // Tunatumia toast ya react-hot-toast ambayo tayari unayo
      toast.success(`Karibu tena, ${session.user.email?.split('@')[0]}!`, {
        duration: 4000,       // Itakaa kwa sekunde 4
        id: 'welcome-toast',   // ID hii inazuia popup zisijirundike (duplicate prevention)
      });
      
      // Weka alama kuwa ujumbe umeshaonyeshwa
      sessionStorage.setItem('welcomeShown', 'true');
    }
  }, [session]); // Ita-trigger pale tu session inapobadilika (mtu akiingia)
  // --- ISHIA HAPA ---
  
  // Angalia kama current path inafaa kuonesha BottomNav
  const shouldShowBottomNav = () => {
    const currentPath = location.pathname;
    
    // Ficha bottom nav kwenye product pages
    if (currentPath.startsWith("/product/")) return false;
    if (currentPath === "/products") return false;
    if (currentPath.startsWith("/products")) return false;
    if (currentPath === "/cart") return false;
    if (currentPath === "/checkout") return false;
    if (currentPath.startsWith("/category/")) return false;
    if (currentPath === "/search") return false;
    if (currentPath === "/how-to-buy") return false;
    if (currentPath === "/about-skyfall") return false;
    if (currentPath === "/advertise") return false;
    if (currentPath === "/payments") return false;
    
    // Angalia kama path iko kwenye list ya kurasa zinazoonesha BottomNav
    return showBottomNavPaths.some(path => {
      if (path.endsWith("/")) {
        return currentPath.startsWith(path);
      }
      return currentPath === path;
    });
  };

  return (
    <div className="app-main-layout">
      <Routes>
        {/* ROUTES ZA KAWAIDA */}
        <Route path="/dashboard" element={<Dashboard session={session} />} />
        <Route path="/home" element={<Home session={session} />} />
        <Route path="/product/:id" element={<ProductDetails session={session} />} />
        
        {/* ROUTES ZA MANUNUZI */}
        <Route path="/cart" element={<CartPage session={session} />} />
        <Route path="/checkout" element={session ? <CheckoutPage session={session} /> : <Navigate to="/dashboard/login" />} />
        <Route path="/products" element={<ProductsAll session={session} />} />
        <Route path="/how-to-buy" element={<HowToBuy />} />
        <Route path="/about-skyfall" element={<SkyfallBusiness session={session} />} />
        <Route path="/search" element={<SearchResults session={session} />} />
        
        <Route path="/dashboard/orders" element={session ? <MyOrders session={session} /> : <Navigate to="/dashboard/login" />} />
        <Route path="/update/:productId" element={session ? <UpdateProductPage /> : <Navigate to="/dashboard/login" />} />

        <Route path="/dispute" element={<Dispute />} />
        <Route path="/report-abuse" element={<ReportAbuse />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/contact-support" element={<ContactSupport />} />
        <Route path="/help-center" element={<HelpCenter />} />
        <Route path="/shipping-info" element={<ShippingInfo />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/tutorials" element={<Tutorials />} />
        <Route path="/wholesale-benefits" element={<WholesaleBenefits />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/payment-protection" element={<PaymentProtection />} />
        <Route path="/logistics" element={<Logistics />} />
        <Route path="/quotes" element={<Quotes />} />
        <Route path="/verification" element={<Verification />} />
        <Route path="/ad-request" element={<AdRequest />} />
        <Route path="/store/:storeId" element={<StorePage session={session} />} />

        
        <Route path="/advertise" element={session ? <AdvertisePage session={session} /> : <Navigate to="/dashboard/login" />} />
        <Route path="/dashboard/settings" element={session ? <AccountSettings session={session} /> : <Navigate to="/dashboard/login" />} />
        <Route path="/dashboard/messages" element={session ? <Messages session={session} /> : <Navigate to="/dashboard/login" />} />
        <Route path="/dashboard/notifications" element={<NotificationsPage session={session} />} />

        {/* AUTHENTICATION */}
        <Route path="/dashboard/login" element={<Login />} />
        <Route path="/dashboard/register" element={<Register />} />

        <Route path="/stores/:storeId" element={<AllStores session={session} />} />


        {/* DASHBOARD SUB-PAGES */}
        <Route path="/dashboard/analytics" element={<Analytics session={session} />} />
        <Route path="/dashboard/virtual" element={<VirtualDashboard session={session} />} />
        <Route path="/dashboard/physical/:id" element={<PhysicalDashboard session={session} />} />
        <Route path="/dashboard/products" element={<ProductManagement session={session} />} />
        <Route path="/create-store" element={<CreateStore session={session} />} />

        {/* Default Redirects */}
        <Route path="/" element={<Navigate replace to="/dashboard" />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />

        <Route path="/payments" element={<PricingPage />} />
        <Route path="/category/:leafId" element={<CategoryProducts session={session} />} />
      </Routes>

      {/* BOTTOM NAV - INAONEKANA KWA MASHARTI TU */}
      {shouldShowBottomNav() && <BottomNav />}
    </div>
  );
}

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session: activeSession } } = await supabase.auth.getSession();
      setSession(activeSession);
      setLoading(false);
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      <p className="text-gray-500 font-medium">Inatambua akaunti yako...</p>
    </div>
  );

  return (
    <CartProvider>
      <Toaster 
        position="top-right" 
        reverseOrder={false} 
        toastOptions={{
          style: {
            zIndex: 9999,
          },
        }}
      />
      <BrowserRouter>
        <AppContent session={session} />
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;