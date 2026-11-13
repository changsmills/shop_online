// src/pages/PricingPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Star, Zap, Crown, Loader2, Sparkles, Shield, Rocket, ArrowLeft } from "lucide-react";
// import Header from "../components/Header"; // 🔥 TUMEONDOA HEADER
import Footer from "../components/Footer";
import api from "../axiosConfig";

export default function PricingPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  const iconMap = {
    Zap: Zap,
    Star: Star,
    Crown: Crown,
    Sparkles: Sparkles,
    Shield: Shield,
    Rocket: Rocket
  };

  useEffect(() => {
    fetchPlans();
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (token) {
        const res = await api.get('/profile/');
        setUser(res.data);
      }
    } catch (error) {
      console.log("Mtumiaji hajaingia au token imeisha.");
      setUser(null);
    }
  };

  const fetchPlans = async () => {
    setLoading(true);
    try {
      setPlans([
        {
          id: 1,
          name: "Basic (Bure)",
          price: 0,
          period: "/mwezi",
          icon_name: "Zap",
          features: ["Picha 3 za Gallery", "Picha 1 ya Wasifu", "Mawasiliano ya WhatsApp"],
          button_text: "Kifurushi cha Sasa",
          is_recommended: false,
          is_current: true
        },
        {
          id: 2,
          name: "Standard",
          price: 15000,
          period: "/mwezi",
          icon_name: "Star",
          features: ["Picha 5 za Gallery", "Video ya Promo (12 sec)", "Beji ya 'Verified'", "Dashboard ya Mauzo", "Support ya Saa 24"],
          button_text: "Anza Sasa",
          is_recommended: true,
          is_current: false
        },
        {
          id: 3,
          name: "Premium (Duka Kubwa)",
          price: 45000,
          period: "/mwezi",
          icon_name: "Crown",
          features: ["Picha 5 za Gallery", "Video ya Promo (dakika 1)", "Matangazo (Ads) Kwenye Home", "Ripoti ya Wateja", "Kipaumbele Kwenye Search"],
          button_text: "Chagua Premium",
          is_recommended: false,
          is_current: false
        }
      ]);
    } catch (error) {
      console.error("Kosa kupata vifurushi:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (plan) => {
    if (!user) {
      navigate("/dashboard/login", {
        state: { message: "Tafadhali ingia ili kuchagua kifurushi cha biashara yako!" }
      });
      return;
    }

    setSelectedPlan(plan.id);
    setProcessing(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert(`Asante! Ombi lako la kifurushi cha "${plan.name}" limetumwa. Tutakujiana ndani ya saa 24.`);
    } catch (error) {
      console.error("Error:", error);
      alert("Kumekuwa na tatizo. Tafadhali jaribu tena.");
    } finally {
      setProcessing(false);
      setSelectedPlan(null);
    }
  };

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // ===== LOADING =====
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 dark:from-[#0f172a] dark:to-[#1e293b] relative z-[1] font-sans">
        {/* 🔥 Header imeondolewa hapa */}
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-5 pt-[70px]">
          <Loader2 size={48} className="animate-spin text-[#ff6a00]" />
          <p className="text-sm sm:text-base text-gray-500 dark:text-slate-400">Inapakia vifurushi...</p>
        </div>
        <div className="hidden sm:block"><Footer /></div>
      </div>
    );
  }

  return (
    // 🔥 font-sans imeongezwa hapa
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 dark:from-[#0f172a] dark:to-[#1e293b] relative z-[1] font-sans">
      
      {/* 🔥 Header imeondolewa hapa */}
      
      <div className="max-w-[1280px] mx-auto px-3 sm:px-4 md:px-6 pt-[70px] sm:pt-[90px] pb-15 sm:pb-20 overflow-visible">

        {/* 🔥 Back Arrow kwa Mobile tu */}
        <div className="mb-4 sm:hidden">
          <button
            onClick={() => navigate(-1)} // Inarudi kule alikotoka
            className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-slate-400 hover:text-[#ff6a00] dark:hover:text-[#ff6a00] transition-colors bg-white/50 dark:bg-slate-800/50 px-3 py-2 rounded-full backdrop-blur-sm"
          >
            <ArrowLeft size={18} />
            <span>Rudi Nyuma</span>
          </button>
        </div>

        {/* ===== HEADER ===== */}
        <div className="text-center mb-10 sm:mb-12 md:mb-[60px]">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 px-4 py-1.5 rounded-full mb-5">
            <Sparkles size={20} className="text-[#ff6a00]" />
            <span className="text-xs sm:text-[0.85rem] text-[#ff6a00] font-medium">
              Wauzaji 500+ wanatumia Skyfall
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[48px] font-extrabold mb-4 text-gray-900 dark:text-white">
            Boresha <span className="bg-gradient-to-br from-[#ff6a00] to-[#ffb800] bg-clip-text text-transparent">Duka Lako</span> 🚀
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-500 dark:text-slate-400 max-w-[600px] mx-auto">
            Chagua kifurushi kinachofaa biashara yako ili ufikie wateja wengi zaidi na kuongeza mauzo.
          </p>
        </div>

        {/* ===== PLANS GRID ===== */}
        <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-6 sm:gap-7 md:gap-8 mt-10 items-stretch">
          {plans.map((plan) => {
            const IconComponent = iconMap[plan.icon_name] || Zap;
            return (
              <div
                key={plan.id}
                className={`bg-white dark:bg-[#1e293b] rounded-[32px] p-6 sm:p-7 md:p-10 relative flex flex-col transition-all duration-300 backdrop-blur-md shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.4)] h-full hover:-translate-y-2 hover:shadow-[0_25px_40px_-12px_rgba(0,0,0,0.15)] hover:border-[#ff6a00] ${
                  plan.is_recommended
                    ? 'border-2 border-[#ff6a00] bg-gradient-to-br from-white to-orange-50 dark:from-[#1e293b] dark:to-[#2a1a0f] scale-[1.02] shadow-[0_20px_35px_-10px_rgba(255,106,0,0.2)] lg:scale-[1.02] md:scale-100'
                    : plan.is_current
                    ? 'border-2 border-emerald-500 bg-gradient-to-br from-white to-emerald-50 dark:from-[#1e293b] dark:to-[#0f2919] border border-gray-200 dark:border-slate-700'
                    : 'border border-gray-200/60 dark:border-slate-700'
                }`}
              >
                {plan.is_recommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-br from-[#ff6a00] to-[#e55a00] text-white px-3 sm:px-5 py-1.5 rounded-full text-[10px] sm:text-xs font-semibold whitespace-nowrap shadow-[0_4px_10px_rgba(255,106,0,0.3)] flex items-center gap-1.5">
                    <Star size={12} /> Inashauriwa
                  </div>
                )}

                {plan.is_current && (
                  <div className="absolute top-3 sm:top-5 right-3 sm:right-5 bg-emerald-500 text-white px-2.5 sm:px-3 py-1 rounded-full text-[9px] sm:text-[11px] font-semibold flex items-center gap-1">
                    <Check size={12} /> Kifurushi Chako
                  </div>
                )}

                <div className="mb-6">
                  <IconComponent
                    size={48}
                    className={
                      plan.icon_name === 'Star'
                        ? 'text-yellow-500'
                        : plan.icon_name === 'Crown'
                        ? 'text-purple-600'
                        : 'text-gray-400'
                    }
                  />
                </div>

                <h3 className="text-xl sm:text-[22px] md:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {plan.name}
                </h3>

                <div className="my-6 pb-6 border-b-2 border-gray-100 dark:border-slate-700">
                  <span className="text-base sm:text-lg font-medium text-gray-500 dark:text-slate-400 align-top mr-1">
                    TSh
                  </span>
                  <span className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white">
                    {formatPrice(plan.price)}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-xs sm:text-sm text-gray-400 dark:text-slate-500 ml-1">
                      {plan.period}
                    </span>
                  )}
                </div>

                {plan.price === 0 && (
                  <div className="inline-block w-fit bg-green-100 dark:bg-green-950/40 text-green-600 dark:text-green-400 px-3 py-1 rounded-full text-xs font-semibold -mt-2.5 mb-2.5">
                    Bure Kabisa!
                  </div>
                )}

                <ul className="list-none p-0 my-6 mb-8 flex-grow">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 mb-3.5 text-[13px] sm:text-sm text-gray-600 dark:text-slate-300 py-1">
                      <Check size={16} className="text-emerald-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan)}
                  disabled={processing && selectedPlan === plan.id}
                  className={`w-full py-3.5 px-5 rounded-full font-semibold text-sm sm:text-base cursor-pointer transition-all duration-300 border-none flex items-center justify-center gap-2 min-h-[48px] ${
                    plan.is_current
                      ? 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400 border border-gray-200 dark:border-slate-600 cursor-default shadow-none'
                      : 'bg-gradient-to-br from-[#ff6a00] to-[#e55a00] hover:from-[#e55a00] hover:to-[#cc4e00] text-white shadow-[0_4px_12px_rgba(255,106,0,0.25)] hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(255,106,0,0.35)] active:scale-[0.97]'
                  }`}
                >
                  {processing && selectedPlan === plan.id ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    plan.button_text
                  )}
                </button>

                {plan.price > 0 && !plan.is_current && (
                  <p className="text-[11px] text-gray-400 dark:text-slate-500 text-center mt-4">
                    * Malipo ya mwezi kwa mwezi
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* ===== FAQ ===== */}
        <div className="mt-12 sm:mt-16 md:mt-20 bg-white dark:bg-[#1e293b] rounded-3xl sm:rounded-[32px] px-4 sm:px-6 md:px-10 py-6 sm:py-8 md:py-12 border border-gray-200 dark:border-slate-700 pb-4">
          <h3 className="text-lg sm:text-xl md:text-2xl lg:text-[28px] font-bold text-center mb-6 sm:mb-8 md:mb-10 text-gray-900 dark:text-white">
            Maswali Yanayoulizwa Sana
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5 sm:gap-6 md:gap-8">
            {[
              { q: "Je, ninaweza kubadilisha kifurushi?", a: "Ndiyo, unaweza kuboresha au kupunguza kifurushi wakati wowote." },
              { q: "Je, kuna ada za usajili?", a: "Hakuna ada za usajili. Unalipa tu kifurushi ulichochagua." },
              { q: "Njia gani za malipo?", a: "M-Pesa, Airtel Money, kadi za benki, na bank transfer." },
              { q: "Je, ninaweza kughairi wakati wowote?", a: "Ndiyo, unaweza kughairi wakati wowote na hakuna adhabu." }
            ].map((faq, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl transition-all duration-300 hover:bg-gray-50 dark:hover:bg-slate-700 hover:translate-x-1"
              >
                <strong className="block mb-2 text-sm sm:text-base text-gray-900 dark:text-white">
                  {faq.q}
                </strong>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 leading-normal m-0">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 🔥 Ficha Footer kwenye simu (Mobile) */}
      <div className="hidden sm:block">
        <Footer />
      </div>
    </div>
  );
}