import React, { useState, useEffect } from "react"; // TUMEONGEZA useEffect HAPAimport { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

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
  
  // State kwa ajili ya Data kutoka Database
  const [dbCategories, setDbCategories] = useState([]);
  const [dbSubCategories, setDbSubCategories] = useState([]);
  const [filteredSubs, setFilteredSubs] = useState([]);
  
  const [previews, setPreviews] = useState({
    image1: null, image2: null, image3: null, logo: null, banner: null,
  });


const nextStep = () => {
  setError(""); // 1. Futa makosa ya zamani ili ujumbe mpya uonekane

  if (step === 1) {
    // 2. Kagua kwa umakini
    const nameValid = formData.name && formData.name.trim() !== "";
    const phoneValid = formData.phone && formData.phone.trim() !== "";
    const catValid = formData.category_id || formData.category;
    const subCatValid = formData.sub_category_ids && formData.sub_category_ids.length > 0;

    if (!nameValid || !phoneValid || !catValid || !subCatValid) {
      setError("Tafadhali jaza: Jina, Simu, Kategoria na Bobezi zote.");
      return; // 3. Zuia isiende mbele
    }
  }

  if (step === 2) {
    if (!formData.city || !formData.location) {
      setError("Mji na Anwani ni lazima.");
      return;
    }
    // Hapa ndipo wengi wanakwama:
    if (!formData.description || formData.description.length < 10) {
      setError("Maelezo ya duka ni mafupi mno (Weka angalau herufi 10).");
      return;
    }
  }


  if (step === 3) {
  if (!formData.tin_number) {
    setError("Tafadhali jaza namba ya TIN ya biashara.");
    return;
  }
  if (!formData.tin_image) {
    setError("Tafadhali pakia picha ya cheti cha TIN.");
    return;
  }
  setStep(step + 1);
}


  setStep(step + 1);
};

const prevStep = () => setStep(step - 1);

  const handleFileChange = (e, key) => {
    const file = e.target.files[0]; // Tunachukua file la kwanza
    if (file) {
      // 1. Huu ni muonekano wa picha (Preview)
      setPreviews((prev) => ({ ...prev, [key]: URL.createObjectURL(file) }));

      // 2. Hapa tunatuma file halisi kwenye formData ili handleSubmit ilipate
      handleChange({
        target: {
          name: key,
          value: e.target.files, // Tunatuma FileList nzima
        },
      });
    }
  };

  const createSlug = (text) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-");
  };


  // --- LOGIC YA KUVUTA DATA (FETCHING) ---
  useEffect(() => {
    const fetchData = async () => {
      const { data: cats } = await supabase.from("categories").select("*");
      const { data: subs } = await supabase.from("sub_categories").select("*");
      if (cats) setDbCategories(cats);
      if (subs) setDbSubCategories(subs);
    };
    fetchData();
  }, []);

  // Filter sub-categories wakati category_id inapobadilika
  useEffect(() => {
    if (formData.category_id) {
      const filtered = dbSubCategories.filter(
        (sub) => sub.category_id === formData.category_id
      );
      setFilteredSubs(filtered);
    }
  }, [formData.category_id, dbSubCategories]);



 const handleSubmitInternal = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null); // Hakikisha unayo state ya error: const [error, setError] = useState(null);

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      if (!session) throw new Error("Tafadhali ingia kwanza!");

      const user = session.user;

      // --- HELPER FUNCTION YA UPLOAD ---
      const uploadImage = async (file, folder = "office_photos") => {
        if (!file || !(file instanceof File)) return null;

        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${user.id}/${folder}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("picha_za_duka")
          .upload(filePath, file);

        if (uploadError) {
          console.error("Storage Error:", uploadError.message);
          return null;
        }

        const { data } = supabase.storage.from("picha_za_duka").getPublicUrl(filePath);
        return data.publicUrl;
      };

      // 1. Uploading Images (Branding, Office, TIN)
      const logoUrl = await uploadImage(formData.logo?.[0], "branding");
      const bannerUrl = await uploadImage(formData.banner?.[0], "branding");
      const tinImageUrl = await uploadImage(formData.tin_image?.[0], "verification");

      const officeFiles = [
        formData.image1?.[0],
        formData.image2?.[0],
        formData.image3?.[0],
      ].filter(Boolean);
      const imageUrls = await Promise.all(officeFiles.map((file) => uploadImage(file)));

      // 2. INSERTING DATA TO SUPABASE
      const { data: newStore, error: insertError } = await supabase
        .from("stores_engine")
        .insert([
          {
            owner_id: user.id,
            store_name: formData.name,
            store_slug: createSlug(formData.name),
            business_type: formData.business_type,
            category_id: formData.category_id,
            
            // Arrays
            sub_category_ids: formData.sub_category_ids || [], 
            specialist_tags: formData.specialist_tags || [],

            // Picha
            store_logo: logoUrl,
            store_banner: bannerUrl,
            office_images: imageUrls,

            // Maelezo & Operations
            description: formData.description,
            moq: formData.moq, 
            lead_time: formData.lead_time,
            supply_capacity: formData.supply_capacity,
            packaging_type: formData.packaging_type,

            // Mawasiliano (Tumeunganisha hapa)
            phone_number: formData.phone,
            email: formData.email || null,
            whatsapp_number: formData.whatsapp || formData.phone,
            instagram_handle: formData.instagram || null,
            tiktok_handle: formData.tiktok || null,
            twitter_handle: formData.twitter || null,
            youtube_link: formData.youtube || null,

            // Mahali & Verification
            physical_address: formData.location,
            city: formData.city || "Dar es Salaam",
            tin_number: formData.tin_number,
            tin_image_url: tinImageUrl,
            google_maps_url: formData.maps_link,

            status: "active",
            is_verified: false,
          },
        ])
        .select();

      // --- HAPA NDIPO TUNAKAGUA UNIQUE CONSTRAINT ---
      if (insertError) {
        if (insertError.code === "23505" || insertError.message.includes("unique constraint")) {
          setError("⚠️ Jina hili la duka tayari limeshatumika. Tafadhali tumia jina lingine la kipekee.");
          setStep(1); // Mrudishe user hatua ya kwanza kubadili jina
          return; // Acha kuendelea
        }
        throw insertError;
      }

      // 3. SUCCESS HANDLING
      setIsSuccess(true);
      if (newStore && newStore.length > 0) {
        const storeId = newStore[0].id;
        setTimeout(() => navigate(`/dashboard/physical/${storeId}`), 2000);
      }

    } catch (err) {
      console.error("Critical Error:", err);
      alert("Hitilafu: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-wrapper-premium">
      {/* SIDEBAR YA HATUA */}
      <div className="form-sidebar">
        <button
          type="button"
          onClick={step === 1 ? () => setStoreType(null) : prevStep}
          className="back-link"
        >
          {step === 1 ? "← Ghairi" : "← Nyuma"}
        </button>

        <div className="sidebar-content mt-8">
          <span className="step-count">HATUA {step} / 4</span>
          <h2 className="text-xl font-bold mt-2">
            {step === 1 && "Taarifa za Store"}
            {step === 2 && "Maelezo & Huduma"}
            {step === 3 && "Branding & Picha"}
            {step === 4 && "Mawasiliano ya Jamii"}
          </h2>
          <p className="text-gray-400 mt-2">
            {step === 1 && "Anza na utambulisho mkuu wa duka lako."}
            {step === 2 && "Tueleze duka lako linahusu nini na wateja wakupate wapi."}
            {step === 3 && "Weka Logo, Banner na picha za ofisi yako."}
            {step === 4 && "Ongeza mitandao ya kijamii ili wateja waone kazi zako."}
          </p>
        </div>
      </div>

      {/* FOMU YENYEWE */}
      <div className="form-content">
        <form onSubmit={handleSubmitInternal} className="premium-form">
{/* STEP 1: Basic Info */}
          {/* STEP 1: Basic Info & Business Identity */}
{step === 1 && (
  <div className="step-fade space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

{/* Business Type Selection - Bi-lingual (English & Swahili) */}
<div className="premium-group">
  <label className="group-label">Aina ya Biashara (Business Type)</label>
  <select 
    name="business_type" 
    value={formData.business_type || ""} 
    onChange={handleChange} 
    required 
    className="premium-input"
  >
    <option value="">Chagua Aina / Choose Type...</option>
    
    <option value="Wholesaler">
      Wholesaler (Muuza Jumla)
    </option>
    
    <option value="Retailer">
      Retailer (Muuza Reja reja)
    </option>
    
    <option value="Wholesale & Retail">
      Wholesale & Retail (Jumla na Reja reja)
    </option>
    
    <option value="Manufacturer">
      Manufacturer (Kiwanda / Mtengenezaji)
    </option>

    <option value="Service Provider">
      Service Provider (Mtoa Huduma)
    </option>
  </select>
  
  <p className="text-[10px] text-gray-500 mt-1 italic">
    * Chagua aina inayoelezea biashara yako vizuri zaidi.
  </p>
</div>

      {/* Primary Category */}
      <div className="premium-group">
        <label>Gategory (Kategoria Kuu)</label>
        <select 
          name="category_id" 
          value={formData.category_id}
          onChange={handleChange} 
          required 
          className="premium-input"
        >
          <option value="">Chagua Kategoria...</option>
          {dbCategories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

         {/* HII NDIYO SEHEMU MPYA YA DESCRIPTION YA KATEGORIA KUU */}
  {formData.category_id && (
    <div className="mt-2 p-3 rounded-lg border-l-4 border-orange-500 bg-orange-500/5 animate-pulse-subtle">
      <p className="text-xs text-gray-400 font-medium uppercase tracking-tighter mb-1">Kuhusu Kategoria Hii:</p>
      <p className="text-sm text-orange-400 italic font-medium">
        {dbCategories.find(c => c.id === formData.category_id)?.description || "Maelezo yanapakuliwa..."}
      </p>
    </div>
  )}
      </div>
    </div>

    {/* Sub-categories - Inatokea tu kama category imechaguliwa */}
{/* Sub-categories Section */}
{formData.category_id && (
 <div className="premium-group">
  <label className="group-label">Bobezi (Sub-categories)</label>
  <div className="subcat-grid">
    {filteredSubs.map((sub) => (
      <label key={sub.id} className="subcat-item">
        <input 
          type="checkbox" 
          className="subcat-checkbox"
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
        <span className="subcat-name">{sub.name}</span>
      </label>
    ))}
  </div>
</div>
)}

{/* Specialist Tags Section - MPYA */}
<div className="premium-group mt-6">
  <label className="group-label">Tags za Ubobezi (Andika kisha bonyeza Enter)</label>
  <div className="tags-container">
    {(formData.specialist_tags || []).map((tag, index) => (
      <span key={index} className="specialist-tag">
        {tag}
        <button 
          type="button" 
          onClick={() => {
            const newTags = formData.specialist_tags.filter((_, i) => i !== index);
            handleChange({ target: { name: 'specialist_tags', value: newTags } });
          }}
          className="tag-remove-btn"
        >
          ×
        </button>
      </span>
    ))}
  </div>
  <input 
    type="text" 
    placeholder="Mfano: Jeans Expert, iPhone Specialist..." 
    className="premium-input"
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

    <div className="premium-group border-t border-white/5 pt-4">
      <label>Jina la Store</label>
      <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Ali Mobile Shop" />
    </div>

    <div className="premium-group">
      <label>Namba ya Simu</label>
      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="07xxxxxxxx" />
    </div>

{/* SEHEMU YA MESSAGE YA ERROR */}
{error && (
  <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm mb-4 animate-shake">
    <div className="flex items-center gap-2">
      <span>⚠️</span>
      {error}
    </div>
  </div>
)}

<button type="button" onClick={nextStep} className="premium-submit-btn">
  Endelea Hatua ya 2
</button>


  </div>
)}

 {step === 2 && (
  <div className="step-fade space-y-6">
    {/* 1. SEHEMU YA MAHARI (LOCATION) - ILIYOKUWEPO MWANZO */}
    <div className="location-section">
      <h3 className="text-orange-500 font-bold border-b border-orange-500/20 pb-2 mb-4 uppercase text-xs tracking-widest">
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ display: 'grid', gap: '1.5rem' }}>
  
  {/* MJI SELECTION */}
  <div className="flex flex-col gap-2" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider" style={{ color: '#9ca3af', fontSize: '0.75rem', fontWeight: 'bold' }}>
      Mji
    </label>
    <div className="relative" style={{ position: 'relative' }}>
      <select 
        name="city" 
        value={formData.city} 
        onChange={handleChange} 
        required 
        className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl p-3 text-white focus:border-orange-500 outline-none appearance-none cursor-pointer"
        style={{
          width: '100%',
          backgroundColor: '#1a1a1a',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '12px',
          padding: '12px',
          color: 'white',
          outline: 'none',
          WebkitAppearance: 'none'
        }}
      >
        <option value="">Chagua Mji...</option>
        <option value="Dar es Salaam">Dar es Salaam</option>
        <option value="Arusha">Arusha</option>
        <option value="Mwanza">Mwanza</option>
        <option value="Dodoma">Dodoma</option>
        <option value="Kahama">Kahama</option>
      </select>
      {/* Ka-arrow kadogo */}
      <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#666' }}>
        ▼
      </div>
    </div>
  </div>

  {/* ANWANI SELECTION */}
  <div className="flex flex-col gap-2" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider" style={{ color: '#9ca3af', fontSize: '0.75rem', fontWeight: 'bold' }}>
      Anwani (Mtaa/Jengo)
    </label>
    <input 
      type="text" 
      name="location" 
      value={formData.location} 
      onChange={handleChange} 
      placeholder="Msimbazi, Kariakoo" 
      required 
      className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl p-3 text-white focus:border-orange-500 outline-none"
      style={{
        width: '100%',
        backgroundColor: '#1a1a1a',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '12px',
        padding: '12px',
        color: 'white',
        outline: 'none'
      }}
    />
  </div>
</div>
    </div>

    {/* 2. SEHEMU YA UENDESHAJI (OPERATION DETAILS) - MPYA */}
    <div className="operation-section mt-6">
      <h3 className="text-orange-500 font-bold border-b border-orange-500/20 pb-2 mb-4 uppercase text-xs tracking-widest">
        ⚙️ Uendeshaji & Uwezo wa Ugavi
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* MOQ */}
        <div className={`premium-group p-4 rounded-2xl transition-all ${
  formData.business_type === "Wholesaler (Jumla)" ? "bg-orange-500/5 border border-orange-500/20" : ""
}`}>
  <label className="flex items-center gap-2 mb-2 text-sm font-semibold">
    📦 Kiwango cha Chini cha Oda (MOQ)
  </label>
  
  <input 
    type="text" 
    name="moq" 
    value={formData.moq} 
    onChange={handleChange} 
    placeholder="Mfano: 10 PC" 
    className="premium-input mb-3"
    required={formData.business_type === "Wholesaler (Jumla)"}
  />

  {/* QUICK OPTIONS - Hapa ndipo urahisi ulipo */}
  <div className="flex flex-wrap gap-2">
    {["1 PC", "10 PC", "1 Katoni", "Dazeni 1", "Pipa 1"].map((option) => (
      <button
        key={option}
        type="button"
        onClick={() => handleChange({ target: { name: 'moq', value: option } })}
        className={`px-3 py-1 rounded-full text-[11px] font-medium border transition-all ${
          formData.moq === option 
          ? "bg-orange-500 text-black border-orange-500" 
          : "bg-transparent border-white/10 text-gray-400 hover:border-orange-500/50"
        }`}
      >
        + {option}
      </button>
    ))}
  </div>
</div>

        {/* Lead Time */}
        <div className="premium-group">
          <label>Muda wa Kutayarisha Oda (Lead Time)</label>
          <select 
            name="lead_time" 
            value={formData.lead_time} 
            onChange={handleChange} 
            className="premium-input"
          >
            <option value="">Chagua muda...</option>
            <option value="Saa 24">Chini ya Saa 24</option>
            <option value="Siku 1-3">Siku 1 - 3</option>
            <option value="Siku 3-7">Siku 3 - 7</option>
            <option value="Siku 7+">Zaidi ya Siku 7</option>
          </select>
        </div>

        {/* Supply Capacity */}
        <div className="premium-group">
          <label>Uwezo wa Ugavi kwa Mwezi</label>
          <input 
            type="text" 
            name="supply_capacity" 
            value={formData.supply_capacity} 
            onChange={handleChange} 
            placeholder="Mfano: PC 5,000" 
          />
        </div>

        {/* Packaging Type */}
        <div className="premium-group">
          <label>Aina ya Ufungashaji</label>
          <input 
            type="text" 
            name="packaging_type" 
            value={formData.packaging_type} 
            onChange={handleChange} 
            placeholder="Mfano: Mifuko ya Nylon, Maboksi" 
          />
        </div>
      </div>
    </div>

    {/* 3. MAELEZO YA ZIADA */}
   <div className="premium-group mt-4 animate-fade-in">
  <label className="flex items-center gap-2">
    <span className="text-orange-500">📝</span>
    Maelezo ya Huduma/Bidhaa (Description)
  </label>
  <textarea 
    name="description" 
    value={formData.description} 
    onChange={handleChange} 
    rows="4" 
    placeholder="Mfano: Sisi ni mabingwa wa vifaa vya elektroniki, tunatoa warranty ya mwaka mmoja kwa kila bidhaa..." 
    required
    className="premium-textarea-input"
  ></textarea>
  <div className="flex justify-end mt-1">
    <span className="text-[10px] text-gray-600 italic">Maelezo haya yataonekana kwenye profile yako</span>
  </div>
</div>

    <div className="flex gap-4 pt-4 border-t border-white/5">
       <button type="button" onClick={prevStep} className="premium-submit-btn bg-gray-800">Nyuma</button>

       {error && (
  <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3...">
    <span>⚠️</span> {error}
  </div>
)}

<button 
  type="button" 
  onClick={() => {
    console.log("Data ya sasa:", formData); // Angalia kama description ipo
    nextStep();
  }} 
  className="premium-submit-btn"
>
  Endelea Kwenye Picha
</button>
    </div>
  </div>
)}

          {/* STEP 3: Images & Branding */}
        {/* STEP 3: Images, Branding & Verification */}
{step === 3 && (
  <div className="step-fade space-y-6">
    
    {/* SEHEMU YA VERIFICATION (TIN & BUSINESS) */}
    <div className="verification-section bg-orange-500/5 p-4 rounded-2xl border border-orange-500/20">
      <h3 className="text-orange-500 font-bold mb-4 flex items-center gap-2">
        🛡️ Uhakiki wa Biashara (Verification)
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="premium-group">
          <label>Namba ya TIN</label>
          <input 
            type="text" 
            name="tin_number" 
            value={formData.tin_number || ""} 
            onChange={handleChange} 
            placeholder="Mfano: 123-456-789"
            className="premium-input"
          />
        </div>

       <div className="premium-group">
  <label>Picha ya Cheti cha TIN / Leseni</label>
  <input 
    type="file" 
    onChange={(e) => handleFileChange(e, "tin_image")} 
    accept="image/*" 
  />
  {/* Preview ikiwa compact zaidi */}
  {previews.tin_image && (
    <div className="mt-2 relative inline-block">
      <img 
        src={previews.tin_image} 
        alt="TIN Preview" 
        style={{ maxHeight: '120px', borderRadius: '8px', border: '1px solid #f97316' }} 
      />
      <button 
        onClick={() => setPreviews(p => ({...p, tin_image: null}))}
        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs"
      >
        ×
      </button>
    </div>
  )}
</div>


      </div>
    </div>

    {/* SEHEMU YA MAPS & LOCATION LINK */}
    <div className="location-verification bg-blue-500/5 p-4 rounded-2xl border border-blue-500/20">
      <h3 className="text-blue-400 font-bold mb-4 flex items-center gap-2">
        📍 Mahali (Google Maps)
      </h3>
      <div className="premium-group">
        <label>Google Maps Link (URL)</label>
        <input 
          type="url" 
          name="maps_link" 
          value={formData.maps_link || ""} 
          onChange={handleChange} 
          placeholder="https://goo.gl/maps/..."
          className="premium-input"
        />
        <p className="text-[10px] text-gray-500 mt-1 italic">
          Nenda Google Maps, tafuta duka lako, kisha bonyeza "Share" na u-copy link uweke hapa.
        </p>
      </div>
    </div>

    {/* BRANDING (LOGO & BANNER) */}
    <div className="branding-upload-section grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="premium-group">
        <label>Logo ya Duka (Square)</label>
        <input type="file" onChange={(e) => handleFileChange(e, "logo")} accept="image/*" />
      </div>
      <div className="premium-group">
        <label>Banner la Duka (Landscape)</label>
        <input type="file" onChange={(e) => handleFileChange(e, "banner")} accept="image/*" />
      </div>
    </div>

    {/* OFFICE PHOTOS */}
    <div className="office-photos">
      <label className="mb-4 block font-medium text-sm text-gray-300">Picha za Muonekano wa Ofisi/Duka (Picha 3)</label>
      <div className="image-upload-grid">
        {[1, 2, 3].map((i) => (
          <div key={i} className="upload-box-wrapper">
            <input type="file" id={`img${i}`} hidden onChange={(e) => handleFileChange(e, `image${i}`)} accept="image/*" />
            <label htmlFor={`img${i}`} className={`upload-box ${previews[`image${i}`] ? "has-img" : ""}`}>
              {previews[`image${i}`] ? <img src={previews[`image${i}`]} alt="Preview" /> : <span>📸 Picha {i}</span>}
            </label>
          </div>
        ))}
      </div>
    </div>

    <div className="flex gap-4 mt-6">
      <button type="button" onClick={prevStep} className="premium-submit-btn bg-gray-800">Nyuma</button>
      <button type="button" onClick={nextStep} className="premium-submit-btn">Hatua ya Mwisho</button>
    </div>
  </div>
)}
          {/* STEP 4: Social Media & Finalize */}
          {/* STEP 4: Social Media & Finalize */}
{step === 4 && (
  <div className="step-fade space-y-5">
    <h3 className="text-orange-500 font-bold border-b border-orange-500/20 pb-2 mb-4 uppercase text-xs tracking-widest">
      🌐 Mitandao ya Jamii & Mawasiliano
    </h3>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* WhatsApp - Muhimu sana! */}
      <div className="premium-group">
        <label>Namba ya WhatsApp</label>
        <input 
          type="tel" 
          name="whatsapp" 
          value={formData.whatsapp || ""} 
          onChange={handleChange} 
          placeholder="07xxxxxxxx" 
          className="premium-input"
        />
      </div>

      {/* Instagram */}
      <div className="premium-group">
        <label>Instagram Handle</label>
        <input 
          type="text" 
          name="instagram" 
          value={formData.instagram || ""} 
          onChange={handleChange} 
          placeholder="@jina_la_duka" 
          className="premium-input"
        />
      </div>

      {/* TikTok */}
      <div className="premium-group">
        <label>TikTok Username</label>
        <input 
          type="text" 
          name="tiktok" 
          value={formData.tiktok || ""} 
          onChange={handleChange} 
          placeholder="@duka_tiktok" 
          className="premium-input"
        />
      </div>

      {/* X (Twitter) */}
      <div className="premium-group">
        <label>X (Twitter) Handle</label>
        <input 
          type="text" 
          name="twitter" 
          value={formData.twitter || ""} 
          onChange={handleChange} 
          placeholder="@jina_la_x" 
          className="premium-input"
        />
      </div>

      {/* YouTube */}
      <div className="premium-group md:col-span-2">
        <label>YouTube Channel Link</label>
        <input 
          type="url" 
          name="youtube" 
          value={formData.youtube || ""} 
          onChange={handleChange} 
          placeholder="https://youtube.com/@channel_yako" 
          className="premium-input"
        />
      </div>
    </div>

    {/* SEHEMU YA KUMALIZIA: VIGEZO NA MASHARTI */}
    <div className="mt-6 p-4 rounded-2xl bg-white/5 border border-white/10">
      <label className="flex items-start gap-3 cursor-pointer">
        <input 
          type="checkbox" 
          required 
          className="mt-1 accent-orange-500"
        />
        <span className="text-xs text-gray-400 leading-relaxed">
          Ninakubali kuwa taarifa zote nilizotoa ni za kweli. Naelewa kuwa akaunti yangu inaweza kufungiwa ikiwa nitakiuka sheria za biashara na utapeli.
        </span>
      </label>
    </div>

    <div className="flex gap-4 pt-4">
      <button type="button" onClick={prevStep} className="premium-submit-btn bg-gray-800">
        Nyuma
      </button>
      <button 
        type="submit" 
        disabled={isLoading} 
        className="premium-submit-btn bg-gradient-to-r from-orange-500 to-orange-600"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5 text-black" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Inatengeneza Duka...
          </span>
        ) : (
          "🚀 Kamilisha na Fungua Duka"
        )}
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