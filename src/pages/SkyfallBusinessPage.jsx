import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';

const SkyfallBusinessPage = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleStartSelling = () => navigate('/create-store');
  const handleLearnMore = () => {
    const stepsSection = document.getElementById('steps-section');
    if (stepsSection) stepsSection.scrollIntoView({ behavior: 'smooth' });
  };
  const handleRegisterSeller = () => navigate('/dashboard/register');
  const handleLogin = () => navigate('/dashboard/login');

  return (
    <div className="font-sans text-gray-800 bg-white dark:bg-slate-900 overflow-x-hidden">

      {/* ============================================
          1. HERO SECTION
      ============================================ */}
      <section className="px-5 md:px-[10%] py-10 md:py-20 md:pb-[60px] bg-gradient-to-br from-orange-50 to-white dark:from-slate-800 dark:to-slate-900 flex flex-col md:flex-row items-center gap-7 md:gap-10">

        {/* Left Content */}
        <div className="flex-1 w-full">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold leading-[1.1] text-gray-900 dark:text-white mb-4 md:mb-5">
            Skyfall ni nini? <br />
            <span className="text-[#ff6a00]">Soko Kuu la Kidijitali Tanzania.</span>
          </h1>

          <p className="text-sm md:text-lg text-gray-500 dark:text-slate-400 leading-relaxed mb-5 md:mb-7 max-w-[500px]">
            Skyfall ni jukwaa la kibiashara linalounganisha wauzaji wa jumla na rejareja nchi nzima. Tunarahisisha biashara kwa kukupa teknolojia ya kisasa ya kuwafikia wateja wengi zaidi.
          </p>

          <div className="flex flex-col md:flex-row gap-2.5 md:gap-4 flex-wrap">
            <button
              onClick={handleStartSelling}
              className="bg-[#ff6a00] hover:bg-[#e55a00] text-white px-5 md:px-8 py-3.5 rounded-lg border-none font-bold text-sm md:text-base cursor-pointer w-full md:w-auto transition-colors"
            >
              Anza Kuuza Bure
            </button>
            <button
              onClick={handleLearnMore}
              className="bg-transparent hover:bg-[#ff6a00] text-[#ff6a00] hover:text-white px-5 md:px-8 py-3.5 rounded-lg border-2 border-[#ff6a00] font-bold text-sm md:text-base cursor-pointer w-full md:w-auto transition-all"
            >
              Jifunze Zaidi
            </button>
          </div>

          <p className="mt-5 text-sm text-gray-500 dark:text-slate-400">
            Tayari una akaunti?{" "}
            <span
              onClick={handleLogin}
              className="text-[#ff6a00] cursor-pointer font-semibold hover:underline"
            >
              Ingia hapa
            </span>
          </p>
        </div>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-2 gap-3 md:gap-5 w-full md:w-1/2 flex-shrink-0">
          {[
            { label: 'Mikoa na Wilaya', val: '500+', sub: 'Tanzania nzima' },
            { label: 'Viwanda & Store', val: '1,000+', sub: 'Zilizothibitishwa' },
            { label: 'Bidhaa (Categories)', val: '5,900+', sub: 'Zinazouzwa' },
            { label: 'Lugha za Biashara', val: '2+', sub: 'Kiswahili & English' }
          ].map((stat, i) => (
            <div
              key={i}
              className="p-4 md:p-7 bg-white dark:bg-slate-800 shadow-[0_10px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.4)] rounded-xl border border-gray-200 dark:border-slate-700 transition-transform duration-300 cursor-pointer text-center hover:-translate-y-1"
            >
              <h2 className="text-xl md:text-[32px] font-extrabold text-[#ff6a00] m-0 mb-1">
                {stat.val}
              </h2>
              <p className="text-xs md:text-sm font-semibold text-gray-900 dark:text-white m-0">
                {stat.label}
              </p>
              <p className="text-[10px] md:text-xs text-gray-400 dark:text-slate-500 mt-1 m-0">
                {stat.sub}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================
          2. STEPS SECTION
      ============================================ */}
      <section id="steps-section" className="px-5 md:px-[10%] py-10 md:py-20 bg-gray-50 dark:bg-slate-800">

        <div className="text-center mb-8 md:mb-[60px]">
          <h2 className="text-xl sm:text-2xl md:text-[32px] font-extrabold mb-2.5 text-gray-900 dark:text-white">
            Ni rahisi kuanza kuuza kwenye Skyfall
          </h2>
          <p className="text-sm md:text-base text-gray-500 dark:text-slate-400">
            Fuata hatua hizi chache kukuza biashara yako leo.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-7 md:gap-[60px] items-center">

          {/* Image - Desktop only */}
          {!isMobile && (
            <div className="relative rounded-[20px] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.1)] cursor-pointer flex-1">
              <img
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop"
                alt="Business Growth"
                className="w-full block object-cover"
              />
            </div>
          )}

          <div className="flex flex-col gap-4 md:gap-[25px] flex-1 w-full md:w-auto">
            {[
              { title: 'Fungua Akaunti', desc: 'Jisajili kama muuzaji na upate duka lako la kidijitali ndani ya dakika 2.', icon: <LucideIcons.UserPlus size={isMobile ? 20 : 24} />, action: () => navigate('/dashboard/register') },
              { title: 'Pakia Bidhaa', desc: 'Weka picha nzuri na bei za bidhaa zako ili wateja wazione.', icon: <LucideIcons.Package size={isMobile ? 20 : 24} />, action: () => navigate('/dashboard/products') },
              { title: 'Weka Matangazo (Ads)', desc: 'Tumia Skyfall Ads kupata kipaumbele na kuonekana mbele ya washindani.', icon: <LucideIcons.Zap size={isMobile ? 20 : 24} />, action: () => navigate('/advertise') },
              { title: 'Pokea Oda na Kulipwa', desc: 'Ongea na wateja na upokee malipo yako kwa usalama kabisa.', icon: <LucideIcons.CreditCard size={isMobile ? 20 : 24} />, action: () => navigate('/dashboard/orders') }
            ].map((step, i) => (
              <div
                key={i}
                onClick={step.action}
                className="flex gap-3.5 md:gap-5 cursor-pointer p-2 md:p-2.5 rounded-xl transition-all duration-300 items-start hover:bg-white dark:hover:bg-slate-700 hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
              >
                <div className="bg-white dark:bg-slate-700 text-[#ff6a00] w-10 h-10 md:w-[50px] md:h-[50px] rounded-full flex justify-center items-center shadow-[0_5px_15px_rgba(255,106,0,0.2)] flex-shrink-0">
                  {step.icon}
                </div>
                <div>
                  <h4 className="m-0 mb-1 text-sm md:text-lg font-bold text-gray-900 dark:text-white">
                    Hatua ya {i + 1}: {step.title}
                  </h4>
                  <p className="m-0 text-xs md:text-sm text-gray-500 dark:text-slate-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          3. FEATURES SECTION
      ============================================ */}
      <section className="px-5 md:px-[10%] py-10 md:py-20 bg-white dark:bg-slate-900">

        <div className="text-center mb-8 md:mb-[60px]">
          <h2 className="text-xl sm:text-2xl md:text-[32px] font-extrabold mb-2.5 text-gray-900 dark:text-white">
            Kwa nini kuchagua Skyfall?
          </h2>
          <p className="text-sm md:text-base text-gray-500 dark:text-slate-400">
            Tunakupa zana bora za kukuza biashara yako
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4 md:gap-[30px]">
          {[
            { icon: <LucideIcons.Shield size={isMobile ? 32 : 40} />, title: 'Usalama wa Juu', desc: 'Malipo na taarifa zako zinalindwa kwa teknolojia za kisasa' },
            { icon: <LucideIcons.Truck size={isMobile ? 32 : 40} />, title: 'Usafirishaji Rahisi', desc: 'Tunaungana na makampuni bora ya usafirishaji Tanzania' },
            { icon: <LucideIcons.Headphones size={isMobile ? 32 : 40} />, title: 'Msaada wa 24/7', desc: 'Timu yetu iko tayari kukusaidia wakati wote' },
            { icon: <LucideIcons.BarChart3 size={isMobile ? 32 : 40} />, title: 'Analytics za Biashara', desc: 'Fuata mauzo yako na ujue wateja wako wanataka nini' }
          ].map((feature, i) => (
            <div
              key={i}
              className="text-center p-5 md:p-[30px] rounded-xl transition-all duration-300 cursor-pointer border border-transparent hover:bg-gray-50 dark:hover:bg-slate-800 hover:-translate-y-1 hover:border-[#ff6a00]"
            >
              <div className="text-[#ff6a00] mb-4">{feature.icon}</div>
              <h3 className="text-base md:text-xl font-bold mb-2 text-gray-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-sm md:text-[15px] text-gray-500 dark:text-slate-400 leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================
          4. TESTIMONIALS SECTION
      ============================================ */}
      <section className="px-5 md:px-[10%] py-10 md:py-20 bg-gray-50 dark:bg-slate-800">

        <div className="text-center mb-8 md:mb-[60px]">
          <h2 className="text-xl sm:text-2xl md:text-[32px] font-extrabold mb-2.5 text-gray-900 dark:text-white">
            Wanachosema Wajasiriamali
          </h2>
          <p className="text-sm md:text-base text-gray-500 dark:text-slate-400">
            Maelfu ya wauzaji wanathamini Skyfall
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4 md:gap-[30px]">
          {[
            { name: 'John Mwita', store: 'Mwita Electronics', comment: 'Tangu nianze kutumia Skyfall, mauzo yangu yameongezeka kwa 150%!' },
            { name: 'Sarah John', store: 'Sarah Fashion', comment: 'Rahisi kutumia na wateja wananiamini kwa sababu ya Skyfall.' },
            { name: 'Ali Hassan', store: 'Hassan Hardware', comment: 'Skyfall imenifungulia milango ya wateja wapya nchi nzima.' }
          ].map((testimonial, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-900 p-5 md:p-[30px] rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.4)]"
            >
              <div className="text-[#ff6a00] text-[30px] mb-2.5">"</div>
              <p className="text-gray-600 dark:text-slate-300 leading-relaxed italic text-sm md:text-[15px]">
                {testimonial.comment}
              </p>
              <div className="mt-5">
                <p className="font-bold m-0 text-gray-900 dark:text-white">{testimonial.name}</p>
                <p className="text-xs text-gray-400 dark:text-slate-500 m-0">{testimonial.store}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================
          5. CTA SECTION
      ============================================ */}
      <section className="px-5 md:px-[10%] py-14 md:py-[100px] text-center bg-gradient-to-br from-[#ff6a00] to-[#e55a00] text-white">
        <h2 className="text-2xl sm:text-3xl md:text-[40px] font-extrabold mb-4">
          Tayari kukuza biashara yako?
        </h2>
        <p className="text-sm md:text-lg opacity-90 mb-7 max-w-[700px] mx-auto px-2.5">
          Jiunge na maelfu ya Store za Tanzania zilizopo Skyfall sasa hivi na uanze kuwafikia wateja kutoka kila pembe ya nchi.
        </p>

        <button
          onClick={handleRegisterSeller}
          className="bg-white hover:scale-105 hover:shadow-[0_10px_25px_rgba(0,0,0,0.2)] text-[#ff6a00] px-7 md:px-11 py-3.5 md:py-[18px] rounded-[30px] border-none font-bold text-sm md:text-lg cursor-pointer w-full md:w-auto transition-all"
        >
          Jisajili Kama Muuzaji Sasa
        </button>

        <p className="mt-5 text-xs md:text-sm opacity-80">
          Au{" "}
          <span onClick={handleLogin} className="underline cursor-pointer hover:opacity-100">
            ingia kwenye akaunti yako
          </span>{" "}
          ikiwa tayari una store
        </p>
      </section>

      {/* ============================================
          FOOTER
      ============================================ */}
      <footer className="px-5 md:px-[10%] py-7 md:py-10 bg-gray-900 text-gray-400 text-center">
        <p className="text-xs md:text-sm">&copy; 2024 Skyfall. Haki zote zimehifadhiwa.</p>
        <div className="flex justify-center gap-3 md:gap-5 mt-4 flex-wrap text-xs md:text-sm">
          <span onClick={() => navigate('/terms')} className="cursor-pointer hover:text-white transition-colors">Terms</span>
          <span onClick={() => navigate('/privacy')} className="cursor-pointer hover:text-white transition-colors">Privacy</span>
          <span onClick={() => navigate('/contact-us')} className="cursor-pointer hover:text-white transition-colors">Contact</span>
          <span onClick={() => navigate('/help-center')} className="cursor-pointer hover:text-white transition-colors">Help</span>
        </div>
      </footer>
    </div>
  );
};

export default SkyfallBusinessPage;