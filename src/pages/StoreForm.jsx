import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axiosConfig"; // ✅ Tumia api
//import "../StoreForm.css";

const StoreForm = ({
  storeType,
  formData,
  handleChange,
  setStoreType,
  isLoading,
  setIsLoading,
  setIsSuccess,
}) => {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [dbCategories, setDbCategories] = useState([]);
  const [dbSubCategories, setDbSubCategories] = useState([]);
  const [filteredSubs, setFilteredSubs] = useState([]);

  const [previews, setPreviews] = useState({
    image1: null, image2: null, image3: null, logo: null, banner: null,
  });

  const nextStep = () => {
    setError(""); 

    if (step === 1) {
      const nameValid = formData.name && formData.name.trim() !== "";
      const phoneValid = formData.phone && formData.phone.trim() !== "";
      const catValid = formData.category_id || formData.category;
      const subCatValid = formData.sub_category_ids && formData.sub_category_ids.length > 0;

      if (!nameValid || !phoneValid || !catValid || !subCatValid) {
       setError("Please fill in: Name, Phone, Category, and all Sub-categories.");
        return;
      }
      setStep(2);
      return;
    }

    if (step === 2) {
      if (!formData.city || !formData.location) {
        setError("City and Address are required.");
        return;
      }
      if (!formData.description || formData.description.length < 10) {
        setError("Store description is too short (Enter at least 10 characters).");
        return;
      }
      setStep(3);
      return;
    }

    if (step === 3) {
      if (!formData.tin_number) {
       setError("Please fill in the business TIN number.");
        return;
      }
      if (!formData.tin_image) {
        setError("Please upload the TIN certificate photo.");
        return;
      }
      setStep(4);
      return;
    }
  };

  const prevStep = () => setStep(step - 1);

  const handleFileChange = (e, key) => {
    const file = e.target.files[0];
    if (file) {
      setPreviews((prev) => ({ ...prev, [key]: URL.createObjectURL(file) }));
      handleChange({
        target: { name: key, value: e.target.files },
      });
    }
  };

  const createSlug = (text) => {
    if (!text) return "";
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catsRes = await api.get("/categories/");
        const subsRes = await api.get("/subcategories/");
        
        setDbCategories(catsRes.data.results || catsRes.data);
        setDbSubCategories(subsRes.data.results || subsRes.data);
      } catch (error) {
        console.error("Hitilafu kupakia kategoria:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (formData.category_id) {
      const filtered = dbSubCategories.filter(
        (sub) => sub.category === formData.category_id
      );
      setFilteredSubs(filtered);
    } else {
      setFilteredSubs([]);
    }
  }, [formData.category_id, dbSubCategories]);

const handleSubmitInternal = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setError("Please login first!");
        setIsLoading(false);
        return;
      }

      // ============================================
      // 1. UNDA FORM DATA
      // ============================================
      const formDataObj = new FormData();

      formDataObj.append("store_name", formData.name);
      formDataObj.append("store_slug", createSlug(formData.name));
      formDataObj.append("business_type", formData.business_type);
      if (formData.category_id) {
        formDataObj.append("category", formData.category_id);
      }
      formDataObj.append("sub_category_ids", JSON.stringify(formData.sub_category_ids || []));
      formDataObj.append("specialist_tags", JSON.stringify(formData.specialist_tags || []));
      formDataObj.append("description", formData.description);
      formDataObj.append("physical_address", formData.location);
      formDataObj.append("city", formData.city || "Dar es Salaam");
      formDataObj.append("phone_number", formData.phone);
      formDataObj.append("email", formData.email || ""); 
      formDataObj.append("tin_number", formData.tin_number);
      if (formData.maps_link && formData.maps_link.trim() !== "") {
        formDataObj.append("google_maps_url", formData.maps_link);
      }
      formDataObj.append("moq", formData.moq);
      formDataObj.append("lead_time", formData.lead_time);
      formDataObj.append("supply_capacity", formData.supply_capacity);
      formDataObj.append("packaging_type", formData.packaging_type);
      formDataObj.append("whatsapp_number", formData.whatsapp || formData.phone);
      formDataObj.append("instagram_handle", formData.instagram || "");
      formDataObj.append("tiktok_handle", formData.tiktok || "");
      formDataObj.append("twitter_handle", formData.twitter || "");
      if (formData.youtube && formData.youtube.trim() !== "") {
        formDataObj.append("youtube_link", formData.youtube);
      }
      formDataObj.append("experience", formData.experience || "");
      formDataObj.append("staff_count", formData.staff_count || "");
      formDataObj.append("store_type", storeType);
      formDataObj.append("agreed_to_terms", formData.agreed_to_terms ? "true" : "false");

      // 🔥 MUHIMU SANA: Weka pending ili iende ukurasa wa kusubiri!
      formDataObj.append("status", "pending");
      formDataObj.append("verification_status", "pending");

      if (formData.logo) formDataObj.append("store_logo", formData.logo[0]);
      if (formData.banner) formDataObj.append("store_banner", formData.banner[0]);
      if (formData.tin_image) formDataObj.append("tin_image", formData.tin_image[0]);

      // 🔥 BADILISHA HAPA: Tumia 'office_images' kama list
      const officeImages = [formData.image1, formData.image2, formData.image3].filter(Boolean);
         officeImages.forEach((file) => {
           if (file && file[0]) {
         formDataObj.append("office_images", file[0]);
          }
           });

      // ============================================
      // 2. TENGENEZA STORE
      // ============================================
      const response = await api.post(
        "/stores/",
        formDataObj,
        { headers: { "Authorization": `Bearer ${token}` } }
      );

      console.log("✅ Store imeundwa:", response.data);

      // ============================================
      // 3. 🔥 BADILISHA ROLE YA USER KUWA SUPPLIER
      // ============================================
      try {
        const roleResponse = await api.patch(
          "/profile/",
          { role: "supplier" },
          { headers: { "Authorization": `Bearer ${token}` } }
        );
        console.log("✅ Role imebadilishwa kuwa supplier!", roleResponse.data);
      } catch (roleError) {
        console.warn("⚠️ Imeshindwa kubadilisha role, lakini duka limeundwa:", roleError);
        console.warn("Tafadhali badilisha role manually kwenye database.");
        // Tunaendelea hata kama role haijabadilika
      }

      // ============================================
      // 4. ONYESHA SUCCESS NA REDIRECT
      // ============================================
      setIsSuccess(true);
      if (response.data && response.data.id) {
        // 🔥 BADILISHA HAPA: Enda kwenye ukurasa wa kusubiri badala ya Dashboard!
        setTimeout(() => {
          navigate(`/store-pending/${response.data.id}`, { replace: true });
        }, 2000);
      }

    } catch (err) {
      // ============================================
      // 5. ERROR HANDLING
      // ============================================
      console.error("❌ Critical Error:", err);
      console.log("SERVER RESPONSE DATA (Error details):", err.response?.data);
      console.log("HTTP STATUS:", err.response?.status);

      let errorMsg = "Hitilafu isiyojulikana.";

      if (err.response?.data) {
        const data = err.response.data;
        if (typeof data === 'object') {
          // Kama data ni object, chukua ujumbe wa kwanza
          const firstKey = Object.keys(data)[0];
          if (firstKey && Array.isArray(data[firstKey])) {
            errorMsg = `${firstKey}: ${data[firstKey][0]}`;
          } else if (data.detail) {
            errorMsg = data.detail;
          } else if (data.message) {
            errorMsg = data.message;
          } else {
            errorMsg = JSON.stringify(data);
          }
        } else {
          errorMsg = data;
        }
      } else if (err.message) {
        errorMsg = err.message;
      }

      setError(errorMsg);
      setStep(1); // Rudisha kwenye hatua ya kwanza
    } finally {
      setIsLoading(false);
    }
  };
  
 // ===== SHARED STYLES =====
  const inputClass = "w-full px-3.5 py-3 bg-[#1a1a1a] border border-white/10 rounded-xl text-white text-sm placeholder:text-gray-500 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all disabled:opacity-60";
  const labelClass = "block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2";
  const selectClass = "w-full px-3 py-3 bg-[#1a1a1a] border border-white/10 rounded-xl text-white text-sm outline-none focus:border-orange-500 appearance-none cursor-pointer";

  return (
    <div className="flex flex-col md:flex-row bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] dark:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.6)] min-h-[600px]">

      {/* ===== SIDEBAR ===== */}
      <div className="w-full md:w-[35%] bg-gray-900 p-5 md:p-8 lg:p-12 text-white flex flex-col">
        <button
          type="button"
          onClick={step === 1 ? () => setStoreType(null) : prevStep}
          className="bg-transparent border-none text-gray-400 hover:text-orange-500 cursor-pointer font-semibold mb-8 md:mb-[100px] transition-colors text-left text-sm"
        >
          {step === 1 ? "← Cancel" : "← Back"}
        </button>

        <div className="mt-8">
          <span className="text-orange-500 font-extrabold text-xs tracking-[2px]">
            STEP {step} / 4
          </span>
          <h2 className="text-xl md:text-2xl font-bold mt-2 text-white">
            {step === 1 && "Store Information"}
            {step === 2 && "Details & Services"}
            {step === 3 && "Branding & Photos"}
            {step === 4 && "Social Media"}
          </h2>
          <p className="text-gray-400 mt-2 text-sm leading-relaxed">
            {step === 1 && "Start with your store's main identity."}
            {step === 2 && "Tell us what your store is about and where customers can find you."}
            {step === 3 && "Upload your Logo, Banner, and office photos."}
            {step === 4 && "Add social media so customers can see your work."}
          </p>
        </div>
      </div>

      {/* ===== FORM CONTENT ===== */}
      <div className="w-full md:w-[65%] p-5 md:p-8 lg:p-12 bg-white dark:bg-slate-900">
        <form onSubmit={handleSubmitInternal} className="flex flex-col gap-5">

          {/* ============================================================ */}
          {/* STEP 1: STORE INFORMATION */}
          {/* ============================================================ */}
          {step === 1 && (
            <div className="animate-[fadeIn_0.4s_ease-in-out]">

              {/* Business Type + Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Aina ya Biashara (Business Type)</label>
                  <select
                    name="business_type"
                    value={formData.business_type || ""}
                    onChange={handleChange}
                    required
                    className={selectClass}
                  >
                    <option value="">Chagua Aina / Choose Type...</option>
                    <option value="Wholesaler">Wholesaler (Muuza Jumla)</option>
                    <option value="Retailer">Retailer (Muuza Reja reja)</option>
                    <option value="Wholesale & Retail">Wholesale & Retail (Jumla na Reja reja)</option>
                    <option value="Manufacturer">Manufacturer (Kiwanda / Mtengenezaji)</option>
                    <option value="Service Provider">Service Provider (Mtoa Huduma)</option>
                  </select>
                  <p className="text-xs italic text-gray-500 mt-1.5">* Choose the type that best describes your business.</p>
                </div>

                <div>
                  <label className={labelClass}>Category (Kategoria Kuu)</label>
                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                    required
                    className={selectClass}
                  >
                    <option value="">Select Category..</option>
                    {dbCategories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  {formData.category_id && (
                    <div className="mt-3 p-3 bg-orange-500/5 border border-orange-500/20 rounded-lg">
                      <p className="text-[10px] uppercase font-bold text-gray-400 m-0 mb-1">About this category:</p>
                      <p className="text-xs italic text-orange-500 m-0">
                        {dbCategories.find(c => c.id === formData.category_id)?.description || "Loading description..."}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Sub-categories */}
              {formData.category_id && (
                <div className="mt-5">
                  <label className={labelClass}>Bobezi (Sub-categories)</label>
                  <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-3 mt-2.5 max-h-[200px] overflow-y-auto p-3 bg-white/5 border border-white/10 rounded-lg">
                    {filteredSubs.map((sub) => (
                      <label key={sub.id} className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity">
                        <input
                          type="checkbox"
                          className="w-[18px] h-[18px] cursor-pointer accent-orange-500"
                          checked={formData.sub_category_ids?.includes(sub.id)}
                          onChange={(e) => {
                            const { checked } = e.target;
                            const currentSubs = formData.sub_category_ids || [];
                            const updatedSubs = checked
                              ? [...currentSubs, sub.id]
                              : currentSubs.filter(id => id !== sub.id);
                            handleChange({ target: { name: 'sub_category_ids', value: updatedSubs } });
                          }}
                        />
                        <span className="text-sm text-gray-300">{sub.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Specialist Tags */}
              <div className="mt-6">
                <label className={labelClass}>Expertise Tags (Type then press Enter)</label>
                <div className="flex flex-wrap gap-2 mb-2.5">
                  {(formData.specialist_tags || []).map((tag, index) => (
                    <span key={index} className="bg-[#ff6600] text-white px-3 py-1 rounded-full text-xs flex items-center gap-2 animate-[fadeIn_0.3s_ease]">
                      {tag}
                      <button
                        type="button"
                        onClick={() => {
                          const newTags = formData.specialist_tags.filter((_, i) => i !== index);
                          handleChange({ target: { name: 'specialist_tags', value: newTags } });
                        }}
                        className="bg-transparent border-none text-white text-base cursor-pointer font-bold leading-none"
                      >×</button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Mfano: Jeans Expert, iPhone Specialist..."
                  className={inputClass}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const val = e.target.value.trim();
                      if (val) {
                        const currentTags = formData.specialist_tags || [];
                        if (!currentTags.includes(val)) {
                          handleChange({ target: { name: 'specialist_tags', value: [...currentTags, val] } });
                        }
                        e.target.value = '';
                      }
                    }
                  }}
                />
              </div>

              {/* Store Name */}
              <div className="mt-5 pt-4 border-t border-white/10">
                <label className={labelClass}>Store Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Ali Mobile Shop"
                  className={inputClass}
                />
              </div>

              {/* Phone + Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                <div>
                  <label className={labelClass}>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="07xxxxxxxx"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ""}
                    onChange={handleChange}
                    placeholder="biashara@mfano.com"
                    className={inputClass}
                  />
                </div>
              </div>

              {error && (
                <div className="mt-5 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                  <div className="flex items-center gap-2 text-red-500 text-sm">
                    <span>⚠️</span> {error}
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={nextStep}
                className="w-full mt-6 py-4 bg-[#ff6a00] hover:bg-[#e55a00] text-white rounded-xl font-bold text-base cursor-pointer transition-all hover:-translate-y-0.5 shadow-[0_10px_25px_-5px_rgba(255,106,0,0.4)] active:scale-[0.98]"
              >
                Continue to Step 2
              </button>
            </div>
          )}

          {/* ============================================================ */}
          {/* STEP 2: DETAILS & SERVICES */}
          {/* ============================================================ */}
          {step === 2 && (
            <div className="animate-[fadeIn_0.4s_ease-in-out]">

              {/* Location Section */}
              <div className="mb-5">
                <h3 className="text-base font-bold text-gray-800 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-slate-700"></h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">City</label>
                    <div className="relative">
                      <select
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-3 bg-[#1a1a1a] border border-white/10 rounded-xl text-white text-sm outline-none focus:border-orange-500 appearance-none cursor-pointer"
                      >
                        <option value="">Select City...</option>
                        <option value="Dar es Salaam">Dar es Salaam</option>
                        <option value="Arusha">Arusha</option>
                        <option value="Mwanza">Mwanza</option>
                        <option value="Dodoma">Dodoma</option>
                        <option value="Kahama">Kahama</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-xs">▼</div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Address (Street/Building)</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Msimbazi, Kariakoo"
                      required
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              {/* Operations Section */}
              <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-2xl">
                <h3 className="text-sm font-bold text-orange-500 mb-4">⚙️ Operations & Supply Capacity</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  {/* MOQ */}
                  <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                    <label className="flex items-center gap-2 text-xs font-bold text-gray-300 mb-2">📦 Minimum Order Quantity (MOQ)</label>
                    <input
                      type="text"
                      name="moq"
                      value={formData.moq}
                      onChange={handleChange}
                      placeholder="Mfano: 10 PC"
                      className={`${inputClass} mb-3`}
                      required={formData.business_type === "Wholesaler (Jumla)"}
                    />
                    <div className="flex flex-wrap gap-2">
                      {["1 PC", "10 PC", "1 Katoni", "Dazeni 1", "Pipa 1"].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => handleChange({ target: { name: 'moq', value: option } })}
                          className={`px-3 py-1 rounded-full text-[11px] font-medium border transition-all ${
                            formData.moq === option
                              ? 'bg-orange-500 text-black border-orange-500 shadow-[0_4px_12px_rgba(249,115,22,0.2)]'
                              : 'bg-white/5 text-gray-400 border-white/10 hover:border-orange-500 hover:text-orange-500 hover:-translate-y-0.5'
                          }`}
                        >
                          + {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Lead Time */}
                  <div>
                    <label className={labelClass}>Order Preparation Time (Lead Time)</label>
                    <select name="lead_time" value={formData.lead_time} onChange={handleChange} className={selectClass}>
                      <option value="">Select time...</option>
                      <option value="Saa 24">Under 24 hours</option>
                      <option value="Siku 1-3">1 - 3 Days</option>
                      <option value="Siku 3-7">3 - 7 Days</option>
                      <option value="Siku 7+">More than 7 days</option>
                    </select>
                  </div>

                  {/* Supply Capacity */}
                  <div>
                    <label className={labelClass}>Monthly Supply Capacity</label>
                    <input type="text" name="supply_capacity" value={formData.supply_capacity} onChange={handleChange} placeholder="Example: 5,000 pcs" className={inputClass} />
                  </div>

                  {/* Packaging */}
                  <div>
                    <label className={labelClass}>Packaging Type</label>
                    <input type="text" name="packaging_type" value={formData.packaging_type} onChange={handleChange} placeholder="Example: Nylon bags, Boxes" className={inputClass} />
                  </div>

                  {/* Experience */}
                  <div>
                    <label className={labelClass}>Years of Experience</label>
                    <input type="text" name="experience" value={formData.experience || ""} onChange={handleChange} placeholder="Example: 5 years" className={inputClass} />
                  </div>

                  {/* Staff Count */}
                  <div>
                    <label className={labelClass}>Number of Employees (Staff Count)</label>
                    <input type="number" name="staff_count" value={formData.staff_count || ""} onChange={handleChange} placeholder="Example: 10" className={inputClass} />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mt-4">
                <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">
                  <span className="text-orange-500">📝</span> Service/Product Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Example: We are experts in electronics..."
                  required
                  className="w-full min-h-[120px] px-4 py-3 bg-[#1a1a1a] border border-orange-500/20 rounded-xl text-white text-sm placeholder:text-gray-500 outline-none resize-none focus:border-orange-500 focus:bg-[#0f0f0f] transition-all"
                />
                <div className="text-right mt-1.5">
                  <span className="text-xs text-gray-500">This description will appear on your profile</span>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-5 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex-1 py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-bold text-sm cursor-pointer transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => { console.log("Data ya sasa:", formData); nextStep(); }}
                  className="flex-1 py-4 bg-[#ff6a00] hover:bg-[#e55a00] text-white rounded-xl font-bold text-sm cursor-pointer transition-all hover:-translate-y-0.5 shadow-[0_10px_25px_-5px_rgba(255,106,0,0.4)]"
                >
                  Continue to Photos
                </button>
              </div>

              {error && (
                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                  <div className="flex items-center gap-2 text-red-500 text-sm">
                    <span>⚠️</span> {error}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* STEP 3: BRANDING & PHOTOS */}
          {/* ============================================================ */}
          {step === 3 && (
            <div className="animate-[fadeIn_0.4s_ease-in-out]">

              {/* TIN Verification */}
              <div className="p-4 bg-white/5 border border-white/10 rounded-xl mb-4">
                <h3 className="flex items-center gap-2 text-sm font-bold text-orange-500 mb-4">
                  🛡️ Business Verification
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>TIN Number</label>
                    <input type="text" name="tin_number" value={formData.tin_number || ""} onChange={handleChange} placeholder="Example: 123-456-789" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>TIN Certificate / License Photo</label>
                    <input
                      type="file"
                      onChange={(e) => handleFileChange(e, "tin_image")}
                      accept="image/*"
                      className="w-full text-xs text-gray-400 bg-white/5 p-1.5 rounded-md file:mr-2 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-orange-500 file:text-white file:text-xs file:font-semibold file:cursor-pointer hover:file:bg-orange-600"
                    />
                    {previews.tin_image && (
                      <div className="mt-2 relative inline-block">
                        <img src={previews.tin_image} alt="TIN Preview" className="max-h-[120px] rounded-lg border border-orange-500" />
                        <button
                          onClick={() => setPreviews(p => ({ ...p, tin_image: null }))}
                          className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold cursor-pointer shadow-md"
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Location Verification */}
              <div className="p-4 bg-white/5 border border-white/10 rounded-xl mb-4">
                <h3 className="flex items-center gap-2 text-sm font-bold text-blue-400 mb-4">
                  📍 Location (Google Maps)
                </h3>
                <div>
                  <label className={labelClass}>Google Maps Link (URL)</label>
                  <input type="url" name="maps_link" value={formData.maps_link || ""} onChange={handleChange} placeholder="https://goo.gl/maps/..." className={inputClass} />
                  <p className="text-xs italic text-gray-500 mt-1.5">
                    Go to Google Maps, find your store, click "Share", and copy the link here.
                  </p>
                </div>
              </div>

              {/* Branding Uploads */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Store Logo (Square)</label>
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e, "logo")}
                    accept="image/*"
                    className="w-full text-xs text-gray-400 bg-white/5 p-1.5 rounded-md file:mr-2 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-orange-500 file:text-white file:text-xs file:font-semibold file:cursor-pointer hover:file:bg-orange-600"
                  />
                </div>
                <div>
                  <label className={labelClass}>Store Banner (Landscape)</label>
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e, "banner")}
                    accept="image/*"
                    className="w-full text-xs text-gray-400 bg-white/5 p-1.5 rounded-md file:mr-2 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-orange-500 file:text-white file:text-xs file:font-semibold file:cursor-pointer hover:file:bg-orange-600"
                  />
                </div>
              </div>

              {/* Office Photos */}
              <div className="mt-4">
                <label className="block text-sm mb-4 text-gray-400 font-bold">Store/Office Appearance Photos (3 Photos)</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3.5 my-5">
                  {[1, 2, 3].map((i) => (
                    <div key={i}>
                      <input type="file" id={`img${i}`} hidden onChange={(e) => handleFileChange(e, `image${i}`)} accept="image/*" />
                      <label
                        htmlFor={`img${i}`}
                        className={`w-full aspect-square border-2 border-dashed rounded-xl flex items-center justify-center cursor-pointer overflow-hidden relative transition-all hover:border-[#6366f1] hover:bg-white/10 ${
                          previews[`image${i}`] ? 'border-solid border-[#6366f1]' : 'border-gray-500 bg-white/5'
                        }`}
                      >
                        {previews[`image${i}`] ? (
                          <img src={previews[`image${i}`]} alt="Preview" className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
                        ) : (
                          <span className="text-xs text-gray-400 font-medium text-center p-1">📸 Photo {i}</span>
                        )}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex-1 py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-bold text-sm cursor-pointer transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex-1 py-4 bg-[#ff6a00] hover:bg-[#e55a00] text-white rounded-xl font-bold text-sm cursor-pointer transition-all hover:-translate-y-0.5 shadow-[0_10px_25px_-5px_rgba(255,106,0,0.4)]"
                >
                  Last Step
                </button>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* STEP 4: SOCIAL MEDIA */}
          {/* ============================================================ */}
          {step === 4 && (
            <div className="animate-[fadeIn_0.4s_ease-in-out]">

              <h3 className="text-sm font-bold text-orange-500 mb-4 pb-2 border-b border-orange-500/20">
                🌐 Social Media & Communication
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>WhatsApp Number</label>
                  <input type="tel" name="whatsapp" value={formData.whatsapp || ""} onChange={handleChange} placeholder="07xxxxxxxx" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Instagram Handle</label>
                  <input type="text" name="instagram" value={formData.instagram || ""} onChange={handleChange} placeholder="@jina_la_duka" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>TikTok Username</label>
                  <input type="text" name="tiktok" value={formData.tiktok || ""} onChange={handleChange} placeholder="@duka_tiktok" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>X (Twitter) Handle</label>
                  <input type="text" name="twitter" value={formData.twitter || ""} onChange={handleChange} placeholder="@jina_la_x" className={inputClass} />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>YouTube Channel Link</label>
                  <input type="url" name="youtube" value={formData.youtube || ""} onChange={handleChange} placeholder="https://youtube.com/@channel_yako" className={inputClass} />
                </div>
              </div>

              {/* Terms */}
              <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/10">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.agreed_to_terms || false}
                    onChange={(e) => handleChange({ target: { name: 'agreed_to_terms', value: e.target.checked } })}
                    required
                    className="w-[18px] h-[18px] accent-orange-500 mt-0.5 flex-shrink-0 cursor-pointer"
                  />
                  <span className="text-xs text-gray-500 leading-relaxed">
                    I confirm that all information provided is true. I understand that my account can be suspended if I violate business rules and fraud.
                  </span>
                </label>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-4 pt-4">
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex-1 py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-bold text-sm cursor-pointer transition-colors"
                >
                  Nyuma
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-bold text-sm cursor-pointer transition-all hover:-translate-y-0.5 shadow-[0_10px_25px_-5px_rgba(255,106,0,0.4)] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Store...
                    </>
                  ) : ("🚀 Complete and Open Store")}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default StoreForm;