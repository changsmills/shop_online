import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import "../AdvertisePage.css"; 
import { 
  Send, CheckCircle, UploadCloud, Loader2, AlertCircle, 
  PlayCircle, ImageIcon, Store, ChevronDown 
} from "lucide-react";
import toast from 'react-hot-toast';

export default function AdvertisePage({ session }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingStores, setLoadingStores] = useState(true);
  const [status, setStatus] = useState({ type: "", msg: "" });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);

  
  const [formData, setFormData] = useState({
    store_id: "",
    business_name: "",
    ad_type: "banner",
    description: "",
  });

  // 1. FETCH STORES ZA USER
  useEffect(() => {
    const fetchUserStores = async () => {
      if (!session?.user?.id) {
        setLoadingStores(false);
        return;
      }

      try {
        setLoadingStores(true);
        const { data, error } = await supabase
          .from("stores_engine")
          .select("id, store_name, store_logo, is_active")
          .eq("owner_id", session.user.id)
          .eq("is_active", true); // Active stores tu

        if (error) throw error;

        if (!data || data.length === 0) {
          toast.error("Huna duka lolote. Tafadhali unda duka kwanza kabla ya kutangaza!");
          setTimeout(() => navigate("/create-store"), 3000);
        } else {
          setStores(data);
          
          // Auto-select first store if only one
          if (data.length === 1) {
            setSelectedStore(data[0]);
            setFormData(prev => ({
              ...prev,
              store_id: data[0].id,
              business_name: data[0].store_name
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching stores:", error);
        toast.error("Hitilafu kupata store zako");
      } finally {
        setLoadingStores(false);
      }
    };

    fetchUserStores();
  }, [session, navigate]);

  // 2. HANDLE STORE SELECTION
  const handleStoreChange = (storeId) => {
    const store = stores.find(s => s.id === storeId);
    if (store) {
      setSelectedStore(store);
      setFormData(prev => ({
        ...prev,
        store_id: store.id,
        business_name: store.store_name
      }));
    }
  };

  // 3. Handle File Selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error("Faili ni kubwa sana. Inapaswa kuwa chini ya 10MB");
        return;
      }
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4'];
      if (!allowedTypes.includes(selectedFile.type)) {
        toast.error("Aina ya faili haikubaliki. Tumia JPEG, PNG, GIF, WebP, au MP4");
        return;
      }
      
      setFile(selectedFile);
      // Cleanup old preview
      if (preview) URL.revokeObjectURL(preview);
      // Create new preview
      setPreview(URL.createObjectURL(selectedFile));
      setStatus({ type: "info", msg: `Umechagua: ${selectedFile.name}` });
    }
  };

  // 4. SUBMIT ADVERTISEMENT
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validations
    if (!session?.user?.id) {
      toast.error("Tafadhali ingia kwenye akaunti kwanza!");
      return;
    }
    
    if (!formData.store_id) {
      toast.error("Tafadhali chagua duka unalotaka kutangaza!");
      return;
    }
    
    if (!file) {
      toast.error("Tafadhali pakia picha au video ya tangazo!");
      return;
    }
    
    if (!formData.description.trim()) {
      toast.error("Tafadhali weka maelezo ya tangazo!");
      return;
    }

    setLoading(true);
    setStatus({ type: "info", msg: "Inapakia tangazo lako..." });

    try {
      // 1. Upload Media to Storage
      const fileExt = file.name.split('.').pop();
      const mediaType = file.type.startsWith('video') ? 'video' : 'image';
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `ads/${formData.store_id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('ad-media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('ad-media')
        .getPublicUrl(filePath);

      // 3. Save to database (include store_id)
      const { error: dbError } = await supabase
        .from('advertisements')
        .insert([
          {
            user_id: session.user.id,
            store_id: formData.store_id, // 🔥 MUHIMU: Hii inaunganisha tangazo na duka
            business_name: formData.business_name,
            ad_type: formData.ad_type,
            description: formData.description,
            media_url: publicUrl,
            media_type: mediaType,   // ← ONGEZA HAPA
            status: 'pending',
            created_at: new Date().toISOString()
          }
        ]);

      if (dbError) throw dbError;

      // Success
      toast.success("Tangazo lako limepokelewa! Litasubiri kuhakikiwa na Admin.");
      setStatus({ type: "success", msg: "Hongera! Tangazo lako limepokelewa na linasubiri kuhakikiwa na Admin." });
      
      // Reset form (keep store selection)
      setFormData({
        store_id: selectedStore?.id || "",
        business_name: selectedStore?.store_name || "",
        ad_type: "banner",
        description: "",
      });
      setFile(null);
      if (preview) {
        URL.revokeObjectURL(preview);
        setPreview(null);
      }

    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Hitilafu: " + error.message);
      setStatus({ type: "error", msg: "Hitilafu: " + error.message });
    } finally {
      setLoading(false);
    }
  };

  // 5. Cleanup preview on unmount
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  if (loadingStores) {
    return (
      <div className="advertise-container">
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <Loader2 size={40} className="animate-spin" style={{ color: '#ff6a00' }} />
          <p>Inapakia store zako...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="advertise-container">
      <div className="advertise-header">
        <h2>📢 Broadcasting Center</h2>
        <p>Tangaza biashara yako kwenye jukwaa kubwa la Skyfall</p>
      </div>

      {status.msg && (
        <div className={`status-alert ${status.type}`}>
          {status.type === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span>{status.msg}</span>
          {status.type === "success" && (
            <button onClick={() => setStatus({ type: "", msg: "" })} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer' }}>
              ✕
            </button>
          )}
        </div>
      )}

      <form className="ad-form" onSubmit={handleSubmit}>
        
        {/* STORE SELECTION DROPDOWN */}
        <div className="input-group full-width">
          <label>Chagua Duka Lako <span style={{ color: '#ff6a00' }}>*</span></label>
          <div className="store-select-wrapper">
            <Store size={18} className="store-icon" />
            <select 
              required
              value={formData.store_id}
              onChange={(e) => handleStoreChange(e.target.value)}
              className="store-select"
            >
              <option value="">-- Chagua duka unalotaka kutangaza --</option>
              {stores.map(store => (
                <option key={store.id} value={store.id}>
                  🏪 {store.store_name}
                </option>
              ))}
            </select>
            <ChevronDown size={16} className="dropdown-icon" />
          </div>
          {stores.length > 1 && (
            <small className="form-hint">
              Una store {stores.length}. Chagua moja unayotaka kutangaza.
            </small>
          )}
        </div>

        {/* BUSINESS NAME (Auto-filled from store) */}
        <div className="input-group full-width">
          <label>Jina la Biashara</label>
          <input 
            type="text" 
            required
            value={formData.business_name}
            readOnly
            className="readonly-input"
            style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
          />
          <small className="form-hint">Jina limechukuliwa kutoka duka lako.</small>
        </div>

        {/* AD TYPE */}
        <div className="input-group full-width">
          <label>Aina ya Tangazo</label>
          <select 
            value={formData.ad_type}
            onChange={(e) => setFormData({...formData, ad_type: e.target.value})}
          >
            <option value="banner">Main Hero Banner (Inaonekana juu ya ukurasa)</option>
            <option value="side">Side Ad (Kadi ya Pembeni)</option>
            <option value="popup">Popup Ad (Inaonekana ikifunguka page)</option>
          </select>
        </div>

        {/* DESCRIPTION */}
        <div className="input-group full-width">
          <label>Maelezo ya Tangazo (Broadcasting Text)</label>
          <textarea 
            rows="3" 
            required
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="Andika ujumbe utakaotokea kwenye tangazo lako. Hakikisha ni mafupi na unaovutia..."
          ></textarea>
          <small className="form-hint">
            Ujumbe mzuri unaweza kuongeza mauzo hadi 40%
          </small>
        </div>

        {/* Media Preview Area */}
        <div className="media-preview-container full-width">
          {preview ? (
            <div className="preview-wrapper">
              {file?.type?.startsWith('video') ? (
                <video src={preview} controls className="media-preview-item" />
              ) : (
                <img src={preview} alt="Preview" className="media-preview-item" />
              )}
              <div className="preview-actions">
                <button 
                  type="button" 
                  onClick={() => {
                    if (preview) URL.revokeObjectURL(preview);
                    setPreview(null);
                    setFile(null);
                  }} 
                  className="change-file-btn"
                >
                  Badilisha Faili
                </button>
              </div>
            </div>
          ) : (
            <label className="file-upload-zone">
              <div className="icon-box">
                <UploadCloud size={40} />
              </div>
              <p>Bofya hapa kupakia Picha au Video fupi</p>
              <span>Ingiza file la ubora wa juu (Max 10MB)</span>
              <span className="file-types">Aina: JPEG, PNG, GIF, WebP, MP4</span>
              <input type="file" hidden onChange={handleFileChange} accept="image/*,video/*" />
            </label>
          )}
        </div>

        <button type="submit" className="submit-ad-btn" disabled={loading}>
          {loading ? (
            <><Loader2 size={20} className="animate-spin" /> Inatuma tangazo...</>
          ) : (
            <><Send size={20} /> Tuma Maombi ya Matangazo</>
          )}
        </button>
      </form>

      {/* Info Box */}
      <div className="ad-info-box">
        <h4>📌 Kumbuka:</h4>
        <ul>
          <li>Tangazo lako litapitishwa na Admin ndani ya saa 24</li>
          <li>Hakikisha picha/video ni ya ubora wa juu</li>
          <li>Maelezo yako yanapaswa kuwa ya kweli na sahihi</li>
          <li>Matangazo yanayokiuka sheria yatakataliwa</li>
        </ul>
      </div>
    </div>
  );
}