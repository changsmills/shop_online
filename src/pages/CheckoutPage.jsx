// src/pages/CheckoutPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, MessageSquare, ClipboardList, BarChart3, Settings,
  Bell, Search, MapPin, ChevronLeft, Lock
} from 'lucide-react';
import UserTools from '../components/UserTools';
import api from '../axiosConfig';
import { toast, Toaster } from 'react-hot-toast'; 
//import '../CheckoutPage.css';
import { useCart } from '../context/CartContext';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, clearCart } = useCart();
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isWhatsAppOrder, setIsWhatsAppOrder] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  const [shippingMethods, setShippingMethods] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState(null);

  const [customerInfo, setCustomerInfo] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: 'Dar es Salaam'
  });

  const orderItems = cartItems.length > 0 ? cartItems : (location.state?.orderItems || []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/profile/');
        setCurrentUserId(res.data.id);
      } catch (error) {
        console.error("Error fetching profile for checkout:", error);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchShipping = async () => {
      const storeId = orderItems[0]?.store_id;
      if (!storeId || orderItems.length === 0) return;

      try {
        const res = await api.get('/shipping-methods/', {
          params: { store_id: storeId }
        });
        const data = res.data.results || res.data || [];
        setShippingMethods(data);
        if (data.length > 0) setSelectedShipping(data[0]);
      } catch (error) {
        console.error("Error fetching shipping methods:", error);
        setShippingMethods([]);
      }
    };
    fetchShipping();
  }, [orderItems]);

  const getPrice = (method) => {
    if (!method) return 0;
    const isLocal = customerInfo.city === 'Dar es Salaam';
    return isLocal ? (method.price_local || 0) : (method.price_national || 0);
  };

  const subtotal = orderItems.reduce((sum, item) => {
    const price = Number(item.price) || 0;
    return sum + (price * item.quantity);
  }, 0);

  const currentShippingPrice = selectedShipping ? Number(getPrice(selectedShipping)) : 0;
  const totalAmount = subtotal + currentShippingPrice;

  const handlePlaceOrder = async () => {
    if (orderItems.length === 0) {
      toast.error("Huna bidhaa yoyote ya kuagiza");
      return;
    }
    if (!customerInfo.fullName || !customerInfo.phone || !customerInfo.address) {
      toast.error("Tafadhali jaza taarifa zote za usafirishaji");
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading("Tunatuma oda yako...");
    let orderNumber = null;

    try {
      orderNumber = `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      const orderPayload = {
        order_number: orderNumber,
        customer_id: currentUserId,
        store_id: orderItems[0]?.store_id,
        grand_total: totalAmount,
        shipping_fee: currentShippingPrice,
        shipping_method: selectedShipping?.method_name || selectedShipping?.label,
        customer_location: `${customerInfo.fullName} | ${customerInfo.address} | Simu: ${customerInfo.phone}`,
        status: 'received',
        payment_method: 'mobile_money',
        total_items: orderItems.length,
      };

      const orderRes = await api.post('/orders/', orderPayload);
      const mainOrder = orderRes.data;

      const itemsToInsert = orderItems.map(item => ({
        order: mainOrder.id,
        product: item.productId || item.id,
        variant: item.variant_id,
        product_name: item.product_name || item.name,
        product_image: item.image,
        selected_color: item.selected_color,
        selected_size: item.selected_size,
        quantity: item.quantity,
        unit_price: item.price,
        subtotal: item.price * item.quantity
      }));

      for (const item of itemsToInsert) {
        await api.post('/order-items/', item);
      }

      toast.dismiss(loadingToast);
      clearCart();
      toast.success("Hongera! Oda yako imepokelewa vyema!");

      let whatsappMessage = `*ORDER CONFIRMATION - SKYFALL.COM*%0A%0A`;
      whatsappMessage += `*ORDER NUMBER:* ${orderNumber}%0A`;
      whatsappMessage += `*DATE:* ${new Date().toLocaleString()}%0A%0A`;
      whatsappMessage += `*CUSTOMER DETAILS*%0A`;
      whatsappMessage += `👤 Jina: ${customerInfo.fullName}%0A`;
      whatsappMessage += `📞 Simu: ${customerInfo.phone}%0A`;
      whatsappMessage += `📍 Anuani: ${customerInfo.address}%0A`;
      whatsappMessage += `🚚 Usafirishaji: ${selectedShipping?.method_name || selectedShipping?.label} - TZS ${currentShippingPrice.toLocaleString()}%0A%0A`;
      whatsappMessage += `*ORDER DETAILS*%0A`;
      whatsappMessage += `────────────────%0A`;
      orderItems.forEach((item, idx) => {
        whatsappMessage += `\n${idx + 1}. *${item.product_name || item.name}*%0A`;
        whatsappMessage += `   🟢 Rangi: ${item.selected_color || 'Standard'}%0A`;
        whatsappMessage += `   📏 Ukubwa: ${item.selected_size || 'Free Size'}%0A`;
        whatsappMessage += `   🔢 Kiasi: ${item.quantity}%0A`;
        whatsappMessage += `   💰 Bei: TZS ${(item.price * item.quantity).toLocaleString()}%0A`;
      });
      whatsappMessage += `\n────────────────%0A`;
      whatsappMessage += `💰 *Subtotal:* TZS ${subtotal.toLocaleString()}%0A`;
      whatsappMessage += `🚚 *Shipping:* TZS ${currentShippingPrice.toLocaleString()}%0A`;
      whatsappMessage += `💵 *TOTAL:* TZS ${totalAmount.toLocaleString()}%0A%0A`;
      whatsappMessage += `Asante kwa order yako! Tutawasiliana nawe kwa maelekezo zaidi.`;

      const customerPhone = customerInfo.phone.replace(/^0+/, '255').replace(/[\s+]/g, '');
      window.open(`https://wa.me/${customerPhone}?text=${whatsappMessage}`, '_blank');

      const storePhone = orderItems[0]?.store_phone;
      if (storePhone && storePhone !== "255XXXXXXXXX") {
        const cleanStorePhone = storePhone.replace(/[\s+]/g, '');
        window.open(`https://wa.me/${cleanStorePhone}?text=*NEW ORDER RECEIVED!*%0A%0A${whatsappMessage}`, '_blank');
      }

      toast.success("Taarifa ya order imetumwa kwa WhatsApp yako!");
      setTimeout(() => navigate('/dashboard/orders'), 3000);

    } catch (error) {
      toast.dismiss(loadingToast);
      console.error("Order Error:", error.response?.data || error.message);
      toast.error("Imeshindwa kuweka oda: " + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  const sidebarItems = [
    { icon: <LayoutDashboard size={20} />, path: '/dashboard', label: 'Dashboard' },
    { icon: <MessageSquare size={20} />, path: '/dashboard/messages', label: 'Messages' },
    { icon: <ClipboardList size={20} />, path: '/dashboard/orders', label: 'Orders' },
    { icon: <BarChart3 size={20} />, path: '/dashboard/analytics', label: 'Analytics' },
    { icon: <Settings size={20} />, path: '/dashboard/settings', label: 'Settings' },
  ];

 return (
    <div className="flex flex-col h-screen bg-white dark:bg-[#1e293b] text-gray-800 dark:text-slate-200">
      <Toaster position="top-center" />

      {/* ===== HEADER ===== */}
      <header className="flex justify-between items-center px-3 sm:px-4 md:px-6 py-2.5 border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-[#1e293b] z-20">
        <div className="flex items-center gap-3 md:gap-5">
          <Link
            to="/dashboard"
            className="text-base sm:text-lg md:text-xl font-extrabold text-[#ff6a00] no-underline"
          >
            Skyfall.com
          </Link>
          <div className="hidden md:flex items-center bg-gray-100 dark:bg-slate-700 px-3 py-1.5 rounded-lg">
            <Search size={16} className="text-gray-400 dark:text-slate-400" />
            <input
              type="text"
              placeholder="Search order details..."
              className="border-none bg-transparent outline-none ml-2 text-sm text-gray-800 dark:text-slate-200 placeholder:text-gray-400 dark:placeholder:text-slate-500"
            />
          </div>
        </div>
        <div className="flex items-center gap-2.5 md:gap-4">
          <Bell size={20} className="hidden md:block cursor-pointer text-gray-500 dark:text-slate-400" />
          <UserTools />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">

        {/* ===== SIDEBAR (Desktop only) ===== */}
        <aside
          className={`hidden md:flex flex-col px-3 py-5 gap-2 bg-white dark:bg-[#1e293b] border-r border-gray-200 dark:border-slate-700 overflow-hidden z-[100] transition-[width] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
            isSidebarHovered ? 'w-60' : 'w-[75px]'
          }`}
          onMouseEnter={() => setIsSidebarHovered(true)}
          onMouseLeave={() => setIsSidebarHovered(false)}
        >
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 min-w-[210px] px-4 py-3 rounded-xl no-underline text-[15px] font-medium transition-all ${
                  isActive
                    ? 'text-[#ff6a00] font-bold bg-orange-50 dark:bg-[#2d2d44]'
                    : 'text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700/50'
                }`}
              >
                <div className="min-w-[24px] flex justify-center">
                  {item.icon}
                </div>
                <span
                  className={`whitespace-nowrap transition-opacity duration-200 ${
                    isSidebarHovered ? 'opacity-100 visible' : 'opacity-0 invisible md:invisible'
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </aside>

        {/* ===== MAIN CONTENT ===== */}
        <main className="flex-1 p-4 md:p-8 bg-white dark:bg-[#1e293b] overflow-y-auto">
          <div className="max-w-[1100px] mx-auto">

            <div
              className="flex items-center gap-2 mb-5 cursor-pointer text-gray-500 dark:text-slate-400 hover:text-[#ff6a00] transition-colors"
              onClick={() => navigate(-1)}
            >
              <ChevronLeft size={20} />
              <span className="font-semibold text-sm">Back to shop</span>
            </div>

            <h1 className="text-xl sm:text-2xl md:text-[28px] font-black mb-6 text-gray-800 dark:text-slate-200">
              Checkout
            </h1>

            <div className="flex flex-col md:flex-row gap-5 md:gap-6 items-start">

              {/* ===== SHIPPING ADDRESS SECTION ===== */}
              <div className="flex-1 w-full md:flex-[1.5] bg-white dark:bg-[#1e293b] p-4 md:p-6 rounded-2xl border border-gray-200 dark:border-slate-700">
                <div className="flex items-center gap-2.5 mb-5">
                  <MapPin size={22} className="text-[#ff6a00]" />
                  <h3 className="m-0 font-extrabold text-base md:text-lg text-gray-800 dark:text-slate-200">
                    Shipping address
                  </h3>
                </div>

                <form onSubmit={(e) => e.preventDefault()} className="flex flex-col">

                  <div className="mt-0">
                    <label className="text-[13px] font-semibold text-gray-600 dark:text-slate-300 block mb-1.5">
                      Full name *
                    </label>
                    <input
                      type="text"
                      placeholder="Joshua Julius"
                      value={customerInfo.fullName}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, fullName: e.target.value })}
                      className="w-full px-3 py-3 border border-gray-300 dark:border-slate-600 rounded-lg text-sm text-gray-800 dark:text-slate-200 bg-white dark:bg-[#1e293b] placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div className="mt-4">
                    <label className="text-[13px] font-semibold text-gray-600 dark:text-slate-300 block mb-1.5">
                      Phone number *
                    </label>
                    <input
                      type="text"
                      placeholder="07XXXXXXXX"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                      className="w-full px-3 py-3 border border-gray-300 dark:border-slate-600 rounded-lg text-sm text-gray-800 dark:text-slate-200 bg-white dark:bg-[#1e293b] placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div className="mt-4">
                    <label className="text-[13px] font-semibold text-gray-600 dark:text-slate-300 block mb-1.5">
                      Street address *
                    </label>
                    <input
                      type="text"
                      placeholder="Makongo Juu, House No. 12"
                      value={customerInfo.address}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                      className="w-full px-3 py-3 border border-gray-300 dark:border-slate-600 rounded-lg text-sm text-gray-800 dark:text-slate-200 bg-white dark:bg-[#1e293b] placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div className="mt-4">
                    <label className="text-[13px] font-semibold text-gray-600 dark:text-slate-300 block mb-1.5">
                      City / Region *
                    </label>
                    <select
                      value={customerInfo.city}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, city: e.target.value })}
                      className="w-full px-3 py-3 border border-gray-300 dark:border-slate-600 rounded-lg text-sm text-gray-800 dark:text-slate-200 bg-white dark:bg-[#1e293b] focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="Dar es Salaam">Dar es Salaam (Local)</option>
                      <option value="Arusha">Arusha (National)</option>
                      <option value="Mwanza">Mwanza (National)</option>
                      <option value="Zanzibar">Zanzibar (National)</option>
                      <option value="Other">Other Region</option>
                    </select>
                  </div>

                  {/* Shipping Methods */}
                  <div className="mt-6">
                    <label className="font-bold block mb-3 text-gray-600 dark:text-slate-200 text-sm">
                      Select Shipping Method *
                    </label>
                    <div className="flex flex-col gap-2.5">
                      {shippingMethods.map((method) => {
                        const calculatedPrice = getPrice(method);
                        const isSelected = selectedShipping?.id === method.id;
                        return (
                          <div
                            key={method.id}
                            onClick={() => setSelectedShipping(method)}
                            className={`flex justify-between items-center px-3 md:px-4 py-2.5 md:py-3 rounded-xl cursor-pointer transition-all ${
                              isSelected
                                ? 'border-2 border-[#ff6a00] bg-orange-50 dark:bg-[#2d2d44]'
                                : 'border border-gray-200 dark:border-slate-600 bg-white dark:bg-[#1e293b] hover:border-orange-300'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <div className="w-[18px] h-[18px] rounded-full border-2 border-[#ff6a00] flex items-center justify-center flex-shrink-0">
                                {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#ff6a00]" />}
                              </div>
                              <span className="text-xs md:text-sm font-semibold text-gray-800 dark:text-slate-200">
                                {method.method_name || method.label}
                              </span>
                            </div>
                            <span className="text-xs md:text-sm font-extrabold text-gray-800 dark:text-slate-200">
                              {calculatedPrice === 0 ? 'Free' : `TZS ${calculatedPrice.toLocaleString()}`}
                            </span>
                          </div>
                        );
                      })}
                      {shippingMethods.length === 0 && (
                        <p className="text-center text-gray-400 dark:text-slate-500 p-5 text-sm">
                          No shipping methods available
                        </p>
                      )}
                    </div>
                  </div>
                </form>
              </div>

              {/* ===== ORDER SUMMARY SECTION ===== */}
              <div className="flex-1 w-full bg-white dark:bg-[#1e293b] p-4 md:p-6 rounded-2xl border border-gray-200 dark:border-slate-700 md:sticky md:top-5">
                <h3 className="font-extrabold mb-5 text-base md:text-lg text-gray-800 dark:text-slate-200">
                  Order Summary
                </h3>

                {orderItems.length > 0 && (
                  <div className="mb-4 max-h-[200px] overflow-y-auto">
                    {orderItems.slice(0, 3).map((item, idx) => (
                      <div
                        key={idx}
                        className="flex gap-2.5 py-2 border-b border-gray-100 dark:border-slate-700"
                      >
                        <img
                          src={item.cover_image_url || item.image || item.product_image || '/placeholder-image.jpg'}
                          alt={item.name}
                          className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold m-0 text-gray-800 dark:text-slate-200 truncate">
                            {item.name?.slice(0, 30)}
                          </p>
                          <p className="text-[11px] text-gray-500 dark:text-slate-400 m-0">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <span className="text-xs font-bold text-[#ff6a00] flex-shrink-0">
                          TZS {(Number(item.price) * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                    {orderItems.length > 3 && (
                      <p className="text-[11px] text-gray-400 dark:text-slate-500 text-center mt-2">
                        +{orderItems.length - 3} more items
                      </p>
                    )}
                  </div>
                )}

                <div className="flex justify-between mb-3">
                  <span className="text-sm text-gray-500 dark:text-slate-400">
                    Subtotal ({orderItems.length} items)
                  </span>
                  <span className="font-bold text-sm text-gray-800 dark:text-slate-200">
                    TZS {subtotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between mb-3">
                  <span className="text-sm text-gray-500 dark:text-slate-400">
                    {selectedShipping?.method_name || selectedShipping?.label || 'Shipping'}
                  </span>
                  <span className="font-bold text-sm text-gray-800 dark:text-slate-200">
                    {currentShippingPrice === 0 ? 'Free' : `TZS ${currentShippingPrice.toLocaleString()}`}
                  </span>
                </div>

                <hr className="my-4 border-none border-t border-gray-200 dark:border-slate-700" />

                <div className="flex justify-between items-center mb-5">
                  <strong className="text-base md:text-lg text-gray-800 dark:text-slate-200">
                    Total
                  </strong>
                  <strong className="text-xl md:text-2xl text-[#ff6a00] font-black">
                    TZS {totalAmount.toLocaleString()}
                  </strong>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={orderItems.length === 0 || loading}
                  className="w-full py-3.5 md:py-4 bg-gradient-to-r from-[#ff9000] to-[#ff6a00] hover:from-[#ffa020] hover:to-[#ff7a10] text-white rounded-full border-none font-extrabold text-sm md:text-base cursor-pointer shadow-[0_4px_15px_rgba(255,106,0,0.3)] active:scale-[0.98] transition-all disabled:bg-gray-300 dark:disabled:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
                >
                  {loading ? 'Processing...' : 'Place Order'}
                </button>

                {/* Payment Info Box */}
                <div className="mt-4 mb-4 flex gap-3 items-start bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900/60 rounded-xl p-3">
                  <div className="text-2xl leading-none flex-shrink-0">💵</div>
                  <div className="flex-1">
                    <strong className="block text-sm text-green-800 dark:text-green-400 mb-1">
                      Payment Method: Cash on Delivery
                    </strong>
                    <p className="m-0 text-[13px] text-gray-700 dark:text-slate-300 leading-relaxed">
                      Kwa sasa, malipo yanafanyika <strong>baada ya kupokea bidhaa (Pay on Delivery)</strong>.
                      Hii inahakikisha unalipa pale tu bidhaa inapofika mikononi mwako.
                    </p>
                    <p className="text-xs text-gray-400 dark:text-slate-500 mt-2">
                      💳 Mfumo wa malipo mtandaoni (Online Payment) utakuja kwenye toleo lijalo.
                    </p>
                  </div>
                </div>

                {/* Secure badge */}
                <div className="flex items-center justify-center gap-1.5 mt-4">
                  <Lock size={14} className="text-emerald-500" />
                  <span className="text-[11px] text-gray-500 dark:text-slate-400">
                    Order protected by Skyfall.com
                  </span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CheckoutPage;