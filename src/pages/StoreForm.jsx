import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axiosConfig"; // ✅ Tumia api
import "../StoreForm.css";

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
        setError("Tafadhali jaza: Jina, Simu, Kategoria na Bobezi zote.");
        return;
      }
      setStep(2);
      return;
    }

    if (step === 2) {
      if (!formData.city || !formData.location) {
        setError("Mji na Anwani ni lazima.");
        return;
      }
      if (!formData.description || formData.description.length < 10) {
        setError("Maelezo ya duka ni mafupi mno (Weka angalau herufi 10).");
        return;
      }
      setStep(3);
      return;
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
        setError("Tafadhali ingia kwanza!");
        setIsLoading(false);
        return;
      }

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

      if (formData.logo) formDataObj.append("store_logo", formData.logo[0]);
      if (formData.banner) formDataObj.append("store_banner", formData.banner[0]);
      if (formData.tin_image) formDataObj.append("tin_image", formData.tin_image[0]);
      if (formData.image1) formDataObj.append("office_image_1", formData.image1[0]);
      if (formData.image2) formDataObj.append("office_image_2", formData.image2[0]);
      if (formData.image3) formDataObj.append("office_image_3", formData.image3[0]);

      const response = await api.post(
        "/stores/",
        formDataObj,
        { headers: { "Authorization": `Bearer ${token}` } }
      );

      try {
        await api.patch(
          "/profile/",
          { role: "supplier" },
          { headers: { "Authorization": `Bearer ${token}` } }
        );
        console.log("✅ Role imebadilishwa kuwa supplier!");
      } catch (roleError) {
        console.warn("⚠️ Imeshindwa kubadilisha role, lakini duka limeundwa:", roleError);
      }

      setIsSuccess(true);
      if (response.data && response.data.id) {
        setTimeout(() => navigate(`/dashboard/sellerboard/${response.data.id}`), 2000);
      }

    } catch (err) {
      console.error("Critical Error:", err);
      console.log("SERVER RESPONSE DATA (Error details):", err.response?.data);
      console.log("HTTP STATUS:", err.response?.status);

      let errorMsg = "Hitilafu isiyojulikana.";
      if (err.response?.data) {
        const data = err.response.data;
        if (typeof data === 'object') {
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
      setStep(1);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-wrapper-premium">
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
          <h2 className="title-xl font-bold mt-2">
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

      <div className="form-content">
        <form onSubmit={handleSubmitInternal} className="premium-form">
          
          {step === 1 && (
            <div className="step-fade">
              <div className="grid-2-col">
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
                    <option value="Wholesaler">Wholesaler (Muuza Jumla)</option>
                    <option value="Retailer">Retailer (Muuza Reja reja)</option>
                    <option value="Wholesale & Retail">Wholesale & Retail (Jumla na Reja reja)</option>
                    <option value="Manufacturer">Manufacturer (Kiwanda / Mtengenezaji)</option>
                    <option value="Service Provider">Service Provider (Mtoa Huduma)</option>
                  </select>
                  <p className="text-small-italic">* Chagua aina inayoelezea biashara yako vizuri zaidi.</p>
                </div>

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
                  {formData.category_id && (
                    <div className="cat-info-box">
                      <p className="text-xs-uppercase">Kuhusu Kategoria Hii:</p>
                      <p className="text-orange-italic">
                        {dbCategories.find(c => c.id === formData.category_id)?.description || "Maelezo yanapakuliwa..."}
                      </p>
                    </div>
                  )}
                </div>
              </div>

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
                      >×</button>
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

              <div className="premium-group border-top pt-4">
                <label>Jina la Store</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Ali Mobile Shop" />
              </div>

              <div className="grid-2-col">
                <div className="premium-group">
                  <label>Namba ya Simu</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="07xxxxxxxx" />
                </div>
                <div className="premium-group">
                  <label>Barua Pepe (Email)</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email || ""} 
                    onChange={handleChange} 
                    placeholder="biashara@mfano.com" 
                    className="premium-input"
                  />
                </div>
              </div>

              {error && (
                <div className="error-box">
                  <div className="flex-center"><span>⚠️</span> {error}</div>
                </div>
              )}

              <button type="button" onClick={nextStep} className="premium-submit-btn">Endelea Hatua ya 2</button>
            </div>
          )}

          {step === 2 && (
            <div className="step-fade">
              <div className="location-section">
                <h3 className="title-orange-border"></h3>
                <div className="location-grid">
                  <div className="flex-col-gap">
                    <label className="premium-label-light">Mji</label>
                    <div className="relative-wrapper">
                      <select 
                        name="city" 
                        value={formData.city} 
                        onChange={handleChange} 
                        required 
                        className="custom-select"
                      >
                        <option value="">Chagua Mji...</option>
                        <option value="Dar es Salaam">Dar es Salaam</option>
                        <option value="Arusha">Arusha</option>
                        <option value="Mwanza">Mwanza</option>
                        <option value="Dodoma">Dodoma</option>
                        <option value="Kahama">Kahama</option>
                      </select>
                      <div className="custom-select-arrow">▼</div>
                    </div>
                  </div>

                  <div className="flex-col-gap">
                    <label className="premium-label-light">Anwani (Mtaa/Jengo)</label>
                    <input 
                      type="text" 
                      name="location" 
                      value={formData.location} 
                      onChange={handleChange} 
                      placeholder="Msimbazi, Kariakoo" 
                      required 
                      className="custom-input"
                    />
                  </div>
                </div>
              </div>

              <div className="operation-section mt-6">
                <h3 className="title-orange-border-icon">⚙️ Uendeshaji & Uwezo wa Ugavi</h3>
                <div className="grid-2-col">
                  <div className={`premium-group active-wholesaler ${formData.business_type === "Wholesaler (Jumla)" ? "bg-orange-highlight" : ""}`}>
                    <label className="flex-center-gap mb-2">📦 Kiwango cha Chini cha Oda (MOQ)</label>
                    <input type="text" name="moq" value={formData.moq} onChange={handleChange} placeholder="Mfano: 10 PC" className="premium-input mb-3" required={formData.business_type === "Wholesaler (Jumla)"} />
                    <div className="btn-flex-wrap">
                      {["1 PC", "10 PC", "1 Katoni", "Dazeni 1", "Pipa 1"].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => handleChange({ target: { name: 'moq', value: option } })}
                          className={`tag-choice-btn ${formData.moq === option ? "active-tag-choice" : ""}`}
                        >+ {option}</button>
                      ))}
                    </div>
                  </div>

                  <div className="premium-group">
                    <label>Muda wa Kutayarisha Oda (Lead Time)</label>
                    <select name="lead_time" value={formData.lead_time} onChange={handleChange} className="premium-input">
                      <option value="">Chagua muda...</option>
                      <option value="Saa 24">Chini ya Saa 24</option>
                      <option value="Siku 1-3">Siku 1 - 3</option>
                      <option value="Siku 3-7">Siku 3 - 7</option>
                      <option value="Siku 7+">Zaidi ya Siku 7</option>
                    </select>
                  </div>

                  <div className="premium-group">
                    <label>Uwezo wa Ugavi kwa Mwezi</label>
                    <input type="text" name="supply_capacity" value={formData.supply_capacity} onChange={handleChange} placeholder="Mfano: PC 5,000" />
                  </div>

                  <div className="premium-group">
                    <label>Aina ya Ufungashaji</label>
                    <input type="text" name="packaging_type" value={formData.packaging_type} onChange={handleChange} placeholder="Mfano: Mifuko ya Nylon, Maboksi" />
                  </div>

                  <div className="premium-group">
                    <label>Miaka ya Uzoefu (Experience)</label>
                    <input type="text" name="experience" value={formData.experience || ""} onChange={handleChange} placeholder="Mfano: Miaka 5" className="premium-input" />
                  </div>

                  <div className="premium-group">
                    <label>Idadi ya Wafanyakazi (Staff Count)</label>
                    <input type="number" name="staff_count" value={formData.staff_count || ""} onChange={handleChange} placeholder="Mfano: 10" className="premium-input" />
                  </div>
                </div>
              </div>

              <div className="premium-group mt-4">
                <label className="flex-center-gap"><span className="text-orange">📝</span> Maelezo ya Huduma/Bidhaa (Description)</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows="4" placeholder="Mfano: Sisi ni mabingwa wa vifaa vya elektroniki..." required className="premium-textarea-input"></textarea>
                <div className="flex-right"><span className="text-small-gray">Maelezo haya yataonekana kwenye profile yako</span></div>
              </div>

              <div className="flex-gap-4 border-top pt-4">
                <button type="button" onClick={prevStep} className="premium-submit-btn bg-gray-800">Nyuma</button>
                {error && <div className="error-box"><span>⚠️</span> {error}</div>}
                <button type="button" onClick={() => { console.log("Data ya sasa:", formData); nextStep(); }} className="premium-submit-btn">Endelea Kwenye Picha</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="step-fade">
              <div className="verification-section">
                <h3 className="flex-center-gap title-orange">🛡️ Uhakiki wa Biashara (Verification)</h3>
                <div className="grid-2-col">
                  <div className="premium-group">
                    <label>Namba ya TIN</label>
                    <input type="text" name="tin_number" value={formData.tin_number || ""} onChange={handleChange} placeholder="Mfano: 123-456-789" className="premium-input" />
                  </div>
                  <div className="premium-group">
                    <label>Picha ya Cheti cha TIN / Leseni</label>
                    <input type="file" onChange={(e) => handleFileChange(e, "tin_image")} accept="image/*" />
                    {previews.tin_image && (
                      <div className="mt-2 relative inline-block">
                        <img src={previews.tin_image} alt="TIN Preview" className="preview-tin-img" />
                        <button onClick={() => setPreviews(p => ({...p, tin_image: null}))} className="tin-remove-btn">×</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="location-verification">
                <h3 className="flex-center-gap title-blue">📍 Mahali (Google Maps)</h3>
                <div className="premium-group">
                  <label>Google Maps Link (URL)</label>
                  <input type="url" name="maps_link" value={formData.maps_link || ""} onChange={handleChange} placeholder="https://goo.gl/maps/..." className="premium-input" />
                  <p className="text-small-gray-italic">Nenda Google Maps, tafuta duka lako, kisha bonyeza "Share" na u-copy link uweke hapa.</p>
                </div>
              </div>

              <div className="branding-upload-section grid-2-col">
                <div className="premium-group">
                  <label>Logo ya Duka (Square)</label>
                  <input type="file" onChange={(e) => handleFileChange(e, "logo")} accept="image/*" />
                </div>
                <div className="premium-group">
                  <label>Banner la Duka (Landscape)</label>
                  <input type="file" onChange={(e) => handleFileChange(e, "banner")} accept="image/*" />
                </div>
              </div>

              <div className="office-photos">
                <label className="mb-4">Picha za Muonekano wa Ofisi/Duka (Picha 3)</label>
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

              <div className="flex-gap-4 mt-6">
                <button type="button" onClick={prevStep} className="premium-submit-btn bg-gray-800">Nyuma</button>
                <button type="button" onClick={nextStep} className="premium-submit-btn">Hatua ya Mwisho</button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="step-fade">
              <h3 className="title-orange-border-icon">🌐 Mitandao ya Jamii & Mawasiliano</h3>
              <div className="grid-2-col">
                <div className="premium-group">
                  <label>Namba ya WhatsApp</label>
                  <input type="tel" name="whatsapp" value={formData.whatsapp || ""} onChange={handleChange} placeholder="07xxxxxxxx" className="premium-input" />
                </div>
                <div className="premium-group">
                  <label>Instagram Handle</label>
                  <input type="text" name="instagram" value={formData.instagram || ""} onChange={handleChange} placeholder="@jina_la_duka" className="premium-input" />
                </div>
                <div className="premium-group">
                  <label>TikTok Username</label>
                  <input type="text" name="tiktok" value={formData.tiktok || ""} onChange={handleChange} placeholder="@duka_tiktok" className="premium-input" />
                </div>
                <div className="premium-group">
                  <label>X (Twitter) Handle</label>
                  <input type="text" name="twitter" value={formData.twitter || ""} onChange={handleChange} placeholder="@jina_la_x" className="premium-input" />
                </div>
                <div className="premium-group md-col-span-2">
                  <label>YouTube Channel Link</label>
                  <input type="url" name="youtube" value={formData.youtube || ""} onChange={handleChange} placeholder="https://youtube.com/@channel_yako" className="premium-input" />
                </div>
              </div>

              <div className="terms-box">
                <label className="flex-start-gap cursor-pointer">
                  <input type="checkbox" checked={formData.agreed_to_terms || false} onChange={(e) => handleChange({ target: { name: 'agreed_to_terms', value: e.target.checked } })} required className="checkbox-orange" />
                  <span className="text-small-gray">Ninakubali kuwa taarifa zote nilizotoa ni za kweli. Naelewa kuwa akaunti yangu inaweza kufungiwa ikiwa nitakiuka sheria za biashara na utapeli.</span>
                </label>
              </div>

              <div className="flex-gap-4 pt-4">
                <button type="button" onClick={prevStep} className="premium-submit-btn bg-gray-800">Nyuma</button>
                <button type="submit" disabled={isLoading} className="premium-submit-btn bg-orange-grad">
                  {isLoading ? (
                    <span className="flex-center-gap">
                      <svg className="spin-icon" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Inatengeneza Duka...
                    </span>
                  ) : ("🚀 Kamilisha na Fungua Duka")}
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