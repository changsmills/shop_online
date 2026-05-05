import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Muhimu kwa URL na Back button
import { supabase } from "../supabaseClient";
import { Camera, Trash2, Save, ArrowLeft, Loader2, Plus, X } from "lucide-react";
import "../UpdateProduct.css";

const UpdateProductPage = () => {
  // 1. Pata productId kutoka kwenye URL (e.g., /update/123)
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (productId) {
      fetchData();
    } else {
      alert("ID ya bidhaa haijapatikana!");
      navigate(-1);
    }
  }, [productId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Vuta Taarifa za Bidhaa
      const { data: prod, error: prodError } = await supabase
        .from("products_engines")
        .select("*")
        .eq("id", productId)
        .single();

      if (prodError) throw prodError;

      // 2. Vuta Picha za Gallery
      const { data: med, error: medError } = await supabase
        .from("product_media")
        .select("*")
        .eq("product_id", productId);

      if (medError) throw medError;

      setProduct(prod);
      setGallery(med || []);
    } catch (error) {
      console.error("Error fetching data:", error.message);
      alert("Imeshindwa kuvuta data za bidhaa.");
    } finally {
      setLoading(false);
    }
  };

 const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `products/${productId}/${fileName}`;

    try {
      // 1. Upload kwenda Bucket (Hakikisha jina ni picha_za_duka)
      const { error: uploadError } = await supabase.storage
        .from("picha_za_duka")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Pata Public URL (LAZIMA iwe picha_za_duka pia)
      const { data: { publicUrl } } = supabase.storage
        .from("picha_za_duka") 
        .getPublicUrl(filePath);

      if (type === "cover") {
        // Hapa inafanya UPDATE kwenye table ya bidhaa
        const { error: updateError } = await supabase
          .from("products_engines")
          .update({ cover_image: publicUrl })
          .eq("id", productId);
        
        if (updateError) throw updateError;
        setProduct({ ...product, cover_image: publicUrl });
      } else {
        // Hapa inaongeza picha MPYA kwenye gallery ya hiyo bidhaa husika
        const { data: newMedia, error: insertError } = await supabase
          .from("product_media")
          .insert([{ product_id: productId, media_url: publicUrl, media_type: "image" }])
          .select()
          .single();
        
        if (insertError) throw insertError;
        setGallery([...gallery, newMedia]);
      }
    } catch (err) {
      alert("Error uploading file: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const deleteMedia = async (id) => {
    if (!window.confirm("Una uhakika unataka kufuta picha hii?")) return;
    
    const { error } = await supabase.from("product_media").delete().eq("id", id);
    if (!error) {
      setGallery(gallery.filter((m) => m.id !== id));
    } else {
      alert("Imeshindwa kufuta picha.");
    }
  };

const handleUpdateInfo = async () => {
  setSaving(true);
  try {
    // 1. Angalia kama kuna mabadiliko kwenye original_price
    // Tunalinganisha bei mpya iliyo kwenye 'product' state na ile ya zamani iliyotoka DB
    const isPriceChanged = parseFloat(product.original_price) !== parseFloat(product.old_original_price_from_db);

    if (isPriceChanged && product.offer_started_at) {
      const mwanzo = new Date(product.offer_started_at).getTime();
      const sasa = new Date().getTime();
      const masaa24 = 24 * 60 * 60 * 1000;

      // Kama bado saa 24 hazijapita, zuia mabadiliko
      if ((sasa - mwanzo) < masaa24) {
        const masaaYaliyobaki = Math.ceil((masaa24 - (sasa - mwanzo)) / (1000 * 60 * 60));
        alert(`Hauruhusiwi kubadilisha bei ya ofa mpaka saa 24 zipite. Bado saa ${masaaYaliyobaki} hivi.`);
        setSaving(false);
        return; // Acha kuendelea na update
      }
    }

    // 2. Kama amepita kigezo cha muda (au hajabadilisha bei), fanya update
    const updateData = {
      name: product.name,
      price: product.price,
      original_price: product.original_price,
      stock_quantity: product.stock_quantity,
      description: product.description
    };

    // Kama amebadilisha bei na muda ulishapita, tuna-reset 'offer_started_at' kuwa sasa
    if (isPriceChanged) {
      updateData.offer_started_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from("products_engines")
      .update(updateData)
      .eq("id", productId);

    if (error) throw error;
    
    alert("Taarifa zimehifadhiwa kikamilifu!");
    fetchData(); // Refresh data ili kupata muda mpya wa ofa kama uli-update

  } catch (err) {
    alert("Kuna tatizo limejitokeza: " + err.message);
  } finally {
    setSaving(false);
  }
};

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <p className="mt-2 text-gray-500">Inapakia taarifa za bidhaa...</p>
      </div>
    );
  }

  return (
    <div className="up-container animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="up-header">
        <button onClick={() => navigate(-1)} className="up-back-btn">
          <ArrowLeft size={18}/> Rudi
        </button>
        <div className="text-center">
          <h2 className="font-bold text-lg">Hariri Bidhaa</h2>
          <p className="text-[10px] text-gray-400 uppercase tracking-tighter">ID: {productId}</p>
        </div>
        <button onClick={handleUpdateInfo} disabled={saving} className="up-save-btn">
          {saving ? <Loader2 className="animate-spin" size={18} /> : "Hifadhi Zote"}
        </button>
      </div>

      <div className="up-content">
        {/* MKONO WA KUSHOTO: PICHA */}
        <div className="up-card">
          <h3 className="flex items-center gap-2 mb-4 text-sm font-semibold">
            <Camera size={16} /> Picha za Bidhaa
          </h3>
          
          <div className="space-y-6">
            {/* Main Cover */}
            <div>
              <label className="text-xs text-gray-500 mb-2 block">Picha Kuu (Cover)</label>
              <div className="up-main-img group relative overflow-hidden rounded-xl border-2 border-dashed border-gray-200">
                <img 
                  src={product?.cover_image || "https://via.placeholder.com/400x400?text=No+Image"} 
                  alt="Main" 
                  className="w-full h-64 object-cover"
                />
                <label className="up-edit-label absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera size={28} />
                  <span className="text-xs mt-2">Badilisha Picha</span>
                  <input type="file" hidden onChange={(e) => handleFileUpload(e, "cover")} accept="image/*" />
                </label>
              </div>
            </div>

            {/* Gallery */}
            <div>
              <label className="text-xs text-gray-500 mb-2 block">Picha za Nyongeza (Gallery)</label>
              <div className="up-gallery-grid grid grid-cols-3 gap-3">
                {gallery.map((m) => (
                  <div key={m.id} className="up-gallery-item relative group rounded-lg overflow-hidden border border-gray-100">
                    <img src={m.media_url} alt="Gallery" className="w-full h-24 object-cover" />
                    <button 
                      onClick={() => deleteMedia(m.id)} 
                      className="up-del-btn absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
                
                {gallery.length < 5 && (
                  <label className="up-add-box border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center h-24 cursor-pointer hover:bg-gray-50 transition-colors">
                    {uploading ? <Loader2 className="animate-spin text-blue-500" /> : <Plus className="text-gray-400" />}
                    <input type="file" hidden onChange={(e) => handleFileUpload(e, "gallery")} accept="image/*" />
                  </label>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* MKONO WA KULIA: FOMU YA DATA */}
        <div className="up-card">
          <h3 className="mb-4 text-sm font-semibold">Maelezo ya Bidhaa</h3>
          <div className="up-form space-y-4">
            <div className="up-input-group">
              <label className="text-xs font-medium text-gray-600 block mb-1">Jina la Bidhaa</label>
              <input 
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={product?.name || ""} 
                onChange={(e) => setProduct({...product, name: e.target.value})} 
                placeholder="Mf: iPhone 15 Pro Max"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="up-input-group">
                <label className="text-xs font-medium text-gray-600 block mb-1">Bei ya Ofa (TZS)</label>
                <input 
                  type="number" 
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={product?.original_price || ""} 
                  onChange={(e) => setProduct({...product, original_price: e.target.value})} 
                />
              </div>
              <div className="up-input-group">
                <label className="text-xs font-medium text-gray-600 block mb-1">Bei ya Zamani</label>
                <input 
                  type="number" 
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={product?.price || ""} 
                  onChange={(e) => setProduct({...product, price: e.target.value})} 
                />
              </div>
            </div>

            <div className="up-input-group">
              <label className="text-xs font-medium text-gray-600 block mb-1">Stock (Idadi Iliyopo)</label>
              <input 
                type="number" 
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={product?.stock_quantity || ""} 
                onChange={(e) => setProduct({...product, stock_quantity: e.target.value})} 
              />
            </div>

            <div className="up-input-group">
              <label className="text-xs font-medium text-gray-600 block mb-1">Maelezo Kamili</label>
              <textarea 
                rows="5" 
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                value={product?.description || ""} 
                onChange={(e) => setProduct({...product, description: e.target.value})}
                placeholder="Andika sifa za bidhaa..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProductPage;