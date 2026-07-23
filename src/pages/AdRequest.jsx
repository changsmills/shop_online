import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
//import { supabase } from "../supabaseClient";
import * as LucideIcons from "lucide-react";

export default function AdRequest() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [userProfile, setUserProfile] = useState({ name: "", phone: "", email: "" });
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    // Taarifa za mtu anayetangaza
    fullName: "",
    phoneNumber: "",
    email: "",
    businessName: "",
    businessType: "",
    
    // Taarifa za tangazo
    adType: "keyword",
    productName: "",
    productDescription: "",
    productLink: "",
    productImages: [],
    targetCategory: "",
    
    // Bajeti na muda
    budget: "",
    duration: "30",
    targetLocation: "Tanzania",
    targetAudience: "",
    
    // Maelezo ya ziada
    specialRequests: "",
    hearAboutUs: ""
  });

  // Check if user is logged in and get profile
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
        
        // Fetch user profile from database
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
    // Simulate image upload (you can implement actual upload to Supabase storage)
    setFormData({ ...formData, productImages: files.map(f => f.name) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Save ad request to database
    const { error } = await supabase
      .from('ad_requests')
      .insert([
        {
          user_id: user?.id,
          // Taarifa za mtu
          full_name: formData.fullName,
          phone_number: formData.phoneNumber,
          email: formData.email,
          business_name: formData.businessName,
          business_type: formData.businessType,
          
          // Taarifa za tangazo
          ad_type: formData.adType,
          product_name: formData.productName,
          product_description: formData.productDescription,
          product_link: formData.productLink,
          target_category: formData.targetCategory,
          
          // Bajeti
          budget: parseInt(formData.budget),
          duration: parseInt(formData.duration),
          target_location: formData.targetLocation,
          target_audience: formData.targetAudience,
          
          // Maelezo
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

  if (submitted) {
    return (
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '60px 20px', textAlign: 'center' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#e8f5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <LucideIcons.CheckCircle size={50} color="#27ae60" />
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '15px' }}>Ombi Limetumwa!</h1>
        <p style={{ fontSize: '16px', color: '#666', marginBottom: '30px' }}>
          Asante {formData.fullName || user?.email}. Tumepokea ombi lako la tangazo.
        </p>
        <div style={{ backgroundColor: '#f9fafb', padding: '20px', borderRadius: '8px', marginBottom: '30px', textAlign: 'left' }}>
          <p><strong>📋 Muhtasari wa Ombi:</strong></p>
          <p>✓ Aina ya Tangazo: {adTypes.find(t => t.value === formData.adType)?.label}</p>
          <p>✓ Bidhaa: {formData.productName}</p>
          <p>✓ Bajeti: TSh {parseInt(formData.budget).toLocaleString()}</p>
          <p>✓ Muda: {formData.duration} siku</p>
        </div>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '20px' }}>
          Tutakujiana ndani ya saa 24 kwa maelezo zaidi kupitia {formData.phoneNumber} au {formData.email}
        </p>
        <Link to="/" style={{ backgroundColor: '#ff6a00', color: 'white', padding: '12px 30px', borderRadius: '8px', textDecoration: 'none', display: 'inline-block', marginRight: '10px' }}>
          Rudi Nyumbani
        </Link>
        <Link to="/ads/my-requests" style={{ backgroundColor: 'transparent', color: '#ff6a00', padding: '12px 30px', borderRadius: '8px', textDecoration: 'none', display: 'inline-block', border: '1px solid #ff6a00' }}>
          Tazama Maombi Yangu
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '10px' }}>
        <LucideIcons.Megaphone size={28} style={{ color: '#ff6a00', marginRight: '10px' }} />
        Ombi la Tangazo
      </h1>
      <p style={{ fontSize: '16px', color: '#666', marginBottom: '30px' }}>
        Jaza fomu hii kwa undani. Tutakujiana na bei kamili na maelekezo ya malipo.
      </p>

      <form onSubmit={handleSubmit} style={{ backgroundColor: 'white', borderRadius: '12px' }}>
        
        {/* SEHEMU YA 1: TAARIFA ZAKO */}
        <div style={{ marginBottom: '30px', border: '1px solid #eee', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ backgroundColor: '#f9fafb', padding: '15px 20px', borderBottom: '1px solid #eee' }}>
            <h3 style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <LucideIcons.User size={18} color="#ff6a00" /> Taarifa Zako (Mtangazaji)
            </h3>
          </div>
          <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Jina Kamili *</label>
              <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Namba ya Simu *</label>
              <input type="tel" name="phoneNumber" required value={formData.phoneNumber} onChange={handleChange} placeholder="07XX XXX XXX" style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Barua Pepe *</label>
              <input type="email" name="email" required value={formData.email} onChange={handleChange} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Jina la Biashara</label>
              <input type="text" name="businessName" value={formData.businessName} onChange={handleChange} placeholder="Mfano: Skyfall Enterprises" style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Aina ya Biashara</label>
              <select name="businessType" value={formData.businessType} onChange={handleChange} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}>
                <option value="">Chagua...</option>
                {businessTypes.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* SEHEMU YA 2: TAARIFA ZA TANGAZO */}
        <div style={{ marginBottom: '30px', border: '1px solid #eee', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ backgroundColor: '#f9fafb', padding: '15px 20px', borderBottom: '1px solid #eee' }}>
            <h3 style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <LucideIcons.Megaphone size={18} color="#ff6a00" /> Taarifa za Tangazo
            </h3>
          </div>
          <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Aina ya Tangazo *</label>
              <select name="adType" value={formData.adType} onChange={handleChange} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}>
                {adTypes.map(type => <option key={type.value} value={type.value}>{type.label} - {type.price}</option>)}
              </select>
              <small style={{ color: '#666' }}>{adTypes.find(t => t.value === formData.adType)?.desc}</small>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Kategoria ya Bidhaa</label>
              <select name="targetCategory" value={formData.targetCategory} onChange={handleChange} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}>
                <option value="">Chagua kategoria...</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Jina la Bidhaa / Huduma *</label>
              <input type="text" name="productName" required value={formData.productName} onChange={handleChange} placeholder="Mfano: Simu za Samsung, Vifaa vya ujenzi..." style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }} />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Maelezo ya Bidhaa</label>
              <textarea name="productDescription" rows="3" value={formData.productDescription} onChange={handleChange} placeholder="Eleza kwa undani bidhaa unayotaka kutangaza..." style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Link ya Bidhaa</label>
              <input type="url" name="productLink" value={formData.productLink} onChange={handleChange} placeholder="https://skyfall.com/product/..." style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Picha za Bidhaa</label>
              <input type="file" accept="image/*" multiple onChange={handleImageUpload} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }} />
              <small style={{ color: '#666' }}>Unaweza kupakia picha 5 (JPEG, PNG)</small>
            </div>
          </div>
        </div>

        {/* SEHEMU YA 3: BAJETI NA MUDU */}
        <div style={{ marginBottom: '30px', border: '1px solid #eee', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ backgroundColor: '#f9fafb', padding: '15px 20px', borderBottom: '1px solid #eee' }}>
            <h3 style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <LucideIcons.CreditCard size={18} color="#ff6a00" /> Bajeti na Muda
            </h3>
          </div>
          <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Bajeti Yako (TSh) *</label>
              <input type="number" name="budget" required value={formData.budget} onChange={handleChange} placeholder="Mfano: 100000" style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Muda wa Tangazo (Siku) *</label>
              <select name="duration" value={formData.duration} onChange={handleChange} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}>
                <option value="7">Siku 7</option>
                <option value="14">Siku 14</option>
                <option value="30">Siku 30</option>
                <option value="60">Siku 60</option>
                <option value="90">Siku 90</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Eneo Lengwa</label>
              <select name="targetLocation" value={formData.targetLocation} onChange={handleChange} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}>
                <option value="Tanzania">Tanzania Nzima</option>
                <option value="Dar es Salaam">Dar es Salaam</option>
                <option value="Arusha">Arusha</option>
                <option value="Mwanza">Mwanza</option>
                <option value="Mbeya">Mbeya</option>
                <option value="Zanzibar">Zanzibar</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Wateja Lengwa</label>
              <input type="text" name="targetAudience" value={formData.targetAudience} onChange={handleChange} placeholder="Mfano: Wauzaji jumla, Wanunuzi wa simu..." style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }} />
            </div>
          </div>
        </div>

        {/* SEHEMU YA 4: MAELEZO YA ZIADA */}
        <div style={{ marginBottom: '30px', border: '1px solid #eee', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ backgroundColor: '#f9fafb', padding: '15px 20px', borderBottom: '1px solid #eee' }}>
            <h3 style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <LucideIcons.Edit3 size={18} color="#ff6a00" /> Maelezo ya Ziada
            </h3>
          </div>
          <div style={{ padding: '20px' }}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Maombi Maalum</label>
              <textarea name="specialRequests" rows="3" value={formData.specialRequests} onChange={handleChange} placeholder="Mfano: Nataka tangazo lionekane weekends tu, au nimpe muundo maalum..." style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Umetupataje?</label>
              <select name="hearAboutUs" value={formData.hearAboutUs} onChange={handleChange} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}>
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

        {/* BUTTONS */}
        <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
          <button type="submit" disabled={loading} style={{ backgroundColor: '#ff6a00', color: 'white', padding: '14px 30px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600', flex: 1 }}>
            {loading ? "Inatuma..." : "Tuma Ombi la Tangazo"}
          </button>
          <Link to="/" style={{ backgroundColor: '#f0f0f0', color: '#333', padding: '14px 30px', borderRadius: '8px', textDecoration: 'none', textAlign: 'center', fontWeight: '500', flex: 0.3 }}>
            Ghairi
          </Link>
        </div>
      </form>
    </div>
  );
}