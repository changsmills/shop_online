// src/pages/CartPage.jsx
import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  Trash2, ShoppingBag, Store, Minus, Plus, 
  ChevronLeft, Bell, Search, ShieldCheck,
  LayoutDashboard, MessageSquare, ClipboardList, BarChart3, Settings, Menu
} from 'lucide-react';
import UserTools from '../components/UserTools';
import api from "../axiosConfig";

export default function CartPage({ session }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const totalAmount = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const getProductImage = (item) => {
    if (item.cover_image_url) return item.cover_image_url;
    if (item.image) {
      if (item.image.startsWith('http')) return item.image;
      const BASE_URL = api.defaults.baseURL.replace(/\/api$/, '');
      const imagePath = item.image.startsWith('/') ? item.image : '/' + item.image;
      return `${BASE_URL}${imagePath}`;
    }
    if (item.cover_image) {
      if (item.cover_image.startsWith('http')) return item.cover_image;
      const BASE_URL = api.defaults.baseURL.replace(/\/api$/, '');
      const imagePath = item.cover_image.startsWith('/') ? item.cover_image : '/' + item.cover_image;
      return `${BASE_URL}${imagePath}`;
    }
    return '/placeholder-image.jpg';
  };

  const sidebarItems = [
    { icon: <LayoutDashboard size={20} />, path: '/dashboard', label: 'Dashboard' },
    { icon: <MessageSquare size={20} />, path: '/dashboard/messages', label: 'Messages' },
    { icon: <ClipboardList size={20} />, path: '/dashboard/orders', label: 'Orders' },
    { icon: <BarChart3 size={20} />, path: '/dashboard/analytics', label: 'Analytics' },
    { icon: <Settings size={20} />, path: '/dashboard/settings', label: 'Settings' },
  ];

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Kikapu chako kiko tupu!");
      return;
    }

    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate('/dashboard/login', { state: { from: '/checkout' } });
      return;
    }

    navigate('/checkout');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-[#0f172a]
     text-gray-900 dark:text-gray-100 font-sans">
      
      {/* HEADER */}
      <header className="flex justify-between items-center px-4 py-3 md:px-6 border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-[#1e293b] z-[100]">
        <div className="flex items-center gap-4">
          <Menu 
            size={22} 
            className="hidden md:block cursor-pointer text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors" 
            onClick={() => setIsExpanded(!isExpanded)} 
          />
          <Link to="/dashboard" className="text-xl font-extrabold text-[#ff6a00] hover:opacity-80 transition-opacity">
            Skyfall
          </Link>
          
          <div className="hidden md:flex items-center bg-gray-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg ml-4">
            <Search size={16} className="text-gray-400" />
            <input 
              type="text" 
              placeholder="Search in cart..." 
              className="bg-transparent border-none outline-none ml-2 text-sm text-gray-700 dark:text-gray-200 w-48"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Bell size={20} className="hidden md:block cursor-pointer text-gray-500 hover:text-gray-800 dark:hover:text-gray-200" />
          <UserTools session={session} />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        
        {/* SIDEBAR (Desktop Only) */}
        <aside 
          className={`hidden md:flex flex-col pt-5 border-r border-gray-200 dark:border-slate-700 bg-white dark:bg-[#1e293b] transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap z-10 ${
            isExpanded ? 'w-[240px]' : 'w-[75px]'
          }`}
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => setIsExpanded(false)}
        >
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`flex items-center px-6 py-3 mx-2 my-1 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-orange-50 dark:bg-orange-950/30 text-[#ff6a00]' 
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="min-w-[24px] flex justify-center">
                  {item.icon}
                </div>
                <span className={`ml-4 text-sm font-semibold transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0 hidden'}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-4 md:p-6 bg-gray-50 dark:bg-[#0f172a] overflow-y-auto pb-32 md:pb-6">
          <div className="max-w-[1100px] mx-auto">
            
            <div className="flex items-center gap-2 mb-5 cursor-pointer text-gray-500 dark:text-gray-400 hover:text-[#ff6a00] transition-colors" onClick={() => navigate(-1)}>
              <ChevronLeft size={20} />
              <span className="font-semibold text-sm">Back to shopping</span>
            </div>

            <h2 className="text-xl md:text-2xl font-extrabold mb-6 text-gray-900 dark:text-white">
              Shopping Cart ({totalItems})
            </h2>

            {loading ? (
              <div className="flex flex-col gap-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="animate-pulse bg-white dark:bg-[#1e293b] h-28 rounded-xl border border-gray-200 dark:border-slate-700"></div>
                ))}
              </div>
            ) : cartItems.length === 0 ? (
              <div className="text-center py-16 px-4 bg-white dark:bg-[#1e293b] rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm">
                <ShoppingBag size={64} className="text-gray-300 dark:text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-6">Kikapu chako kiko tupu!</h3>
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="px-6 py-3 bg-[#ff6a00] text-white font-bold rounded-full hover:bg-orange-600 transition-colors"
                >
                  Anza Manunuzi
                </button>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row gap-6 items-start">
                  
                {/* LIST YA BIDHAA */}
                <div className="flex-1 flex flex-col bg-white dark:bg-[#1e293b] rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden shadow-sm">
                  <div className="px-5 py-3 border-b border-gray-100 dark:border-slate-700 flex items-center gap-2 font-bold text-sm text-gray-800 dark:text-gray-200">
                    <Store size={18} className="text-[#ff6a00]" />
                    <span>Skyfall Verified Items</span>
                  </div>

                  {cartItems.map((item) => (
                    <div key={item.uniqueCartId} className="flex flex-col md:flex-row gap-3 md:gap-5 p-4 md:p-5 border-b border-gray-100 dark:border-slate-700 last:border-0">
                      <img 
                        src={getProductImage(item)} 
                        alt={item.name} 
                        className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg bg-gray-50 dark:bg-slate-800"
                        onError={(e) => { e.target.src = '/placeholder-image.jpg'; }}
                      />
                      
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <h4 className="text-sm md:text-base font-bold text-gray-900 dark:text-white flex-1 pr-2">
                            {item.name}
                          </h4>
                          <button onClick={() => removeFromCart(item.uniqueCartId)} className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                            <Trash2 size={18} />
                          </button>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="text-[10px] bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">
                            🎨 {item.selected_color || 'Default'}
                          </span>
                          <span className="text-[10px] bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">
                            📏 {item.selected_size || 'Free Size'}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center mt-3">
                          <span className="text-base md:text-lg font-extrabold text-[#ff6a00]">
                            TSH {Number(item.price).toLocaleString()}
                          </span>
                          
                          <div className="flex items-center border border-gray-300 dark:border-slate-600 rounded-lg overflow-hidden">
                            <button 
                              onClick={() => updateQuantity(item.uniqueCartId, Math.max(1, item.quantity - 1))} 
                              disabled={item.quantity <= 1}
                              className="p-1.5 md:p-2 bg-white dark:bg-slate-800 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors border-r border-gray-300 dark:border-slate-600"
                            >
                              <Minus size={14}/>
                            </button>
                            <span className="px-3 font-bold text-sm min-w-[30px] text-center">
                              {item.quantity}
                            </span>
                            <button 
                              onClick={() => updateQuantity(item.uniqueCartId, item.quantity + 1)} 
                              disabled={!item.stock_quantity || item.quantity >= item.stock_quantity}
                              className="p-1.5 md:p-2 bg-white dark:bg-slate-800 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors border-l border-gray-300 dark:border-slate-600"
                            >
                              <Plus size={14}/>
                            </button>
                          </div>
                        </div>

                        <div className="mt-2 text-[11px] md:text-xs">
                          {item.stock_quantity > 0 ? (
                            <span className="text-emerald-500 font-medium">✓ Stock Available: {item.stock_quantity}</span>
                          ) : (
                            <span className="text-red-500 font-medium">✗ Out of Stock</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* SUMMARY CARD (Desktop) */}
                <div className="hidden md:block w-[340px] bg-white dark:bg-[#1e293b] p-6 rounded-xl border border-gray-200 dark:border-slate-700 sticky top-6 shadow-sm">
                  <h3 className="text-lg font-extrabold mb-5 text-gray-900 dark:text-white">Order Summary</h3>
                  
                  <div className="flex justify-between mb-3 text-sm text-gray-600 dark:text-gray-400">
                    <span>Subtotal ({totalItems} items):</span>
                    <span className="font-semibold text-gray-900 dark:text-white">TSH {totalAmount.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between mb-4 text-sm text-gray-600 dark:text-gray-400">
                    <span>Shipping:</span>
                    <span className="text-emerald-500 font-semibold">Calculated later</span>
                  </div>
                  
                  <hr className="border-gray-200 dark:border-slate-700 my-4" />
                  
                  <div className="flex justify-between mb-6">
                    <span className="font-bold text-gray-900 dark:text-white">Total:</span>
                    <span className="font-extrabold text-xl text-[#ff6a00]">TSH {totalAmount.toLocaleString()}</span>
                  </div>
                  
                  <button 
                    onClick={handleCheckout}
                    className="w-full py-3.5 bg-[#ff6a00] text-white font-extrabold rounded-full hover:bg-orange-600 shadow-lg shadow-orange-500/30 transition-all active:scale-95"
                  >
                    Checkout ({totalItems})
                  </button>
                  
                  <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-500 dark:text-gray-400">
                    <ShieldCheck size={16} className="text-emerald-500" />
                    <span>Secure payment protected</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* MOBILE BOTTOM CHECKOUT BAR */}
      {!loading && cartItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white dark:bg-[#1e293b] px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] border-t border-gray-200 dark:border-slate-700 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-[1000] flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">Total</span>
            <span className="text-lg font-extrabold text-[#ff6a00]">TSH {totalAmount.toLocaleString()}</span>
            <span className="text-[10px] text-gray-400">{totalItems} item(s)</span>
          </div>
          <button 
            onClick={handleCheckout}
            className="bg-[#ff6a00] text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-md active:scale-95 transition-transform"
          >
            Checkout →
          </button>
        </div>
      )}
    </div>
  );
}