import React from 'react';
import { useNavigate } from 'react-router-dom';

const SellerDashboard = () => {
  const navigate = useNavigate();

  const handleStartSelling = () => {
    navigate('/create-store');
  };

  return (
    <div className="font-sans dark:bg-slate-900">

      {/* ==========================================
          1. HERO SECTION (VIDEO)
         ========================================== */}
      <div className="relative w-full h-[500px] sm:h-[550px] md:h-[650px] flex items-center justify-center flex-col text-white overflow-hidden bg-black">

        {/* Video Background */}
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-100 z-0">
          <source src="https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4" type="video/mp4" />
        </video>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/20 z-[1]" />

        {/* Content */}
        <div className="relative z-[2] text-center px-4 sm:px-5 max-w-full">

          <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-3 sm:mb-4">
            Sell on Skyfall.com
          </h2>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-bold mb-6 sm:mb-8 leading-tight max-w-[800px] mx-auto">
            Scale up your business and go<br className="hidden sm:block" />global with one membership
          </h1>

          {/* Watch video link */}
          <div className="flex items-center justify-center gap-3 mb-8 sm:mb-9 cursor-pointer group">
            <div className="bg-white rounded-full w-8 h-8 flex items-center justify-center pl-0.5 transition-transform group-hover:scale-110">
              <span className="text-black text-xs">▶</span>
            </div>
            <span className="text-white text-xs sm:text-sm font-medium">
              Watch 2-min video
            </span>
          </div>

          {/* CTA Button */}
          <button
            onClick={handleStartSelling}
            className="bg-[#1677ff] hover:bg-[#0958d9] text-white px-8 sm:px-10 md:px-12 py-3 sm:py-3.5 rounded font-bold text-sm sm:text-base border-none cursor-pointer transition-colors"
          >
            Start selling now
          </button>
        </div>
      </div>

      {/* ==========================================
          2. VERIFICATION & TRUST SECTION
         ========================================== */}
      <div className="px-4 sm:px-5 py-8 sm:py-10 bg-white dark:bg-slate-900">
        <div className="max-w-[1000px] mx-auto">

          {/* Header */}
          <div className="text-center mb-5">
            <span className="inline-block bg-[#FF6600] text-white px-4 py-1 rounded-full text-xs font-bold">
              ✅ Verified by Skyfall
            </span>
            <h2 className="text-2xl sm:text-[28px] font-bold mt-4 mb-1.5 text-gray-900 dark:text-white">
              We verify every company and store
            </h2>
            <p className="text-sm sm:text-base text-gray-500 dark:text-slate-400">
              To ensure trust, we require all sellers to provide legal business documents before listing.
            </p>
          </div>

          {/* Trust Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 sm:gap-5 md:gap-6 mt-7">

            {[
              { emoji: '🏛️', title: 'Business License', desc: 'Valid BRELA or Government Certificate' },
              { emoji: '📄', title: 'TIN / Tax ID', desc: 'Tax Identification Number for formal trading' },
              { emoji: '🏭', title: 'Physical Location', desc: 'Store/Office verification via Google Maps' },
              { emoji: '🛡️', title: 'Store & Product Photos', desc: 'Real images of your inventory and office' }
            ].map((item, i) => (
              <div
                key={i}
                className="text-center p-4 sm:p-5 bg-[#f8faff] dark:bg-slate-800 rounded-xl border border-[#eef2ff] dark:border-slate-700"
              >
                <div className="text-2xl sm:text-[32px]">{item.emoji}</div>
                <h4 className="text-sm sm:text-[15px] font-bold mt-1 mb-1 text-gray-900 dark:text-white">
                  {item.title}
                </h4>
                <p className="text-xs sm:text-[13px] text-gray-500 dark:text-slate-400 m-0">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Bottom note */}
          <div className="text-center mt-7 sm:mt-8 bg-orange-50 dark:bg-[#2d1a0f] p-4 sm:p-5 rounded-xl border border-orange-100 dark:border-orange-900/50">
            <p className="m-0 text-sm sm:text-[15px] text-gray-800 dark:text-slate-200 leading-relaxed">
              <strong className="text-[#FF6600]">🔒 Only verified sellers</strong> get the "Trusted" badge on their profile, increasing sales by an average of <strong>2.5x</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* ==========================================
          3. STEPS SECTION
         ========================================== */}
      <div className="bg-[#050c1a] px-4 sm:px-5 py-12 sm:py-14 md:py-[60px] text-center text-white">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[36px] font-bold mb-8 sm:mb-10 md:mb-[60px] max-w-[900px] mx-auto">
          Start your borderless business in 3 easy steps:
        </h2>

        {/* Steps Container */}
        <div className="relative flex flex-col md:flex-row justify-center gap-8 md:gap-20 max-w-[1000px] mx-auto">

          {/* Connecting Line (desktop only) */}
          <div className="hidden md:block absolute top-[35px] left-[15%] right-[15%] h-[2px] bg-white/15 z-0" />

          {[
            { num: 1, title: 'Leave your information', sub: 'for us to contact you' },
            { num: 2, title: 'Select a plan and pay', sub: '' },
            { num: 3, title: 'Verify your business', sub: '' }
          ].map((step, i) => (
            <div key={i} className="flex flex-col items-center flex-1 relative z-[1]">
              <div className="w-12 h-12 rounded-full bg-[#729aff] flex items-center justify-center font-bold text-xl sm:text-[22px] text-white">
                {step.num}
              </div>
              <div className="mt-4 sm:mt-5 text-base sm:text-lg font-semibold">
                {step.title}
              </div>
              {step.sub && (
                <div className="text-xs sm:text-[15px] text-gray-300 mt-1">
                  {step.sub}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <button
          onClick={handleStartSelling}
          className="mt-10 sm:mt-12 md:mt-[50px] bg-[#1677ff] hover:bg-[#0958d9] text-white px-8 sm:px-10 md:px-12 py-3 rounded font-bold text-sm sm:text-base border-none cursor-pointer transition-colors"
        >
          Start selling now
        </button>
      </div>

      {/* ==========================================
          4. INFO SECTION
         ========================================== */}
      <div className="bg-gray-50 dark:bg-slate-900 px-4 sm:px-5 py-10 sm:py-14 md:py-[80px]">
        <div className="max-w-[1200px] mx-auto">

          {/* Header */}
          <div className="text-center mb-8 sm:mb-10 md:mb-[50px]">
            <h2 className="text-xl sm:text-2xl md:text-[32px] font-bold text-gray-900 dark:text-white">
              Who is Skyfall for?
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-500 dark:text-slate-400 max-w-[700px] mx-auto mt-2.5">
              Built for serious businesses looking to expand their reach to thousands of everyday buyers and small shops.
            </p>
          </div>

          {/* Two Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6 md:gap-10">

            {/* Card 1: Wholesalers */}
            <div className="bg-white dark:bg-slate-800 p-5 sm:p-6 md:p-8 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] border border-gray-200 dark:border-slate-700">
              <span className="inline-block bg-[#FF6600] text-white px-3 py-1 rounded-full text-xs font-bold mb-2.5">
                📦 Wholesale & Bulk
              </span>
              <h3 className="text-lg sm:text-xl md:text-[22px] font-bold my-2.5 text-gray-900 dark:text-white">
                Wholesalers & Manufacturers
              </h3>
              <p className="text-sm sm:text-base text-gray-500 dark:text-slate-400 leading-relaxed">
                If you have <strong className="text-gray-800 dark:text-white">stock of 50+ units</strong> in your category, Skyfall connects you directly to hundreds of retailers and bulk buyers.
              </p>

              <div className="bg-orange-50 dark:bg-[#2d1a0f] p-4 rounded-xl border-l-4 border-l-[#FF6600] mt-4">
                <strong className="text-[#FF6600] text-sm">📈 Proven Strategy:</strong>
                <p className="text-xs sm:text-sm mt-1.5 mb-0 text-gray-700 dark:text-slate-300 leading-relaxed">
                  Top wholesalers generate <strong>4x more leads</strong> by listing full inventory and offering discounts.
                </p>
              </div>
            </div>

            {/* Card 2: Retailers */}
            <div className="bg-white dark:bg-slate-800 p-5 sm:p-6 md:p-8 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] border border-gray-200 dark:border-slate-700">
              <span className="inline-block bg-[#FF6600] text-white px-3 py-1 rounded-full text-xs font-bold mb-2.5">
                🏪 Retail & Local Shops
              </span>
              <h3 className="text-lg sm:text-xl md:text-[22px] font-bold my-2.5 text-gray-900 dark:text-white">
                Retailers & Small Store Owners
              </h3>
              <p className="text-sm sm:text-base text-gray-500 dark:text-slate-400 leading-relaxed">
                We help <strong className="text-gray-800 dark:text-white">local shops and small retailers</strong> reach everyday customers, universities, and hotels looking for single or bulk purchases.
              </p>

              <div className="bg-orange-50 dark:bg-[#0f1a2d] p-4 rounded-xl border-l-4 border-l-[#0071dc] mt-4">
                <strong className="text-[#0071dc] text-sm">🛒 How it works:</strong>
                <p className="text-xs sm:text-sm mt-1.5 mb-0 text-gray-700 dark:text-slate-300 leading-relaxed">
                  Retailers list products and instantly get access to thousands of local everyday buyers.
                </p>
              </div>
            </div>
          </div>

          {/* Grow Section */}
          <div className="mt-10 sm:mt-12 md:mt-[60px] bg-white dark:bg-slate-800 p-5 sm:p-8 md:p-10 rounded-2xl border border-gray-200 dark:border-slate-700">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-5 flex items-center gap-2.5 text-gray-900 dark:text-white">
              <span className="text-[#FF6600]">💡</span> How we help you grow
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-5">

              {[
                { emoji: '📊', title: 'Data-Driven Insights', desc: 'We show you trending products so you stock exactly what buyers want.' },
                { emoji: '🤝', title: 'Connect with Buyers', desc: 'From a student buying 1 item to a business buying 100.' },
                { emoji: '✅', title: 'Verified Trust', desc: 'We verify licenses so buyers trust you instantly, leading to faster sales.' }
              ].map((item, i) => (
                <div key={i}>
                  <div className="text-2xl sm:text-[28px]">{item.emoji}</div>
                  <h4 className="text-sm sm:text-base font-bold mt-1.5 mb-1 text-gray-900 dark:text-white">
                    {item.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 leading-relaxed m-0">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ==========================================
          5. FLOATING CHAT WIDGET
         ========================================== */}
      <div
        onClick={() => window.open('https://wa.me/255754394845', '_blank')}
        className="fixed bottom-6 sm:bottom-[30px] right-4 sm:right-[30px] w-12 h-12 sm:w-[50px] sm:h-[50px] bg-[#0066ff] hover:bg-[#0052cc] rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.3)] cursor-pointer z-[999] transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-white"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </div>
    </div>
  );
};

export default SellerDashboard;