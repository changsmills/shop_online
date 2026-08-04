import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axiosConfig"; // 🔥 Tumia api
import StoreForm from "./StoreForm"; 
import "../CreateStore.css";

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
        alert("Tafadhali ingia kwanza!");
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

      const response = await api.post(
        "/stores/",
        submissionData,
        { headers: { "Authorization": `Bearer ${token}` } }
      );

      if (response.status === 201) {
        setIsSuccess(true);
        setTimeout(() => navigate(`/dashboard/physical/${response.data.id}`), 2000);
      }
    } catch (error) {
      console.error("Error creating store:", error.response?.data || error.message);
      alert("Kuna kosa limejitokeza: " + (error.response?.data?.detail || "Tafadhali jaribu tena"));
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="create-store-page">
        <div className="premium-success-card">
          <div className="success-lottie">🏢</div>
          <h2 className="gradient-text">Duka Limesajiliwa!</h2>
          <p>Mfumo unatayarisha duka lako la <strong>{formData.name}</strong>...</p>
          <div className="progress-bar-container">
            <div className="progress-fill"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="create-store-page">
      <div className="bg-decoration">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
      </div>

      <div className="main-container">
        {!storeType ? (
          <div className="selection-view animate-fade">
            <div className="text-center mb-5">
              <h1 className="hero-title">Anzisha Biashara Yako</h1>
              <p className="hero-subtitle">Chagua mfumo wa uendeshaji unaofaa biashara yako</p>
            </div>

            <div className="card-grid">
              <div onClick={() => setStoreType("physical")} className="choice-card-premium virtual">
                <div className="badge">Rahisi</div>
                <div className="icon-wrapper">🌐</div>
                <h3>VIRTUAL STORE</h3>
                <p>Duka lenye Kuwafikia maelfu ya wateja no boundary popote tutafika Skyfall.com.</p>
                <button className="select-btn">Chagua Hii</button>
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