import { Link } from "react-router-dom";
import * as LucideIcons from "lucide-react";

export default function HowToBuy() {
  const steps = [
    {
      icon: "UserPlus",
      title: "1. Jiunge / Ingia",
      description: "Jisajili kwa urahisi kwa kutumia email au namba ya simu. Kisha ingia kwenye akaunti yako.",
      color: "#ff6a00"
    },
    {
      icon: "Search",
      title: "2. Tafuta Bidhaa",
      description: "Tumia search bar au browse kwa categories. Unaweza pia kuchuja kwa bei, brand, au location.",
      color: "#0071dc"
    },
    {
      icon: "ShoppingCart",
      title: "3. Ongeza Kwenye Cart",
      description: "Bonyeza 'Add to Cart' kwenye bidhaa unayotaka. Unaweza kuongeza bidhaa nyingi kutoka kwa wauzaji tofauti.",
      color: "#27ae60"
    },
    {
      icon: "FileText",
      title: "4. Kagua Oda Yako",
      description: "Nenda kwenye cart yako, hakikisha wingi na bei ni sahihi. Kisha bonyeza 'Proceed to Checkout'.",
      color: "#8e44ad"
    },
    {
      icon: "Truck",
      title: "5. Chagua Usafirishaji",
      description: "Chagua njia ya usafirishaji. Tunatoa huduma za posta, basi, au courier kwa kutumia stendi.",
      color: "#e67e22"
    },
    {
      icon: "CreditCard",
      title: "6. Lipa Salama",
      description: "Lipa kwa M-Pesa, Airtel Money, au bank transfer. Malipo yako yanalindwa na Skyfall Protection.",
      color: "#16a085"
    }
  ];

  const benefits = [
    { icon: "ShieldCheck", title: "Ulinzi wa Mnunuzi", desc: "Pesa yako inalindwa mpaka bidhaa ifike" },
    { icon: "MessageCircle", title: "Msaada wa 24/7", desc: "Timu yetu iko tayari kukusaidia" },
    { icon: "Truck", title: "Tracking ya Stendi", desc: "Fuata mzigo wako kwa namba za basi" },
    { icon: "RefreshCw", title: "Refund Policy", desc: "Rudisha bidhaa ndani ya siku 14" }
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-5 py-8 sm:py-10 dark:bg-slate-900 min-h-screen">

      {/* ===== HEADER ===== */}
      <div className="text-center mb-10 sm:mb-12">
        <h1 className="text-2xl sm:text-3xl md:text-[36px] font-bold text-gray-900 dark:text-white mb-4">
          Jinsi ya Kuanza Kununua <span className="text-[#ff6a00]">Skyfall</span>
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-gray-500 dark:text-slate-400 max-w-[600px] mx-auto">
          Fuata hatua hizi 6 rahisi kuanza kununua bidhaa kwa bei ya jumla
        </p>
      </div>

      {/* ===== STEPS GRID ===== */}
      <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-5 sm:gap-6 md:gap-[30px] mb-12 sm:mb-[60px]">

        {steps.map((step, index) => {
          const IconComponent = LucideIcons[step.icon];
          return (
            <div
              key={index}
              className="bg-white dark:bg-slate-800 rounded-xl p-5 sm:p-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.4)] border border-gray-100 dark:border-slate-700 transition-all duration-200 cursor-pointer hover:-translate-y-[5px] hover:shadow-[0_8px_25px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_8px_25px_rgba(0,0,0,0.6)]"
            >
              <div
                className="w-[60px] h-[60px] rounded-full flex items-center justify-center mb-5"
                style={{ backgroundColor: `${step.color}15` }}
              >
                {IconComponent && (
                  <IconComponent size={30} style={{ color: step.color }} />
                )}
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                {step.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed">
                {step.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* ===== BENEFITS SECTION ===== */}
      <div className="bg-gray-50 dark:bg-slate-800 rounded-2xl p-5 sm:p-8 md:p-10 mb-10">
        <h2 className="text-center text-xl sm:text-2xl md:text-[28px] font-bold mb-8 sm:mb-10 text-gray-900 dark:text-white">
          Kwanini Ununue <span className="text-[#ff6a00]">Skyfall?</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-5 sm:gap-6 md:gap-[30px]">

          {benefits.map((benefit, index) => {
            const IconComponent = LucideIcons[benefit.icon];
            return (
              <div key={index} className="text-center">
                <div className="w-[70px] h-[70px] rounded-full bg-white dark:bg-slate-700 flex items-center justify-center mx-auto mb-4 shadow-[0_2px_8px_rgba(0,0,0,0.05)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
                  {IconComponent && <IconComponent size={32} className="text-[#ff6a00]" />}
                </div>
                <h4 className="text-base sm:text-lg font-semibold mb-2.5 text-gray-900 dark:text-white">
                  {benefit.title}
                </h4>
                <p className="text-xs sm:text-[13px] text-gray-500 dark:text-slate-400">
                  {benefit.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ===== CTA BUTTON ===== */}
      <div className="text-center">
        <Link
          to="/"
          className="inline-block bg-[#ff6a00] hover:bg-[#e55a00] text-white px-8 sm:px-10 py-3.5 rounded-[40px] no-underline font-semibold text-sm sm:text-base transition-colors duration-300"
        >
          Anza Kununua Sasa
        </Link>
      </div>
    </div>
  );
}