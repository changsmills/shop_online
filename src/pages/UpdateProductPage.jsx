import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../axiosConfig";
import { Camera, Trash2, Save, ArrowLeft, Loader2, Plus, X, Edit3, Palette } from "lucide-react";

const UpdateProductPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [storeSubCats, setStoreSubCats] = useState([]);
  const [leafCategories, setLeafCategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedLeafCategory, setSelectedLeafCategory] = useState("");

  const [variations, setVariations] = useState([]);
  const [showVariationForm, setShowVariationForm] = useState(false);
  const [editingVariationId, setEditingVariationId] = useState(null);
  const [variationForm, setVariationForm] = useState({
    color_name: "",
    size_value: "",
    stock_quantity: 0,
    price: "",
    attributes: {},
    color_image_file: null,
    color_image_preview: null,
    marketplace_price: "",
    marketplace_stock: 0,
    marketplace_image_file: null,
    marketplace_image_preview: null,
  });

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
      const headers = { Authorization: `Bearer ${token}` };

      const prodRes = await api.get(`/products/${productId}/`, { headers });
      const productData = prodRes.data;
      setProduct(productData);

      const mediaRes = await api.get(`/product-media/?product_id=${productId}`, { headers });
      setGallery(mediaRes.data.results || mediaRes.data || []);

      const varRes = await api.get(`/product-variations/?product_id=${encodeURIComponent(productId)}`, { headers });
      setVariations(varRes.data.results || varRes.data || []);

      if (productData.store_id) {
        const storeRes = await api.get(`/stores/${productData.store_id}/`, { headers });
        const storeData = storeRes.data;
        setStoreSubCats(storeData.sub_categories || []);
        if (productData.sub_category_id) setSelectedSubCategory(productData.sub_category_id);
        if (productData.leaf_category_id) setSelectedLeafCategory(productData.leaf_category_id);
      }

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

  const handleSubCategoryChange = (e) => {
    const newSubId = e.target.value;
    setSelectedSubCategory(newSubId);
    setSelectedLeafCategory("");
    setLeafCategories([]);
    if (newSubId) fetchLeafCategories(newSubId);
    setProduct(prev => ({ ...prev, sub_category_id: newSubId, leaf_category_id: null }));
  };

  const handleLeafChange = (e) => {
    const leafId = e.target.value;
    setSelectedLeafCategory(leafId);
    setProduct(prev => ({ ...prev, leaf_category_id: leafId }));
  };

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const token = localStorage.getItem("access_token");
      const headers = { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" };

      if (type === "cover") {
        const coverForm = new FormData();
        coverForm.append("cover_image", file);
        const res = await api.patch(`/products/${productId}/`, coverForm, { headers });
        setProduct(prev => ({ ...prev, cover_image: res.data.cover_image }));
      } else {
        const mediaForm = new FormData();
        mediaForm.append("product", productId);
        mediaForm.append("media_type", "image");
        mediaForm.append("media_file", file);
        const res = await api.post(`/product-media/`, mediaForm, { headers });
        setGallery(prev => [...prev, res.data]);
      }
    } catch (err) {
      alert("Error uploading file: " + (err.response?.data?.detail || err.message));
    } finally {
      setUploading(false);
    }
  };

  const deleteMedia = async (id) => {
    if (!window.confirm("Una uhakika unataka kufuta picha hii?")) return;
    try {
      const token = localStorage.getItem("access_token");
      await api.delete(`/product-media/${id}/`, { headers: { Authorization: `Bearer ${token}` } });
      setGallery(gallery.filter((m) => m.id !== id));
    } catch (err) {
      alert("Imeshindwa kufuta picha.");
    }
  };

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
      await api.patch(`/products/${productId}/`, updateData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Taarifa zimehifadhiwa kikamilifu!");
      fetchAllData();
    } catch (err) {
      alert("Kuna tatizo limejitokeza: " + (err.response?.data?.detail || err.message));
    } finally {
      setSaving(false);
    }
  };

  // ========== VARIATION HANDLERS ==========
  const resetVariationForm = () => {
    setVariationForm({
      color_name: "",
      size_value: "",
      stock_quantity: 0,
      price: "",
      attributes: {},
      color_image_file: null,
      color_image_preview: null,
      marketplace_price: "",
      marketplace_stock: 0,
      marketplace_image_file: null,
      marketplace_image_preview: null,
    });
    setEditingVariationId(null);
    setShowVariationForm(false);
  };

  const handleVariationImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVariationForm(prev => ({
        ...prev,
        color_image_file: file,
        color_image_preview: URL.createObjectURL(file)
      }));
    }
  };

  const handleVariationSubmit = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const formData = new FormData();
      formData.append("product", productId);
      formData.append("color_name", variationForm.color_name || "N/A");
      formData.append("size_value", variationForm.size_value || "N/A");
      formData.append("stock_quantity", variationForm.stock_quantity || 0);
      formData.append("price", variationForm.price || 0);
      formData.append("attributes", JSON.stringify(variationForm.attributes || {}));
      if (variationForm.color_image_file) {
        formData.append("color_image_file", variationForm.color_image_file);
      }
      formData.append("marketplace_price", variationForm.marketplace_price || 0);
      formData.append("marketplace_stock", variationForm.marketplace_stock || 0);
      if (variationForm.marketplace_image_file) {
        formData.append("marketplace_image_file", variationForm.marketplace_image_file);
      }
      formData.append("variant_specifications", JSON.stringify(variationForm.attributes || {}));

      let response;
      if (editingVariationId) {
        response = await api.patch(`/product-variations/${editingVariationId}/`, formData, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
        });
        setVariations(variations.map(v => v.id === editingVariationId ? response.data : v));
      } else {
        response = await api.post(`/product-variations/`, formData, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
        });
        setVariations([...variations, response.data]);
      }
      resetVariationForm();
      alert(editingVariationId ? "Variation imesasishwa!" : "Variation imeongezwa!");
    } catch (err) {
      alert("Kuna tatizo: " + (err.response?.data?.detail || err.message));
    }
  };

  const handleDeleteVariation = async (id) => {
    if (!window.confirm("Una uhakika unataka kufuta variation hii?")) return;
    try {
      const token = localStorage.getItem("access_token");
      await api.delete(`/product-variations/${id}/`, { headers: { Authorization: `Bearer ${token}` } });
      setVariations(variations.filter(v => v.id !== id));
    } catch (err) {
      alert("Imeshindwa kufuta variation.");
    }
  };

  const openEditVariation = (variation) => {
    setVariationForm({
      color_name: variation.color_name || "",
      size_value: variation.size_value || "",
      stock_quantity: variation.stock_quantity || 0,
      price: variation.price || "",
      attributes: variation.attributes || {},
      color_image_file: null,
      color_image_preview: variation.color_image_url || null,
      marketplace_price: variation.marketplace_price || "",
      marketplace_stock: variation.marketplace_stock || 0,
      marketplace_image_file: null,
      marketplace_image_preview: variation.marketplace_image || null,
    });
    setEditingVariationId(variation.id);
    setShowVariationForm(true);
  };

  // ========== LOADING STATE (SKELETON) ==========
  if (loading) {
    return (
      <div className="max-w-[1400px] mx-auto p-4 md:p-6 min-h-screen bg-gray-50 dark:bg-gray-900 font-sans pointer-events-none">
        {/* HEADER SKELETON */}
        <div className="flex flex-wrap justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-xl mb-6 shadow-sm border border-gray-200 dark:border-gray-700 gap-3">
          <div className="w-20 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
          <div className="text-center flex flex-col items-center">
            <div className="w-40 h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse" />
            <div className="w-24 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
          <div className="w-28 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* PICHA SKELETON */}
          <div className="bg-white dark:bg-gray-800 p-5 rounded-[20px] border border-gray-200 dark:border-gray-700 shadow-md">
            <div className="w-1/3 h-5 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse" />
            <div className="flex flex-col gap-6">
              <div className="w-full aspect-square bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
              <div className="grid grid-cols-3 gap-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-full aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                ))}
              </div>
            </div>
          </div>

          {/* MAELEZO SKELETON */}
          <div className="bg-white dark:bg-gray-800 p-5 rounded-[20px] border border-gray-200 dark:border-gray-700 shadow-md">
            <div className="w-1/3 h-5 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse" />
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <div className="w-16 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="w-full h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="w-16 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="w-full h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="w-20 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="w-full h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <div className="w-16 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="w-full h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="w-16 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="w-full h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="w-24 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="w-full h-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* VARIATIONS SKELETON */}
        <div className="mt-6 bg-white dark:bg-gray-800 p-5 rounded-[20px] border border-gray-200 dark:border-gray-700 shadow-md">
          <div className="flex justify-between items-center mb-4">
            <div className="w-48 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="w-32 h-9 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
          </div>
          <div className="flex flex-col gap-3">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                  <div className="flex flex-col gap-2">
                    <div className="w-28 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="w-40 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                  <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto p-4 md:p-6 min-h-screen bg-gray-50 dark:bg-gray-900 font-sans">
      
      {/* HEADER */}
      <div className="flex flex-wrap justify-between items-center bg-white dark:bg-gray-800 p-4 md:px-6 rounded-xl mb-6 shadow-sm border border-gray-200 dark:border-gray-700 gap-3">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all active:scale-95"
        >
          <ArrowLeft size={18} /> Rudi
        </button>
        <div className="text-center">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white m-0">Hariri Bidhaa</h2>
          <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest m-0">ID: {productId}</p>
        </div>
        <button 
          onClick={handleUpdateInfo} 
          disabled={saving} 
          className="flex items-center gap-2 bg-[#ff4e00] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#e64600] transition-all shadow-[0_4px_14px_rgba(255,78,0,0.3)] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {saving ? <Loader2 className="animate-spin" size={18} /> : "Hifadhi Zote"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        
        {/* PICHA ZA BIDHAA */}
        <div className="bg-white dark:bg-gray-800 p-5 md:p-6 rounded-[20px] border border-gray-200 dark:border-gray-700 shadow-md transition-transform hover:-translate-y-1">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-5 flex items-center gap-2 m-0">
            <Camera size={16} /> Picha za Bidhaa
          </h3>
          
          <div className="flex flex-col gap-6">
            {/* Main Cover */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Picha Kuu (Cover)</label>
              <div className="relative overflow-hidden rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 aspect-square group">
                <img
                  src={product?.cover_image_url || "https://via.placeholder.com/400x400?text=No+Image"}
                  alt="Main"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer gap-2 font-semibold text-sm">
                  <Camera size={28} />
                  <span>Badilisha Picha</span>
                  <input type="file" hidden onChange={(e) => handleFileUpload(e, "cover")} accept="image/*" />
                </label>
              </div>
            </div>

            {/* Gallery */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Picha za Nyongeza (Gallery)</label>
              <div className="grid grid-cols-3 gap-3 mt-1">
                {gallery.map((m) => (
                  <div key={m.id} className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 aspect-square group">
                    <img src={m.media_url} alt="Gallery" className="w-full h-full object-cover" />
                    <button 
                      onClick={() => deleteMedia(m.id)} 
                      className="absolute top-1.5 right-1.5 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
                {gallery.length < 5 && (
                  <label className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center aspect-square cursor-pointer transition-all hover:border-[#ff4e00] hover:bg-orange-50 dark:hover:bg-orange-950/30 text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-900">
                    {uploading ? <Loader2 className="animate-spin" /> : <Plus />}
                    <input type="file" hidden onChange={(e) => handleFileUpload(e, "gallery")} accept="image/*" />
                  </label>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* MAELEZO YA BIDHAA */}
        <div className="bg-white dark:bg-gray-800 p-5 md:p-6 rounded-[20px] border border-gray-200 dark:border-gray-700 shadow-md transition-transform hover:-translate-y-1">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-5 flex items-center gap-2 m-0">
            Maelezo ya Bidhaa
          </h3>
          
          <div className="flex flex-col gap-5">
            {/* Kategoria */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Kategoria Ndogo (Sub-category)</label>
                <select
                  value={selectedSubCategory}
                  onChange={handleSubCategoryChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:border-[#ff4e00] focus:ring-2 focus:ring-[#ff4e00]/20 appearance-none transition-all"
                >
                  <option value="">-- Chagua Sub-category --</option>
                  {storeSubCats.map((sub) => (
                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Aina Maalum (Leaf Category)</label>
                <select
                  value={selectedLeafCategory}
                  onChange={handleLeafChange}
                  disabled={!selectedSubCategory || leafCategories.length === 0}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:border-[#ff4e00] focus:ring-2 focus:ring-[#ff4e00]/20 appearance-none transition-all disabled:opacity-60 disabled:bg-gray-50 disabled:dark:bg-gray-800"
                >
                  <option value="">-- Chagua Aina --</option>
                  {leafCategories.map((leaf) => (
                    <option key={leaf.id} value={leaf.id}>{leaf.name}</option>
                  ))}
                </select>
                {selectedSubCategory && leafCategories.length === 0 && (
                  <p className="text-xs text-amber-500 mt-1 m-0">Hakuna aina maalum kwa kategoria hii.</p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Jina la Bidhaa</label>
              <input
                value={product?.name || ""}
                onChange={(e) => setProduct({...product, name: e.target.value})}
                placeholder="Mf: iPhone 15 Pro Max"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:border-[#ff4e00] focus:ring-2 focus:ring-[#ff4e00]/20 transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Bei ya Ofa (TZS)</label>
                <input
                  type="number"
                  value={product?.original_price || ""}
                  onChange={(e) => setProduct({...product, original_price: e.target.value})}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:border-[#ff4e00] focus:ring-2 focus:ring-[#ff4e00]/20 transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Bei ya Zamani</label>
                <input
                  type="number"
                  value={product?.price || ""}
                  onChange={(e) => setProduct({...product, price: e.target.value})}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:border-[#ff4e00] focus:ring-2 focus:ring-[#ff4e00]/20 transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Stock (Idadi Iliyopo)</label>
              <input
                type="number"
                value={product?.stock_quantity || ""}
                onChange={(e) => setProduct({...product, stock_quantity: e.target.value})}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:border-[#ff4e00] focus:ring-2 focus:ring-[#ff4e00]/20 transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Maelezo Kamili</label>
              <textarea
                rows="5"
                value={product?.description || ""}
                onChange={(e) => setProduct({...product, description: e.target.value})}
                placeholder="Andika sifa za bidhaa..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:border-[#ff4e00] focus:ring-2 focus:ring-[#ff4e00]/20 transition-all resize-y min-h-[120px]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ========== SEHEMU YA VARIATIONS ========== */}
      <div className="mt-6 bg-white dark:bg-gray-800 p-5 md:p-6 rounded-[20px] border border-gray-200 dark:border-gray-700 shadow-md">
        <div className="flex flex-wrap justify-between items-center mb-5 gap-3">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2 m-0">
            <Palette size={16} /> Rangi na Ukubwa (Variations)
          </h3>
          <button
            onClick={() => { resetVariationForm(); setShowVariationForm(true); }}
            className="flex items-center gap-1.5 bg-[#ff4e00] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#e64600] transition-all shadow-sm active:scale-95"
          >
            <Plus size={14} /> Ongeza Variation
          </button>
        </div>

        {variations.length === 0 ? (
          <p className="text-center text-gray-400 dark:text-gray-500 text-sm py-6 m-0">Hakuna variations bado. Bonyeza "Ongeza Variation" kuweka rangi na ukubwa.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {variations.map((v) => (
              <div key={v.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3.5 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-[#ff4e00] dark:hover:border-[#ff4e00] transition-colors gap-3">
                <div className="flex items-center gap-4">
                  {v.color_image_url ? (
                    <img src={v.color_image_url} alt={v.color_name} className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-[10px] text-gray-500">No img</div>
                  )}
                  <div>
                    <p className="font-semibold text-sm text-gray-900 dark:text-white m-0 mb-0.5">{v.color_name || "N/A"}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 m-0">Ukubwa: {v.size_value || "N/A"} | Stock: {v.stock_quantity} | Bei: TZS {v.price}</p>
                  </div>
                </div>
                <div className="flex gap-1.5 self-end sm:self-auto">
                  <button onClick={() => openEditVariation(v)} className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors">
                    <Edit3 size={16} />
                  </button>
                  <button onClick={() => handleDeleteVariation(v.id)} className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ========== MODAL YA VARIATION FORM ========== */}
      {showVariationForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease]">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-[500px] w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative">
            
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white m-0">
                {editingVariationId ? "Hariri Variation" : "Ongeza Variation"}
              </h3>
              <button onClick={resetVariationForm} className="text-gray-400 hover:text-red-500 bg-transparent border-none cursor-pointer p-1 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Jina la Rangi</label>
                <input
                  value={variationForm.color_name}
                  onChange={(e) => setVariationForm({ ...variationForm, color_name: e.target.value })}
                  placeholder="Mf: Red, Blue, White"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:border-[#ff4e00] focus:ring-2 focus:ring-[#ff4e00]/20 transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Ukubwa (Size)</label>
                <input
                  value={variationForm.size_value}
                  onChange={(e) => setVariationForm({ ...variationForm, size_value: e.target.value })}
                  placeholder="Mf: M, L, XL, 42, N/A"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:border-[#ff4e00] focus:ring-2 focus:ring-[#ff4e00]/20 transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Stock</label>
                  <input
                    type="number"
                    value={variationForm.stock_quantity}
                    onChange={(e) => setVariationForm({ ...variationForm, stock_quantity: parseInt(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:border-[#ff4e00] focus:ring-2 focus:ring-[#ff4e00]/20 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Bei (TZS)</label>
                  <input
                    type="number"
                    value={variationForm.price}
                    onChange={(e) => setVariationForm({ ...variationForm, price: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:border-[#ff4e00] focus:ring-2 focus:ring-[#ff4e00]/20 transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Sifa za Ziada (JSON)</label>
                <textarea
                  rows="2"
                  value={JSON.stringify(variationForm.attributes || {}, null, 2)}
                  onChange={(e) => {
                    try {
                      setVariationForm({ ...variationForm, attributes: JSON.parse(e.target.value) });
                    } catch {
                      // ignore
                    }
                  }}
                  placeholder='{"Material": "Cotton", "Style": "Sport"}'
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:border-[#ff4e00] focus:ring-2 focus:ring-[#ff4e00]/20 transition-all font-mono min-h-[60px]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Picha ya Rangi</label>
                <div className="flex items-center gap-4 flex-wrap">
                  {variationForm.color_image_preview ? (
                    <img src={variationForm.color_image_preview} alt="Color" className="w-16 h-16 rounded-xl object-cover border-2 border-gray-200 dark:border-gray-700" />
                  ) : (
                    <div className="w-16 h-16 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center text-[10px] text-gray-400 bg-gray-50 dark:bg-gray-900">No img</div>
                  )}
                  <label className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg text-xs font-medium cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                    Chagua Picha
                    <input type="file" hidden onChange={handleVariationImageChange} accept="image/*" />
                  </label>
                </div>
              </div>

              <div className="flex gap-3 mt-2 pt-4 border-t border-gray-100 dark:border-gray-700">
                <button 
                  onClick={resetVariationForm} 
                  className="flex-1 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl font-semibold text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Ghairi
                </button>
                <button 
                  onClick={handleVariationSubmit} 
                  className="flex-1 py-2.5 bg-[#ff4e00] text-white rounded-xl font-semibold text-sm hover:bg-[#e64600] transition-colors shadow-sm active:scale-95"
                >
                  {editingVariationId ? "Sasisha" : "Hifadhi"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateProductPage;