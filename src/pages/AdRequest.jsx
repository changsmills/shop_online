import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as LucideIcons from "lucide-react";

export default function AdRequest() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [userProfile, setUserProfile] = useState({ name: "", phone: "", email: "" });
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    businessName: "",
    businessType: "",
    adType: "keyword",
    productName: "",
    productDescription: "",
    productLink: "",
    productImages: [],
    targetCategory: "",
    budget: "",
    duration: "30",
    targetLocation: "Tanzania",
    targetAudience: "",
    specialRequests: "",
    hearAboutUs: ""
  });

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate("/dashboard/login", {
          state: { message: "Tafadhali ingia ili kuweza kutuma ombi la tangazo!" }
        });
      } else {
        setUser(session.user);
        setFormData(prev => ({
          ...prev,
          email: session.user.email || "",
          fullName: session.user.user_metadata?.full_name || "",
          phoneNumber: session.user.user_metadata?.phone || ""
        }));

        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          setFormData(prev => ({
            ...prev,
            fullName: profile.full_name || prev.fullName,
            phoneNumber: profile.phone || prev.phoneNumber,
            businessName: profile.business_name || "",
            businessType: profile.business_type || ""
          }));
        }
      }
    };
    checkUser();
  }, [navigate]);

  const adTypes = [
    { value: "keyword", label: "Keyword Advertising", price: "Kutoka TSh 50,000", desc: "Tangazo linaonekana kwenye search results" },
    { value: "banner", label: "Banner Ads (Home Page)", price: "Kutoka TSh 150,000", desc: "Tangazo kubwa kwenye ukurasa wa mwanzo" },
    { value: "top_ranking", label: "Top Ranking Products", price: "Kutoka TSh 100,000", desc: "Bidhaa yako inaonekana juu ya orodha" },
    { value: "category_spotlight", label: "Category Spotlight", price: "Kutoka TSh 80,000", desc: "Tangazo ndani ya kategoria maalum" },
    { value: "social_media", label: "Social Media Promotion", price: "Kutoka TSh 60,000", desc: "Tangazo kwenye Instagram, Facebook, Twitter" },
    { value: "whatsapp_broadcast", label: "WhatsApp Broadcast", price: "Kutoka TSh 40,000", desc: "Tangazo kwa wanachama wetu wa WhatsApp" }
  ];

  const businessTypes = [
    "Biashara Ndogo", "Biashara ya Kati", "Biashara Kubwa",
    "Mtengenezaji", "Muuzaji Jumla", "Muuzaji Rejareja", "Mtu Binafsi"
  ];

  const categories = [
    "Electronics", "Fashion", "Furniture", "Food & Beverages",
    "Construction", "Automotive", "Health & Beauty", "Agriculture", "Other"
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, productImages: files.map(f => f.name) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from('ad_requests')
      .insert([
        {
          user_id: user?.id,
          full_name: formData.fullName,
          phone_number: formData.phoneNumber,
          email: formData.email,
          business_name: formData.businessName,
          business_type: formData.businessType,
          ad_type: formData.adType,
          product_name: formData.productName,
          product_description: formData.productDescription,
          product_link: formData.productLink,
          target_category: formData.targetCategory,
          budget: parseInt(formData.budget),
          duration: parseInt(formData.duration),
          target_location: formData.targetLocation,
          target_audience: formData.targetAudience,
          special_requests: formData.specialRequests,
          hear_about_us: formData.hearAboutUs,
          status: 'pending',
          created_at: new Date()
        }
      ]);

    if (error) {
      console.error("Error:", error);
      alert("Kumekuwa na tatizo. Tafadhali jaribu tena.");
    } else {
      setSubmitted(true);
    }
    setLoading(false);
  };

  // ===== SUCCESS SCREEN =====
  if (submitted) {
    return (
      <div className="max-w-[600px] mx-auto px-5 py-12 sm:py-[60px] text-center font-sans">

        {/* Success Icon */}
        <div className="w-20 h-20 rounded-full bg-green-50 dark:bg-green-950/40 flex items-center justify-center mx-auto mb-5">
          <LucideIcons.CheckCircle size={50} className="text-green-600 dark:text-green-500" />
        </div>

        <h1 className="text-2xl sm:text-[28px] font-bold mb-4 text-gray-900 dark:text-white">
          Ombi Limetumwa!
        </h1>

        <p className="text-sm sm:text-base text-gray-500 dark:text-slate-400 mb-8">
          Asante {formData.fullName || user?.email}. Tumepokea ombi lako la tangazo.
        </p>

        {/* Summary Box */}
        <div className="bg-gray-50 dark:bg-slate-800 p-5 rounded-lg mb-8 text-left border border-gray-100 dark:border-slate-700">
          <p className="font-bold text-sm mb-2 text-gray-800 dark:text-white">📋 Muhtasari wa Ombi:</p>
          <p className="text-sm text-gray-700 dark:text-slate-300 my-1">✓ Aina ya Tangazo: {adTypes.find(t => t.value === formData.adType)?.label}</p>
          <p className="text-sm text-gray-700 dark:text-slate-300 my-1">✓ Bidhaa: {formData.productName}</p>
          <p className="text-sm text-gray-700 dark:text-slate-300 my-1">✓ Bajeti: TSh {parseInt(formData.budget).toLocaleString()}</p>
          <p className="text-sm text-gray-700 dark:text-slate-300 my-1">✓ Muda: {formData.duration} siku</p>
        </div>

        <p className="text-xs sm:text-sm text-gray-400 dark:text-slate-500 mb-5">
          Tutakujiana ndani ya saa 24 kwa maelezo zaidi kupitia {formData.phoneNumber} au {formData.email}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="bg-[#ff6a00] hover:bg-[#e55a00] text-white px-8 py-3 rounded-lg no-underline inline-block font-semibold text-sm transition-colors"
          >
            Rudi Nyumbani
          </Link>
          <Link
            to="/ads/my-requests"
            className="bg-transparent border border-[#ff6a00] text-[#ff6a00] hover:bg-orange-50 dark:hover:bg-orange-950/30 px-8 py-3 rounded-lg no-underline inline-block font-semibold text-sm transition-colors"
          >
            Tazama Maombi Yangu
          </Link>
        </div>
      </div>
    );
  }

  // ===== MAIN FORM =====
  return (
    <div className="max-w-[1000px] mx-auto px-4 sm:px-5 py-6 sm:py-10 font-sans dark:bg-slate-900">

      {/* Header */}
      <h1 className="text-2xl sm:text-[32px] font-bold mb-2.5 text-gray-900 dark:text-white flex items-center gap-2">
        <LucideIcons.Megaphone size={28} className="text-[#ff6a00]" />
        Ombi la Tangazo
      </h1>
      <p className="text-sm sm:text-base text-gray-500 dark:text-slate-400 mb-8">
        Jaza fomu hii kwa undani. Tutakujiana na bei kamili na maelekezo ya malipo.
      </p>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-xl">

        {/* ===== SECTION 1: TAARIFA ZAKO ===== */}
        <div className="mb-7 border border-gray-100 dark:border-slate-700 rounded-xl overflow-hidden">
          <div className="bg-gray-50 dark:bg-slate-900 px-4 sm:px-5 py-4 border-b border-gray-100 dark:border-slate-700">
            <h3 className="font-semibold text-sm sm:text-base flex items-center gap-2.5 text-gray-800 dark:text-white">
              <LucideIcons.User size={18} className="text-[#ff6a00]" /> Taarifa Zako (Mtangazaji)
            </h3>
          </div>
          <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <label className="block mb-1.5 font-medium text-sm text-gray-700 dark:text-slate-300">Jina Kamili *</label>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-3 py-3 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block mb-1.5 font-medium text-sm text-gray-700 dark:text-slate-300">Namba ya Simu *</label>
              <input
                type="tel"
                name="phoneNumber"
                required
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="07XX XXX XXX"
                className="w-full px-3 py-3 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block mb-1.5 font-medium text-sm text-gray-700 dark:text-slate-300">Barua Pepe *</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-3 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block mb-1.5 font-medium text-sm text-gray-700 dark:text-slate-300">Jina la Biashara</label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                placeholder="Mfano: Skyfall Enterprises"
                className="w-full px-3 py-3 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block mb-1.5 font-medium text-sm text-gray-700 dark:text-slate-300">Aina ya Biashara</label>
              <select
                name="businessType"
                value={formData.businessType}
                onChange={handleChange}
                className="w-full px-3 py-3 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Chagua...</option>
                {businessTypes.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* ===== SECTION 2: TAARIFA ZA TANGAZO ===== */}
        <div className="mb-7 border border-gray-100 dark:border-slate-700 rounded-xl overflow-hidden">
          <div className="bg-gray-50 dark:bg-slate-900 px-4 sm:px-5 py-4 border-b border-gray-100 dark:border-slate-700">
            <h3 className="font-semibold text-sm sm:text-base flex items-center gap-2.5 text-gray-800 dark:text-white">
              <LucideIcons.Megaphone size={18} className="text-[#ff6a00]" /> Taarifa za Tangazo
            </h3>
          </div>
          <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <label className="block mb-1.5 font-medium text-sm text-gray-700 dark:text-slate-300">Aina ya Tangazo *</label>
              <select
                name="adType"
                value={formData.adType}
                onChange={handleChange}
                className="w-full px-3 py-3 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {adTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label} - {type.price}</option>
                ))}
              </select>
              <small className="text-xs text-gray-500 dark:text-slate-400 mt-1 block">
                {adTypes.find(t => t.value === formData.adType)?.desc}
              </small>
            </div>

            <div>
              <label className="block mb-1.5 font-medium text-sm text-gray-700 dark:text-slate-300">Kategoria ya Bidhaa</label>
              <select
                name="targetCategory"
                value={formData.targetCategory}
                onChange={handleChange}
                className="w-full px-3 py-3 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Chagua kategoria...</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block mb-1.5 font-medium text-sm text-gray-700 dark:text-slate-300">Jina la Bidhaa / Huduma *</label>
              <input
                type="text"
                name="productName"
                required
                value={formData.productName}
                onChange={handleChange}
                placeholder="Mfano: Simu za Samsung, Vifaa vya ujenzi..."
                className="w-full px-3 py-3 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block mb-1.5 font-medium text-sm text-gray-700 dark:text-slate-300">Maelezo ya Bidhaa</label>
              <textarea
                name="productDescription"
                rows="3"
                value={formData.productDescription}
                onChange={handleChange}
                placeholder="Eleza kwa undani bidhaa unayotaka kutangaza..."
                className="w-full px-3 py-3 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-y"
              />
            </div>

            <div>
              <label className="block mb-1.5 font-medium text-sm text-gray-700 dark:text-slate-300">Link ya Bidhaa</label>
              <input
                type="url"
                name="productLink"
                value={formData.productLink}
                onChange={handleChange}
                placeholder="https://skyfall.com/product/..."
                className="w-full px-3 py-3 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block mb-1.5 font-medium text-sm text-gray-700 dark:text-slate-300">Picha za Bidhaa</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="w-full px-3 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white file:mr-2 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-orange-500 file:text-white file:text-xs file:font-semibold file:cursor-pointer hover:file:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <small className="text-xs text-gray-500 dark:text-slate-400 mt-1 block">
                Unaweza kupakia picha 5 (JPEG, PNG)
              </small>
            </div>
          </div>
        </div>

        {/* ===== SECTION 3: BAJETI NA MUDA ===== */}
        <div className="mb-7 border border-gray-100 dark:border-slate-700 rounded-xl overflow-hidden">
          <div className="bg-gray-50 dark:bg-slate-900 px-4 sm:px-5 py-4 border-b border-gray-100 dark:border-slate-700">
            <h3 className="font-semibold text-sm sm:text-base flex items-center gap-2.5 text-gray-800 dark:text-white">
              <LucideIcons.CreditCard size={18} className="text-[#ff6a00]" /> Bajeti na Muda
            </h3>
          </div>
          <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <label className="block mb-1.5 font-medium text-sm text-gray-700 dark:text-slate-300">Bajeti Yako (TSh) *</label>
              <input
                type="number"
                name="budget"
                required
                value={formData.budget}
                onChange={handleChange}
                placeholder="Mfano: 100000"
                className="w-full px-3 py-3 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block mb-1.5 font-medium text-sm text-gray-700 dark:text-slate-300">Muda wa Tangazo (Siku) *</label>
              <select
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full px-3 py-3 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="7">Siku 7</option>
                <option value="14">Siku 14</option>
                <option value="30">Siku 30</option>
                <option value="60">Siku 60</option>
                <option value="90">Siku 90</option>
              </select>
            </div>

            <div>
              <label className="block mb-1.5 font-medium text-sm text-gray-700 dark:text-slate-300">Eneo Lengwa</label>
              <select
                name="targetLocation"
                value={formData.targetLocation}
                onChange={handleChange}
                className="w-full px-3 py-3 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="Tanzania">Tanzania Nzima</option>
                <option value="Dar es Salaam">Dar es Salaam</option>
                <option value="Arusha">Arusha</option>
                <option value="Mwanza">Mwanza</option>
                <option value="Mbeya">Mbeya</option>
                <option value="Zanzibar">Zanzibar</option>
              </select>
            </div>

            <div>
              <label className="block mb-1.5 font-medium text-sm text-gray-700 dark:text-slate-300">Wateja Lengwa</label>
              <input
                type="text"
                name="targetAudience"
                value={formData.targetAudience}
                onChange={handleChange}
                placeholder="Mfano: Wauzaji jumla, Wanunuzi wa simu..."
                className="w-full px-3 py-3 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
        </div>

        {/* ===== SECTION 4: MAELEZO YA ZIADA ===== */}
        <div className="mb-7 border border-gray-100 dark:border-slate-700 rounded-xl overflow-hidden">
          <div className="bg-gray-50 dark:bg-slate-900 px-4 sm:px-5 py-4 border-b border-gray-100 dark:border-slate-700">
            <h3 className="font-semibold text-sm sm:text-base flex items-center gap-2.5 text-gray-800 dark:text-white">
              <LucideIcons.Edit3 size={18} className="text-[#ff6a00]" /> Maelezo ya Ziada
            </h3>
          </div>
          <div className="p-4 sm:p-5">
            <div className="mb-4">
              <label className="block mb-1.5 font-medium text-sm text-gray-700 dark:text-slate-300">Maombi Maalum</label>
              <textarea
                name="specialRequests"
                rows="3"
                value={formData.specialRequests}
                onChange={handleChange}
                placeholder="Mfano: Nataka tangazo lionekane weekends tu, au nimpe muundo maalum..."
                className="w-full px-3 py-3 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-y"
              />
            </div>
            <div>
              <label className="block mb-1.5 font-medium text-sm text-gray-700 dark:text-slate-300">Umetupataje?</label>
              <select
                name="hearAboutUs"
                value={formData.hearAboutUs}
                onChange={handleChange}
                className="w-full px-3 py-3 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Chagua...</option>
                <option value="facebook">Facebook</option>
                <option value="instagram">Instagram</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="friend">Rafiki / Mteja</option>
                <option value="google">Google Search</option>
                <option value="other">Nyingine</option>
              </select>
            </div>
          </div>
        </div>

        {/* ===== BUTTONS ===== */}
        <div className="flex flex-col sm:flex-row gap-4 mt-5">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#ff6a00] hover:bg-[#e55a00] text-white px-8 py-3.5 rounded-lg border-none cursor-pointer font-semibold flex-1 disabled:opacity-60 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
          >
            {loading ? "Inatuma..." : "Tuma Ombi la Tangazo"}
          </button>
          <Link
            to="/"
            className="bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-800 dark:text-white px-8 py-3.5 rounded-lg no-underline text-center font-medium flex-none sm:flex-[0.3] transition-colors text-sm sm:text-base"
          >
            Ghairi
          </Link>
        </div>
      </form>
    </div>
  );
}