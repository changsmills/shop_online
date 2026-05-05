import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { Check, Star, Zap, Crown, Loader2, Sparkles, Shield, Rocket } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../PricingPage.css";

export default function PricingPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  // Icons mapping
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
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user || null);
  };

  const fetchPlans = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('pricing_plans')
      .select('*')
      .eq('status', 'active')
      .order('display_order', { ascending: true });

    if (!error && data) {
      setPlans(data);
    } else {
      // Fallback data if database empty
      setPlans([
        {
          id: 1,
          name: "Basic (Bure)",
          price: 0,
          period: "/mwezi",
          icon_name: "Zap",
          features: ["Picha 5 za Gallery", "Picha 1 ya Wasifu", "Video 1 ya Promo (15 sec)", "Mawasiliano ya WhatsApp"],
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
          features: ["Picha 15 za Gallery", "Video 2 za Promo (30 sec)", "Beji ya 'Verified'", "Dashboard ya Mauzo", "Support ya Saa 24"],
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
          features: ["Picha Zisizo na Kikomo", "Video 5 za Promo (dakika 1)", "Matangazo (Ads) Kwenye Home", "Ripoti ya Wateja", "Kipaumbele Kwenye Search"],
          button_text: "Chagua Premium",
          is_recommended: false,
          is_current: false
        }
      ]);
    }
    setLoading(false);
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

    // Save subscription request
    const { error } = await supabase
      .from('subscription_requests')
      .insert([
        {
          user_id: user.id,
          user_email: user.email,
          plan_id: plan.id,
          plan_name: plan.name,
          price: plan.price,
          status: 'pending',
          created_at: new Date()
        }
      ]);

    if (error) {
      console.error("Error:", error);
      alert("Kumekuwa na tatizo. Tafadhali jaribu tena.");
    } else {
      alert(`Asante! Ombi lako la kifurushi cha "${plan.name}" limetumwa. Tutakujiana ndani ya saa 24.`);
    }
    
    setProcessing(false);
    setSelectedPlan(null);
  };

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  if (loading) {
    return (
      <div className="pricing-wrapper">
        <Header />
        <div className="loading-container">
          <Loader2 size={48} className="animate-spin" style={{ color: '#ff6a00' }} />
          <p>Loading pricing plans...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="pricing-wrapper">
      <Header />
      
      <div className="pricing-container">
        <div className="pricing-header text-center">
          <div className="pricing-badge">
            <Sparkles size={20} />
            <span>Wauzaji 500+ wanatumia Skyfall</span>
          </div>
          <h1 className="pricing-title">
            Boresha <span className="gradient-text">Duka Lako</span> 🚀
          </h1>
          <p className="pricing-subtitle">
            Chagua kifurushi kinachofaa biashara yako ili ufikie wateja wengi zaidi na kuongeza mauzo.
          </p>
        </div>

        <div className="plans-grid">
          {plans.map((plan) => {
            const IconComponent = iconMap[plan.icon_name] || Zap;
            return (
              <div 
                key={plan.id} 
                className={`plan-card ${plan.is_recommended ? "recommended" : ""} ${plan.is_current ? "current-plan" : ""}`}
              >
                {plan.is_recommended && (
                  <div className="badge-recommended">
                    <Star size={12} /> Inashauriwa
                  </div>
                )}
                {plan.is_current && (
                  <div className="badge-current">
                    <Check size={12} /> Kifurushi Chako
                  </div>
                )}
                
                <div className="plan-icon">
                  <IconComponent size={32} className={plan.icon_name === 'Star' ? 'text-yellow-500' : plan.icon_name === 'Crown' ? 'text-purple-600' : 'text-gray-400'} />
                </div>
                
                <h3 className="plan-name">{plan.name}</h3>
                
                <div className="plan-price">
                  <span className="currency">TSh</span>
                  <span className="amount">{formatPrice(plan.price)}</span>
                  {plan.price > 0 && <span className="period">{plan.period}</span>}
                </div>

                {plan.price === 0 && (
                  <div className="free-badge">Bure Kabisa!</div>
                )}

                <ul className="plan-features">
                  {plan.features.map((feature, i) => (
                    <li key={i}>
                      <Check size={16} className="check-icon" /> 
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan)}
                  disabled={processing && selectedPlan === plan.id}
                  className={`plan-btn ${plan.is_current ? "btn-current" : "btn-action"}`}
                >
                  {processing && selectedPlan === plan.id ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    plan.button_text
                  )}
                </button>

                {plan.price > 0 && !plan.is_current && (
                  <p className="plan-note">* Malipo ya mwezi kwa mwezi</p>
                )}
              </div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="pricing-faq">
          <h3>Maswali Yanayoulizwa Sana</h3>
          <div className="faq-grid">
            <div className="faq-item">
              <strong>Je, ninaweza kubadilisha kifurushi?</strong>
              <p>Ndiyo, unaweza kuboresha au kupunguza kifurushi wakati wowote.</p>
            </div>
            <div className="faq-item">
              <strong>Je, kuna ada za usajili?</strong>
              <p>Hakuna ada za usajili. Unalipa tu kifurushi ulichochagua.</p>
            </div>
            <div className="faq-item">
              <strong>Njia gani za malipo?</strong>
              <p>M-Pesa, Airtel Money, kadi za benki, na bank transfer.</p>
            </div>
            <div className="faq-item">
              <strong>Je, ninaweza kughairi wakati wowote?</strong>
              <p>Ndiyo, unaweza kughairi wakati wowote na hakuna adhabu.</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}