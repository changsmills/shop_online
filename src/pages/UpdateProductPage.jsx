import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../axiosConfig"; // 🔥 Tumia api yako!
import { Camera, Trash2, Save, ArrowLeft, Loader2, Plus, X } from "lucide-react";
import "../UpdateProduct.css";

const UpdateProductPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // ========== STATES ZA KATEGORIA ==========
  const [storeSubCats, setStoreSubCats] = useState([]);      // Subcategories za duka (ili kuchagua)
  const [leafCategories, setLeafCategories] = useState([]);  // Leaf categories kwa subcategory iliyochaguliwa
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedLeafCategory, setSelectedLeafCategory] = useState("");

  // ========== FETCH DATA ==========
  useEffect(() => {
    if (productId) {
      fetchAllData();
    } else {
      alert("ID ya bidhaa haijapatikana!");
      navigate(-1);
    }
  }, [productId]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");

      // 1. Pata bidhaa yenyewe
      const prodRes = await api.get(`/products/${productId}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const productData = prodRes.data;
      setProduct(productData);

      // 2. Pata gallery (media)
      const mediaRes = await api.get(`/product-media/?product_id=${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGallery(mediaRes.data.results || mediaRes.data || []);

      // 3. Pata subcategories za duka (kwa dropdown) - tunachukua kutoka store iliyopo
      if (productData.store_id) {
        const storeRes = await api.get(`/stores/${productData.store_id}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const storeData = storeRes.data;
        // Subcategories zipo kwenye 'sub_categories' (kutoka serializer)
        setStoreSubCats(storeData.sub_categories || []);

        // Set subcategory iliyopo sasa
        if (productData.sub_category_id) {
          setSelectedSubCategory(productData.sub_category_id);
        }
        // Set leaf category iliyopo
        if (productData.leaf_category_id) {
          setSelectedLeafCategory(productData.leaf_category_id);
        }
      }

      // 4. Fetch leaf categories kulingana na subcategory iliyochaguliwa
      if (productData.sub_category_id) {
        fetchLeafCategories(productData.sub_category_id);
      }

    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Imeshindwa kuvuta data za bidhaa.");
    } finally {
      setLoading(false);
    }
  };

  // ========== FETCH LEAF CATEGORIES KWA SUB ==========
  const fetchLeafCategories = async (subCatId) => {
    try {
      const token = localStorage.getItem("access_token");
      const res = await api.get(`/leaf-categories/?sub_category=${subCatId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLeafCategories(res.data.results || res.data || []);
    } catch (error) {
      console.error("Error fetching leaf categories:", error);
      setLeafCategories([]);
    }
  };

  // ========== HANDLE SUB CATEGORY CHANGE ==========
  const handleSubCategoryChange = (e) => {
    const newSubId = e.target.value;
    setSelectedSubCategory(newSubId);
    setSelectedLeafCategory(""); // Reset leaf
    setLeafCategories([]);       // Clear previous leafs
    if (newSubId) {
      fetchLeafCategories(newSubId);
    }
    // Update product state (kwa ajili ya save)
    setProduct(prev => ({ ...prev, sub_category_id: newSubId, leaf_category_id: null }));
  };

  // ========== HANDLE LEAF CATEGORY CHANGE ==========
  const handleLeafChange = (e) => {
    const leafId = e.target.value;
    setSelectedLeafCategory(leafId);
    setProduct(prev => ({ ...prev, leaf_category_id: leafId }));
  };

  // ========== FILE UPLOAD (COVER & GALLERY) ==========
  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("product", productId);  // Kwa gallery, foreign key

    try {
      const token = localStorage.getItem("access_token");
      const headers = { Authorization: `Bearer ${token}` };

      if (type === "cover") {
        // 1. Tuma cover image update kwenye products_engines
        const coverForm = new FormData();
        coverForm.append("cover_image", file);
        const res = await api.patch(`/products/${productId}/`, coverForm, {
          headers: { ...headers, "Content-Type": "multipart/form-data" }
        });
        setProduct(prev => ({ ...prev, cover_image: res.data.cover_image }));
      } else {
        // 2. Tuma gallery image kwenye product-media
        formData.append("media_type", "image");
        formData.append("media_url", file); // Backend inapaswa kushughulikia upload ya file kwa Cloudinary
        // Kumbuka: Unaweza kutumia media_url kuwa file, na serializers zishughulikie.
        // Kama backend inatarajia file, tumia 'media_file' au 'file'.
        // Hapa nafikiri unatuma file kama 'media_url' – lakini angalia serializer yako.
        // Kwa sasa natumia 'media_file' kama jina la field kwa file.
        const mediaForm = new FormData();
        mediaForm.append("product", productId);
        mediaForm.append("media_type", "image");
        mediaForm.append("media_file", file); // 🔥 Badilisha jina kulingana na serializer yako!
        
        const res = await api.post(`/product-media/`, mediaForm, {
          headers: { ...headers, "Content-Type": "multipart/form-data" }
        });
        setGallery(prev => [...prev, res.data]);
      }
    } catch (err) {
      alert("Error uploading file: " + (err.response?.data?.detail || err.message));
    } finally {
      setUploading(false);
    }
  };

  // ========== DELETE MEDIA ==========
  const deleteMedia = async (id) => {
    if (!window.confirm("Una uhakika unataka kufuta picha hii?")) return;
    try {
      const token = localStorage.getItem("access_token");
      await api.delete(`/product-media/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGallery(gallery.filter((m) => m.id !== id));
    } catch (err) {
      alert("Imeshindwa kufuta picha.");
    }
  };

  // ========== UPDATE BIDHAA (INAFANYA PATCH) ==========
  const handleUpdateInfo = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("access_token");
      const updateData = {
        name: product.name,
        price: product.price,
        original_price: product.original_price,
        stock_quantity: product.stock_quantity,
        description: product.description,
        sub_category_id: product.sub_category_id,
        leaf_category_id: product.leaf_category_id,
      };

      // Tumia PATCH badala ya PUT (kama unataka kubadilisha sehemu)
      await api.patch(`/products/${productId}/`, updateData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert("Taarifa zimehifadhiwa kikamilifu!");
      fetchAllData(); // Refresh data
    } catch (err) {
      alert("Kuna tatizo limejitokeza: " + (err.response?.data?.detail || err.message));
    } finally {
      setSaving(false);
    }
  };

  // ========== LOADING STATE ==========
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
            {/* ========== KATEGORIA ZA BIDHAA ========== */}
            <div className="grid grid-cols-2 gap-4">
              <div className="up-input-group">
                <label className="text-xs font-medium text-gray-600 block mb-1">Kategoria Ndogo (Sub-category)</label>
                <select
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={selectedSubCategory}
                  onChange={handleSubCategoryChange}
                >
                  <option value="">-- Chagua Sub-category --</option>
                  {storeSubCats.map((sub) => (
                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                  ))}
                </select>
              </div>

              <div className="up-input-group">
                <label className="text-xs font-medium text-gray-600 block mb-1">Aina Maalum (Leaf Category)</label>
                <select
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={selectedLeafCategory}
                  onChange={handleLeafChange}
                  disabled={!selectedSubCategory || leafCategories.length === 0}
                >
                  <option value="">-- Chagua Aina --</option>
                  {leafCategories.map((leaf) => (
                    <option key={leaf.id} value={leaf.id}>{leaf.name}</option>
                  ))}
                </select>
                {selectedSubCategory && leafCategories.length === 0 && (
                  <p className="text-xs text-orange-500 mt-1">Hakuna aina maalum kwa kategoria hii.</p>
                )}
              </div>
            </div>

            {/* ========== DATA ZINGINE ========== */}
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