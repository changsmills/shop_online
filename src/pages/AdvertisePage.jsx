import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axiosConfig";
import "../AdvertisePage.css";
import {
  Send,
  CheckCircle,
  UploadCloud,
  Loader2,
  AlertCircle,
  PlayCircle,
  ImageIcon,
  Store,
  ChevronDown,
  ChevronLeft, // 🔥 ONGEZA HII HAPA
} from "lucide-react";
import toast from "react-hot-toast";

export default function AdvertisePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingStores, setLoadingStores] = useState(true);
  const [status, setStatus] = useState({ type: "", msg: "" });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [cachedAds, setCachedAds] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

  const [formData, setFormData] = useState({
    store_id: "",
    business_name: "",
    ad_type: "banner",
    description: "",
  });

  // ============================================================
  // 1. FETCH USER PROFILE NA STORES
  // ============================================================
  useEffect(() => {
    const fetchUserAndStores = async () => {
      try {
        setLoadingStores(true);

        console.log("🔍 [Fetch] Fetching user profile...");
        const profileRes = await api.get("/profile/");
        const profile = profileRes.data;
        setCurrentUserId(profile.id);
        console.log("✅ [Fetch] Profile ID:", profile.id);

        console.log("🔍 [Fetch] Fetching stores for owner:", profile.id);
        const storesRes = await api.get("/stores/", {
          params: { owner: profile.id, is_active: true },
        });
        const storesData = storesRes.data.results || storesRes.data || [];
        console.log("✅ [Fetch] Stores found:", storesData.length);

        if (storesData.length === 0) {
          toast.error("Huna duka lolote. Tafadhali unda duka kwanza kabla ya kutangaza!");
          setTimeout(() => navigate("/create-store"), 3000);
        } else {
          setStores(storesData);
          if (storesData.length === 1) {
            setSelectedStore(storesData[0]);
            setFormData((prev) => ({
              ...prev,
              store_id: storesData[0].id,
              business_name: storesData[0].store_name,
            }));
          }
        }
      } catch (error) {
        console.error("❌ [Fetch] Error fetching user/stores:", error);
        toast.error("Hitilafu kupata store zako");
      } finally {
        setLoadingStores(false);
      }
    };

    fetchUserAndStores();
  }, [navigate]);

  // ============================================================
  // 2. FETCH ACTIVE ADS
  // ============================================================
  useEffect(() => {
    const fetchAds = async () => {
      try {
        console.log("🔍 [Ads] Fetching active advertisements...");
        const res = await api.get("/advertisements/", {
          params: { status: "active" },
        });
        const data = res.data.results || res.data || [];
        console.log("✅ [Ads] Active ads found:", data.length);

        if (data.length > 0) {
          setCachedAds(data);
          localStorage.setItem("skyfall_ads", JSON.stringify(data));
          localStorage.setItem("skyfall_ads_time", String(Date.now()));
        } else {
          setCachedAds([]);
          localStorage.removeItem("skyfall_ads");
          localStorage.removeItem("skyfall_ads_time");
        }
      } catch (err) {
        console.error("❌ [Ads] Failed to fetch ads:", err);
      }
    };

    fetchAds();
  }, []);

  // ============================================================
  // 3. HELPERS
  // ============================================================
  const isVideoAd = (ad) => {
    if (!ad?.media_url) return false;
    return ad.media_url.match(/\.(mp4|webm|mov)$/i) !== null;
  };

  // ============================================================
  // 4. HANDLE STORE SELECTION
  // ============================================================
  const handleStoreChange = (storeId) => {
    const store = stores.find((s) => s.id === storeId);
    if (store) {
      setSelectedStore(store);
      setFormData((prev) => ({
        ...prev,
        store_id: store.id,
        business_name: store.store_name,
      }));
    }
  };

  // ============================================================
  // 5. HANDLE FILE SELECTION
  // ============================================================
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error("File is too large. It should be under 10MB");
        return;
      }

      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "video/mp4",
        "video/webm",
        "video/quicktime",
      ];
      if (!allowedTypes.includes(selectedFile.type)) {
        toast.error("File type not accepted. Use JPEG, PNG, GIF, WebP, or MP4");
        return;
      }

      setFile(selectedFile);
      if (preview) URL.revokeObjectURL(preview);
      setPreview(URL.createObjectURL(selectedFile));
      setStatus({ type: "info", msg: `Selected: ${selectedFile.name}` });
    }
  };

 // ============================================================
// 6. SUBMIT ADVERTISEMENT - KAMILI NA VALIDATION YA KINA
// ============================================================
const handleSubmit = async (e) => {
  e.preventDefault();

  // ============================================================
  // 6a. VALIDATION ZA MSINGI
  // ============================================================
  console.log("🔍 [Validation] Starting validation...");
  const errors = [];

  // 1. Angalia kama mtumiaji ameingia
  if (!currentUserId) {
    errors.push("Please login to your account first!");
  }

  // 2. Angalia store_id
  if (!formData.store_id) {
       errors.push("Please select the store you want to advertise!");
  } else {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(formData.store_id)) {
      errors.push(`Store ID si sahihi: ${formData.store_id}`);
    }
  }

  // 3. Angalia business_name
  if (!formData.business_name || formData.business_name.trim() === "") {
       errors.push("Business name is required!");
  }

  // 4. Angalia description
  if (!formData.description || formData.description.trim() === "") {
    errors.push("Maelezo ya tangazo yanahitajika!");
  } else if (formData.description.length < 5) {
      errors.push("Advertisement description must be at least 5 characters!");
  }

  // 5. Angalia file
  if (!file) {
      errors.push("Please upload an advertisement image or video!");
  } else {
    // Angalia ukubwa wa file
    if (file.size > 10 * 1024 * 1024) {
      errors.push(`File is too large (${(file.size / 1024 / 1024).toFixed(2)}MB). It should be under 10MB!`);
        }
    
    // Angalia aina ya file
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "video/mp4",
      "video/webm",
      "video/quicktime",
    ];
    if (!allowedTypes.includes(file.type)) {
           errors.push(`File type not accepted: ${file.type}. Use JPEG, PNG, GIF, WebP, or MP4`);
    }
  }

  // 6. Angalia ad_type
  if (!formData.ad_type) {
    errors.push("Advertisement type is required!");
  }

  // 7. Angalia media_type
  if (file && !file.type.startsWith("image") && !file.type.startsWith("video")) {
       errors.push(`Media type unknown: ${file.type}`);
  }

  // ============================================================
  // 6b. ONYESHA ERROR ZOTE ZILIZOPATIKANA
  // ============================================================
  if (errors.length > 0) {
    console.error("❌ [Validation] Validation errors found:", errors);
    errors.forEach(err => toast.error(err));
    setStatus({
      type: "error",
      msg: `Validation errors: ${errors.length} issues found`,
    });
    return;
  }

  console.log("✅ [Validation] All validations passed!");
  console.log("📦 [Payload] Final data to send:", {
    store_id: formData.store_id,
    business_name: formData.business_name,
    ad_type: formData.ad_type,
    description: formData.description,
    media_type: file.type.startsWith("video") ? "video" : "image",
    file_name: file.name,
    file_size: `${(file.size / 1024).toFixed(2)}KB`,
    file_type: file.type,
  });

  // ============================================================
  // 6c. ENDELEA KUTUMA DATA
  // ============================================================
  setLoading(true);
  setStatus({ type: "info", msg: "Inapakia tangazo lako..." });

  try {
    console.log("📤 [Submit] Starting advertisement submission...");

    const formDataObj = new FormData();
    formDataObj.append("store_id", formData.store_id);
    formDataObj.append("business_name", formData.business_name);
    formDataObj.append("ad_type", formData.ad_type);
    formDataObj.append("description", formData.description);
    formDataObj.append("media_type", file.type.startsWith("video") ? "video" : "image");
    formDataObj.append("media_file", file);

    // Debug: Angalia payload
    console.log("📦 [FormData] Payload check:");
    for (let [key, value] of formDataObj.entries()) {
      if (value instanceof File) {
        console.log(`  ✅ ${key}: File - ${value.name} (${value.type}, ${value.size} bytes)`);
      } else {
        console.log(`  ✅ ${key}: ${value}`);
      }
    }

    // Tuma request
    console.log("📤 [Submit] Sending POST to /advertisements/...");
    const response = await api.post("/advertisements/", formDataObj, {
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
      },
    });

    console.log("✅ [Submit] Response status:", response.status);
    console.log("✅ [Submit] Response data:", response.data);

    if (response.status === 201 || response.status === 200) {
      toast.success("Tangazo lako limepokelewa! Litasubiri kuhakikiwa na Admin.");
      setStatus({
        type: "success",
        msg: "Hongera! Tangazo lako limepokelewa na linasubiri kuhakikiwa na Admin.",
      });

      // Reset form
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
    } else {
      console.warn("⚠️ [Submit] Unexpected status:", response.status);
      toast.warning("Tangazo limepokelewa lakini kuna hitilafu ndogo.");
    }
  } catch (error) {
    // ============================================================
    // 6d. ERROR HANDLING
    // ============================================================
    console.error("❌ [Submit] Submission error details:", error);

    if (error.response) {
      const status = error.response.status;
      const errorData = error.response.data;

      console.error("❌ [Error] Status:", status);
      console.error("❌ [Error] Data (Backend error details):", errorData);

      let errorMessage = "";

      if (typeof errorData === "string") {
        errorMessage = errorData;
      } else if (typeof errorData === "object" && errorData !== null) {
        const keys = Object.keys(errorData);

        if (keys.length > 0) {
          const fieldErrors = keys.filter(
            (k) =>
              typeof errorData[k] === "string" ||
              (Array.isArray(errorData[k]) && errorData[k].length > 0)
          );

          if (fieldErrors.length > 0) {
            const errorParts = fieldErrors.map((field) => {
              const msg = Array.isArray(errorData[field])
                ? errorData[field].join(", ")
                : errorData[field];
              return `${field}: ${msg}`;
            });
            errorMessage = errorParts.join("; ");
          } else if (errorData.detail) {
            errorMessage = errorData.detail;
          } else if (errorData.non_field_errors) {
            errorMessage = Array.isArray(errorData.non_field_errors)
              ? errorData.non_field_errors.join(", ")
              : errorData.non_field_errors;
          } else {
            errorMessage = JSON.stringify(errorData, null, 2);
          }
        } else {
          errorMessage = "Hitilafu isiyojulikana kutoka server";
        }
      } else {
        errorMessage = String(errorData);
      }

      // Field-specific error logging
      if (typeof errorData === "object" && errorData !== null) {
        if (errorData.store_id) {
          console.error("❌ [Field Error] store_id:", errorData.store_id);
          console.error("  Available stores:", stores.map((s) => s.id));
        }
        if (errorData.media_file) {
          console.error("❌ [Field Error] media_file:", errorData.media_file);
          console.error("  File details:", file ? { name: file.name, type: file.type, size: file.size } : "No file");
        }
        if (errorData.business_name) {
          console.error("❌ [Field Error] business_name:", errorData.business_name);
        }
        if (errorData.description) {
          console.error("❌ [Field Error] description:", errorData.description);
        }
        if (errorData.media_type) {
          console.error("❌ [Field Error] media_type:", errorData.media_type);
        }
        if (errorData.user) {
          console.error("❌ [Field Error] user:", errorData.user);
          console.error("  Current user ID:", currentUserId);
          console.error("  User authenticated:", !!currentUserId);
        }
      }

        let toastMessage = "";
      switch (status) {
        case 400:
          toastMessage = `Data Error (400): ${errorMessage}`;
          break;
        case 401:
        case 403:
          toastMessage = `Not Allowed (${status}): Please login again.`;
          break;
        case 404:
          toastMessage = `Endpoint not found (404): Check the URL.`;
          break;
        case 500:
          toastMessage = `Server Error (500): Try again later.`;
          break;
        default:
          toastMessage = `Error (${status}): ${errorMessage}`;
      }

      toast.error(toastMessage);
      setStatus({
        type: "error",
        msg: `[${status}] ${errorMessage}`,
      });
    } else if (error.request) {
      console.error("❌ [Error] No response received. Request:", error.request);
      toast.error("Hakuna majibu kutoka Server. Angalia mtandao wako.");
      setStatus({
        type: "error",
        msg: "No response from server. Check your internet connection.",
      });
    } else {
      console.error("❌ [Error] Request setup error:", error.message);
      toast.error("Hitilafu ya mfumo: " + error.message);
      setStatus({ type: "error", msg: "Error: " + error.message });
    }
  } finally {
    setLoading(false);
  }
};

  // ============================================================
  // 7. CLEANUP PREVIEW
  // ============================================================
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  // ============================================================
  // 8. LOADING STATE
  // ============================================================
    // ============================================================
  // 8. SKELETON LOADING (Badala ya Loading)
  // ============================================================
  if (loadingStores) {
    return (
      <div className="advertise-container">
        {/* Skeleton ya Header */}
        <div className="skeleton-block" style={{ width: '400px', height: '60px', marginBottom: '20px', borderRadius: '8px' }}></div>
        <div className="skeleton-block" style={{ width: '250px', height: '20px', marginBottom: '40px', borderRadius: '8px' }}></div>

        {/* Skeleton ya Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="skeleton-block" style={{ width: '100%', height: '50px', borderRadius: '8px' }}></div>
          <div className="skeleton-block" style={{ width: '100%', height: '50px', borderRadius: '8px' }}></div>
          <div className="skeleton-block" style={{ width: '100%', height: '50px', borderRadius: '8px' }}></div>
          <div className="skeleton-block" style={{ width: '100%', height: '120px', borderRadius: '8px' }}></div>
          
          {/* Skeleton ya Media Upload */}
          <div className="skeleton-block" style={{ width: '100%', height: '180px', borderRadius: '12px' }}></div>

          {/* Skeleton ya Submit Button */}
          <div className="skeleton-block" style={{ width: '100%', height: '50px', borderRadius: '8px' }}></div>
        </div>
      </div>
    );
  }

  // ============================================================
  // 9. RENDER
  // ============================================================
  return (
    <div className="advertise-container">
            <div className="advertise-header" style={{ position: 'relative' }}>
        {/* 🔥 BACK ARROW BUTTON */}
        <button
          onClick={() => navigate(-1)} // Inarudi nyuma kwenye ukurasa uliotoka
          style={{
            position: 'absolute',
            left: '0',
            top: '50%',
            transform: 'translateY(-50%)',
            background: '#f0f0f0',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10
          }}
        >
          <ChevronLeft size={24} color="#333" />
        </button>

        {/* Ongeza padding-left ili maandishi yasigongane na button */}
        <div style={{ paddingLeft: '50px' }}>
          <h2>📢 Broadcasting Center</h2>
              <p>Advertise your business on the big Skyfall platform</p>
        </div>
      </div>

      {status.msg && (
        <div className={`status-alert ${status.type}`}>
          {status.type === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span>{status.msg}</span>
          {status.type === "success" && (
            <button
              onClick={() => setStatus({ type: "", msg: "" })}
              style={{
                marginLeft: "auto",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              ✕
            </button>
          )}
        </div>
      )}

      <form className="ad-form" onSubmit={handleSubmit}>
        {/* STORE SELECTION */}
        <div className="input-group full-width">
          <label>
              Select Your Store <span style={{ color: "#ff6a00" }}>*</span>
          </label>
          <div className="store-select-wrapper">
            <Store size={18} className="store-icon" />
            <select
              required
              value={formData.store_id}
              onChange={(e) => handleStoreChange(e.target.value)}
              className="store-select"
            >
             <option value="">-- Select the store you want to advertise --</option>
              {stores.map((store) => (
                <option key={store.id} value={store.id}>
                  🏪 {store.store_name}
                </option>
              ))}
            </select>
            <ChevronDown size={16} className="dropdown-icon" />
          </div>
          {stores.length > 1 && (
            <small className="form-hint">
               You have {stores.length} stores. Select one to advertise.
            </small>
          )}
        </div>

        {/* BUSINESS NAME */}
        <div className="input-group full-width">
          <label>Business Name</label>
          <input
            type="text"
            required
            value={formData.business_name}
            readOnly
            className="readonly-input"
            style={{ backgroundColor: "#f5f5f5", cursor: "not-allowed" }}
          />
            <small className="form-hint">Name is taken from your store.</small>
        </div>

        {/* AD TYPE */}
        <div className="input-group full-width">
              <label>Advertisement Type</label>
          <select
            value={formData.ad_type}
            onChange={(e) => setFormData({ ...formData, ad_type: e.target.value })}
          >
            <option value="banner">Main Hero Banner (Appears at top of page)</option>
            <option value="side">Side Ad (Side Card)</option>
            <option value="popup">Popup Ad (Appears when page opens)</option>

          </select>
        </div>

        {/* DESCRIPTION */}
        <div className="input-group full-width">
          <label>Advertisement Description (Broadcasting Text)</label>
          <textarea
            rows="3"
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Write the message that will appear in your advertisement. Make it short and catchy..."
          />
            <small className="form-hint">A good message can increase sales by up to 40%</small>
        </div>

        {/* MEDIA PREVIEW */}
        <div className="media-preview-container full-width">
          {preview ? (
            <div className="preview-wrapper">
              {file?.type?.startsWith("video") ? (
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
                   Change File
                </button>
              </div>
            </div>
          ) : (
            <label className="file-upload-zone">
              <div className="icon-box">
                <UploadCloud size={40} />
              </div>
               <p>Click here to upload an Image or short Video</p>
              <span>Upload a high quality file (Max 10MB)</span>
              <span className="file-types">Types: JPEG, PNG, GIF, WebP, MP4</span>
              <input type="file" hidden onChange={handleFileChange} accept="image/*,video/*" />
            </label>
          )}
        </div>

        <button type="submit" className="submit-ad-btn" disabled={loading}>
          {loading ? (
            <>
              <Loader2 size={20} className="animate-spin" /> Submitting advertisement...
            </>
          ) : (
            <>
              <Send size={20} /> Submit Advertisement Request
            </>
          )}
        </button>
      </form>

      {/* INFO BOX */}
      <div className="ad-info-box">
        <h4>📌 Remember:</h4>
        <ul>
          <li>Your advertisement will be reviewed by Admin within 24 hours</li>
          <li>Make sure the image/video is high quality</li>
          <li>Your description must be true and accurate</li>
          <li>Advertisements that violate rules will be rejected</li>
        </ul>
      </div>
    </div>
  );
}