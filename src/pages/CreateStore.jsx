import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axiosConfig"; // 🔥 Tumia api
import StoreForm from "./StoreForm"; 
//import "../CreateStore.css";

export default function CreateStore() {
  const navigate = useNavigate();
  const [storeType, setStoreType] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    category_id: "",
    sub_category_ids: [],
    business_type: "",
    phone: "",
    email: "",
    location: "",
    city: "",
    maps_link: "",
    description: "",
    experience: "",
    staff_count: "",
    moq: "",
    lead_time: "",
    supply_capacity: "",
    packaging_type: "",
    
    logo: null,
    banner: null,
    tin_image: null,
    image1: null,
    image2: null,
    image3: null,
    
    whatsapp: "",
    instagram: "",
    tiktok: "",
    twitter: "",
    youtube: "",
    
    tin_number: "",
    agreed_to_terms: false
  });

  useEffect(() => {
    document.title = "Business Registration | Changsmills";
  }, []);

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else if (files) {
      setFormData({ ...formData, [name]: files[0] }); 
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmitToDjango = async (e) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        alert("Please login first!");
        setIsLoading(false);
        return;
      }

      const submissionData = new FormData();
      
      submissionData.append("store_name", formData.name);
      if (formData.category_id) submissionData.append("category", formData.category_id);
      
      submissionData.append("sub_category_ids", JSON.stringify(formData.sub_category_ids || []));
      submissionData.append("business_type", formData.business_type || "");
      submissionData.append("phone_number", formData.phone);
      submissionData.append("email", formData.email || "");
      submissionData.append("physical_address", formData.location);
      submissionData.append("city", formData.city || "Dar es Salaam");
      submissionData.append("google_maps_url", formData.maps_link);
      submissionData.append("description", formData.description);
      submissionData.append("experience", formData.experience || "");
      submissionData.append("staff_count", formData.staff_count || "");
      submissionData.append("moq", formData.moq || "");
      submissionData.append("lead_time", formData.lead_time || "");
      submissionData.append("supply_capacity", formData.supply_capacity || "");
      submissionData.append("packaging_type", formData.packaging_type || "");

      submissionData.append("whatsapp_number", formData.whatsapp || formData.phone);
      submissionData.append("instagram_handle", formData.instagram || "");
      submissionData.append("tiktok_handle", formData.tiktok || "");
      submissionData.append("twitter_handle", formData.twitter || "");
      submissionData.append("youtube_link", formData.youtube || "");

      if (formData.logo) submissionData.append("store_logo", formData.logo);
      if (formData.banner) submissionData.append("store_banner", formData.banner);
      if (formData.tin_image) submissionData.append("tin_image", formData.tin_image);
      
           // 🔥 BADILISHA HAPA: Tumia 'office_images' kama list
      const officeImages = [formData.image1, formData.image2, formData.image3].filter(Boolean);
      officeImages.forEach((file) => {
          if (file) {
              submissionData.append("office_images", file);
          }
      });

      // 🔥 MUHIMU SANA: Lazima uweke status kuwa 'pending' ili ukurasa wa kusubiri uonekane!
      submissionData.append("status", "pending");
      submissionData.append("verification_status", "pending");

      const response = await api.post(
        "/stores/",
        submissionData,
        { headers: { "Authorization": `Bearer ${token}` } }
      );

      if (response.status === 201) {
        setIsSuccess(true);
        // 🔥 BADILISHA HAPA: Enda kwenye ukurasa wa kusubiri badala ya Dashboard!
        setTimeout(() => navigate(`/store-pending/${response.data.id}`), 2000);
      }

    } catch (error) {
      console.error("Error creating store:", error.response?.data || error.message);
      alert("An error occurred: " + (error.response?.data?.detail || "Please try again"));
    } finally {
      setIsLoading(false);
    }
  };

   // ===== SUCCESS SCREEN =====
  if (isSuccess) {
    return (
      <div className="font-sans min-h-screen bg-gray-50 dark:bg-[#0f172a] px-4 sm:px-5 pt-[100px] pb-10 flex justify-center items-start">
        <div className="bg-white dark:bg-[#1e293b] p-8 sm:p-12 rounded-3xl text-center shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] dark:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.6)] max-w-[500px] mx-auto border border-gray-100 dark:border-slate-700">
          <div className="text-6xl mb-5">🏢</div>
          <h2 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-[#ff6a00] to-[#ffb800] bg-clip-text text-transparent mb-3">
            Store Registered!
          </h2>
          <p className="text-sm sm:text-base text-gray-500 dark:text-slate-400 mb-5">
            Preparing your store: <strong className="text-gray-800 dark:text-white">{formData.name}</strong>...
          </p>
          <div className="bg-gray-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden mt-6">
            <div className="h-full bg-[#ff6a00] w-0 animate-[fill_2.5s_forwards]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans min-h-screen bg-gray-50 dark:bg-[#0f172a] px-4 sm:px-5 pt-[100px] sm:pt-[120px] pb-10 relative overflow-x-hidden flex justify-center">

      {/* ===== Background Decorations ===== */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[400px] h-[400px] bg-orange-500/8 blur-[80px] rounded-full -top-[100px] -left-[100px]" />
        <div className="absolute w-[300px] h-[300px] bg-blue-500/8 blur-[80px] rounded-full -bottom-[50px] -right-[50px]" />
      </div>

      <div className="w-full max-w-[1000px] relative z-[1]">

        {!storeType ? (
          /* ===== SELECTION VIEW ===== */
          <div className="animate-[fadeIn_0.4s_ease-in-out]">
            <div className="text-center mb-8 sm:mb-10">
              <h1 className="text-2xl sm:text-3xl md:text-[2.8rem] font-extrabold text-gray-900 dark:text-white tracking-tight mb-2.5">
                Start Your Business
              </h1>
              <p className="text-sm sm:text-base md:text-[1.1rem] text-gray-500 dark:text-slate-400">
                Choose the business model that suits you
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4 sm:gap-5 md:gap-[30px] mt-8 sm:mt-10 md:mt-[50px]">
              <div
                onClick={() => setStoreType("physical")}
                className="bg-white dark:bg-[#1e293b] px-5 sm:px-6 md:px-[25px] py-8 sm:py-10 md:py-[40px] rounded-3xl border border-gray-200 dark:border-slate-700 text-center cursor-pointer transition-all duration-[400ms] ease-[cubic-bezier(0.175,0.885,0.32,1.275)] relative flex flex-col items-center hover:-translate-y-3 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.1)] hover:border-[#ff6a00] active:scale-[0.98] [-webkit-tap-highlight-color:transparent]"
              >
                <div className="absolute top-4 right-4 bg-gray-100 dark:bg-slate-700 px-3 py-1.5 rounded-full text-xs font-bold text-gray-600 dark:text-slate-300">
                  Free Trial
                </div>

                <div className="text-[2.5rem] sm:text-[3rem] md:text-[4rem] bg-gray-50 dark:bg-slate-700 w-[70px] h-[70px] sm:w-[85px] sm:h-[85px] md:w-[100px] md:h-[100px] flex items-center justify-center rounded-2xl mb-4 sm:mb-5 md:mb-[25px]">
                  🌐
                </div>

                <h3 className="text-lg sm:text-xl md:text-[1.5rem] font-bold mb-3 text-gray-900 dark:text-white">
                  VIRTUAL STORE
                </h3>
                <p className="text-xs sm:text-sm md:text-[0.95rem] text-gray-500 dark:text-slate-400 leading-relaxed mb-5 sm:mb-6 md:mb-[30px]">
                  Reach thousands of customers without boundaries anywhere on Skyfall.com.{" "}
                  <strong className="text-gray-800 dark:text-white">Free for now.</strong>
                </p>

                <button className="px-5 sm:px-6 md:px-[30px] py-2.5 sm:py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 font-semibold text-sm sm:text-base text-gray-900 dark:text-white cursor-pointer transition-colors duration-300 group-hover:bg-[#ff6a00] group-hover:text-white group-hover:border-[#ff6a00]">
                  Start Free Trial
                </button>
              </div>
            </div>
          </div>
        ) : (
          <StoreForm
            storeType={storeType}
            formData={formData}
            handleChange={handleChange}
            setStoreType={setStoreType}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            setIsSuccess={setIsSuccess}
            navigate={navigate}
            handleSubmit={handleSubmitToDjango}
          />
        )}
      </div>
    </div>
  );
}