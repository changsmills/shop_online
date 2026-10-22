import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axiosConfig";
//import "../AdvertisePage.css";
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

   if (loadingStores) {
    return (
      <div className="max-w-[900px] mx-auto my-2.5 md:my-10 p-4 md:p-[30px] bg-white dark:bg-[#1e293b] rounded-xl md:rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.08)] font-sans">
        <div className="skeleton-block w-[400px] max-w-full h-[60px] mb-5 rounded-lg"></div>
        <div className="skeleton-block w-[250px] max-w-full h-5 mb-10 rounded-lg"></div>
        <div className="flex flex-col gap-5">
          <div className="skeleton-block w-full h-[50px] rounded-lg"></div>
          <div className="skeleton-block w-full h-[50px] rounded-lg"></div>
          <div className="skeleton-block w-full h-[50px] rounded-lg"></div>
          <div className="skeleton-block w-full h-[120px] rounded-lg"></div>
          <div className="skeleton-block w-full h-[180px] rounded-xl"></div>
          <div className="skeleton-block w-full h-[50px] rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[900px] mx-auto my-2.5 md:my-10 p-4 md:p-[30px] bg-white dark:bg-[#1e293b] rounded-xl md:rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.08)] font-sans">
      
      <div className="text-center mb-6 md:mb-10 relative">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-[#f0f0f0] dark:bg-[#334155] border-none rounded-full w-9 h-9 md:w-10 md:h-10 flex items-center justify-center cursor-pointer z-10 hover:bg-[#e0e0e0] dark:hover:bg-[#475569] transition-colors"
        >
          <ChevronLeft size={24} className="text-[#333] dark:text-white" />
        </button>
        <div className="pl-[50px]">
          <h2 className="text-xl md:text-[2rem] font-bold text-[#1a1a1a] dark:text-white mb-2.5 m-0">📢 Broadcasting Center</h2>
          <p className="text-sm md:text-base text-[#666] dark:text-[#94a3b8] m-0">Advertise your business on the big Skyfall platform</p>
        </div>
      </div>

      {status.msg && (
        <div className={`col-span-full p-3.5 md:p-[15px] rounded-[10px] flex items-center gap-2.5 mb-5 font-medium animate-[fadeIn_0.3s_ease_forwards] ${status.type === 'success' ? 'bg-[#dcfce7] text-[#166534] border border-[#bbf7d0]' : status.type === 'error' ? 'bg-[#fee2e2] text-[#991b1b] border border-[#fecaca]' : 'bg-[#e0f2fe] text-[#075985] border border-[#bae6fd]'}`}>
          {status.type === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span className="text-sm">{status.msg}</span>
          {status.type === "success" && (
            <button onClick={() => setStatus({ type: "", msg: "" })} className="ml-auto bg-transparent border-none cursor-pointer text-lg font-bold">✕</button>
          )}
        </div>
      )}

      <form className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-[25px]" onSubmit={handleSubmit}>
        {/* STORE SELECTION */}
        <div className="col-span-full flex flex-col gap-2">
          <label className="font-semibold text-[#444] dark:text-[#cbd5e1] text-sm md:text-[0.95rem]">
            Select Your Store <span className="text-brand-orange">*</span>
          </label>
          <div className="relative flex items-center">
            <Store size={18} className="absolute left-3 text-brand-orange z-10" />
            <select
              required
              value={formData.store_id}
              onChange={(e) => handleStoreChange(e.target.value)}
              className="w-full p-2.5 md:p-3.5 pl-[38px] border-[1.5px] border-[#e0e0e0] dark:border-[#334155] rounded-[10px] text-sm md:text-base bg-white dark:bg-[#0f172a] text-black dark:text-white appearance-none cursor-pointer outline-none focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/10 transition-all"
            >
              <option value="">-- Select the store you want to advertise --</option>
              {stores.map((store) => (
                <option key={store.id} value={store.id}>🏪 {store.store_name}</option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-3 text-[#888] pointer-events-none" />
          </div>
          {stores.length > 1 && (
            <small className="text-[11px] text-[#888] mt-1">You have {stores.length} stores. Select one to advertise.</small>
          )}
        </div>

        {/* BUSINESS NAME */}
        <div className="col-span-full flex flex-col gap-2">
          <label className="font-semibold text-[#444] dark:text-[#cbd5e1] text-sm md:text-[0.95rem]">Business Name</label>
          <input
            type="text"
            required
            value={formData.business_name}
            readOnly
            className="w-full p-2.5 md:p-3.5 border-[1.5px] border-[#e0e0e0] dark:border-[#334155] rounded-[10px] text-sm md:text-base bg-[#f5f5f5] dark:bg-[#334155] text-[#666] dark:text-[#94a3b8] cursor-not-allowed outline-none"
          />
          <small className="text-[11px] text-[#888] mt-1">Name is taken from your store.</small>
        </div>

        {/* AD TYPE */}
        <div className="col-span-full flex flex-col gap-2">
          <label className="font-semibold text-[#444] dark:text-[#cbd5e1] text-sm md:text-[0.95rem]">Advertisement Type</label>
          <select
            value={formData.ad_type}
            onChange={(e) => setFormData({ ...formData, ad_type: e.target.value })}
            className="w-full p-2.5 md:p-3.5 border-[1.5px] border-[#e0e0e0] dark:border-[#334155] rounded-[10px] text-sm md:text-base bg-white dark:bg-[#0f172a] text-black dark:text-white outline-none focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/10 transition-all cursor-pointer"
          >
            <option value="banner">Main Hero Banner (Appears at top of page)</option>
            <option value="side">Side Ad (Side Card)</option>
            <option value="popup">Popup Ad (Appears when page opens)</option>
          </select>
        </div>

        {/* DESCRIPTION */}
        <div className="col-span-full flex flex-col gap-2">
          <label className="font-semibold text-[#444] dark:text-[#cbd5e1] text-sm md:text-[0.95rem]">Advertisement Description (Broadcasting Text)</label>
          <textarea
            rows="3"
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Write the message that will appear in your advertisement. Make it short and catchy..."
            className="w-full p-2.5 md:p-3.5 border-[1.5px] border-[#e0e0e0] dark:border-[#334155] rounded-[10px] text-sm md:text-base bg-white dark:bg-[#0f172a] text-black dark:text-white outline-none focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/10 transition-all resize-y"
          />
          <small className="text-[11px] text-[#888] mt-1">A good message can increase sales by up to 40%</small>
        </div>

        {/* MEDIA PREVIEW / UPLOAD */}
        <div className="col-span-full">
          {preview ? (
            <div className="flex flex-col items-center gap-4 p-5 bg-[#f8fafc] dark:bg-[#0f172a] rounded-xl border border-[#e2e8f0] dark:border-[#334155]">
              {file?.type?.startsWith("video") ? (
                <video src={preview} controls className="max-w-full max-h-[250px] rounded-[10px] object-contain" />
              ) : (
                <img src={preview} alt="Preview" className="max-w-full max-h-[250px] rounded-[10px] object-contain" />
              )}
              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    if (preview) URL.revokeObjectURL(preview);
                    setPreview(null);
                    setFile(null);
                  }}
                  className="bg-transparent border border-brand-orange text-brand-orange px-5 py-2 rounded-lg font-semibold cursor-pointer hover:bg-[#fff0e6] transition-colors"
                >
                  Change File
                </button>
              </div>
            </div>
          ) : (
            <label className="col-span-full border-2 border-dashed border-brand-orange bg-[#fff9f5] dark:bg-[#0f172a] p-5 md:p-10 rounded-[15px] text-center cursor-pointer hover:bg-[#fff0e6] dark:hover:bg-[#1a1a1a] flex flex-col items-center gap-3 transition-colors">
              <div className="text-brand-orange bg-white dark:bg-[#1e293b] p-3 rounded-full shadow-[0_4px_10px_rgba(255,102,0,0.2)]">
                <UploadCloud size={40} className="text-brand-orange" />
              </div>
              <p className="font-semibold text-[#333] dark:text-[#e2e8f0] m-0 text-sm md:text-base">Click here to upload an Image or short Video</p>
              <span className="font-medium text-brand-orange text-xs md:text-[0.85rem]">Upload a high quality file (Max 10MB)</span>
              <span className="text-[0.75rem] text-[#999] dark:text-[#64748b]">Types: JPEG, PNG, GIF, WebP, MP4</span>
              <input type="file" hidden onChange={handleFileChange} accept="image/*,video/*" />
            </label>
          )}
        </div>

        <button type="submit" className="col-span-full bg-gradient-to-br from-[#ff8800] to-[#ff6600] text-white p-3.5 md:p-4 border-none rounded-xl text-sm md:text-base font-bold cursor-pointer flex justify-center items-center gap-3 transition-all mt-2.5 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(255,102,0,0.3)] disabled:opacity-70 disabled:cursor-not-allowed" disabled={loading}>
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
      <div className="mt-6 md:mt-[30px] p-4 md:p-5 bg-[#f8fafc] dark:bg-[#0f172a] rounded-xl border-l-4 border-brand-orange">
        <h4 className="m-0 mb-3 text-[#333] dark:text-[#e2e8f0] text-sm md:text-base font-semibold">📌 Remember:</h4>
        <ul className="m-0 pl-5 text-xs md:text-[0.85rem] text-[#666] dark:text-[#94a3b8] space-y-2">
          <li>Your advertisement will be reviewed by Admin within 24 hours</li>
          <li>Make sure the image/video is high quality</li>
          <li>Your description must be true and accurate</li>
          <li>Advertisements that violate rules will be rejected</li>
        </ul>
      </div>
    </div>
  );
}