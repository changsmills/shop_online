import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import StoreForm from "./StoreForm"; 
import "../CreateStore.css";

export default function CreateStore() {
  const navigate = useNavigate();
  const [storeType, setStoreType] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // State ya formData ikiwa na picha na maelezo yote ya ziada
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    location: "",
    phone: "",
    maps_link: "",
    experience: "",
    staff_count: "",
    description: "",
    image1: null, 
    image2: null,
    image3: null
  });

  useEffect(() => {
    document.title = "Business Registration | Changsmills";
  }, []);

  // Function ya kushughulikia mabadiliko kwenye input (Text na Files)
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ 
      ...formData, 
      [name]: files ? files[0] : value 
    });
  };

  // Screen ya mafanikio baada ya duka kusajiliwa
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
          /* SELECTION VIEW - Mtumiaji anachagua Virtual au Physical */
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
          /* FORM VIEW - Mtumiaji anajaza taarifa za duka */
          <StoreForm
            storeType={storeType}
            formData={formData}
            handleChange={handleChange}
            setStoreType={setStoreType}
            isLoading={isLoading}
            setIsLoading={setIsLoading} 
            setIsSuccess={setIsSuccess} 
            navigate={navigate}         
          />
        )}
      </div>
    </div>
  );
}