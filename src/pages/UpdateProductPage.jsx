import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../axiosConfig";
import { Camera, Trash2, Save, ArrowLeft, Loader2, Plus, X, Edit3, Palette } from "lucide-react";
import "../UpdateProduct.css"; // <--- HAPA UNAINGIZA CSS

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

  // ========== FETCH DATA (same as before) ==========
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

      const cleanProductId = productId.replace(/-/g, ''); // 🔥 Ondoa hyphens
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

  // ========== VARIATION HANDLERS (same) ==========
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
      <div className="up-container up-skeleton-wrapper">
        {/* 1. HEADER SKELETON */}
        <div className="up-header">
          <div className="up-skeleton up-skeleton-back-btn"></div>
          <div className="up-header-title">
            <div className="up-skeleton up-skeleton-title"></div>
            <div className="up-skeleton up-skeleton-subtitle"></div>
          </div>
          <div className="up-skeleton up-skeleton-save-btn"></div>
        </div>

        <div className="up-content">
          {/* 2. PICHA ZA BIDHAA SKELETON */}
          <div className="up-card">
            <div className="up-skeleton up-skeleton-section-title"></div>
            <div className="up-media-section skeleton-media-section">
              <div className="up-main-img-wrapper">
                <div className="up-skeleton up-skeleton-main-img"></div>
              </div>
              <div className="up-gallery-wrapper">
                <div className="up-gallery-grid skeleton-gallery-grid">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="up-skeleton up-skeleton-gallery-img"></div>
                  ))}
                  <div className="up-skeleton up-skeleton-add-box"></div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. MAELEZO YA BIDHAA SKELETON */}
          <div className="up-card">
            <div className="up-skeleton up-skeleton-section-title"></div>
            <div className="up-form">
              <div className="up-form-row">
                <div className="up-input-group">
                  <div className="up-skeleton up-skeleton-label"></div>
                  <div className="up-skeleton up-skeleton-select"></div>
                </div>
                <div className="up-input-group">
                  <div className="up-skeleton up-skeleton-label"></div>
                  <div className="up-skeleton up-skeleton-select"></div>
                </div>
              </div>
              <div className="up-input-group">
                <div className="up-skeleton up-skeleton-label"></div>
                <div className="up-skeleton up-skeleton-input"></div>
              </div>
              <div className="up-form-row">
                <div className="up-input-group">
                  <div className="up-skeleton up-skeleton-label"></div>
                  <div className="up-skeleton up-skeleton-input"></div>
                </div>
                <div className="up-input-group">
                  <div className="up-skeleton up-skeleton-label"></div>
                  <div className="up-skeleton up-skeleton-input"></div>
                </div>
              </div>
              <div className="up-input-group">
                <div className="up-skeleton up-skeleton-label"></div>
                <div className="up-skeleton up-skeleton-textarea"></div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. VARIATIONS SKELETON */}
        <div className="up-card up-variations-card">
          <div className="up-variations-header">
            <div className="up-skeleton up-skeleton-section-title"></div>
            <div className="up-skeleton up-skeleton-add-btn"></div>
          </div>
          <div className="up-variations-list skeleton-variations-list">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="up-variation-item">
                <div className="up-variation-info">
                  <div className="up-skeleton up-skeleton-variation-img"></div>
                  <div>
                    <div className="up-skeleton up-skeleton-variation-name"></div>
                    <div className="up-skeleton up-skeleton-variation-details"></div>
                  </div>
                </div>
                <div className="up-variation-actions">
                  <div className="up-skeleton up-skeleton-action-btn"></div>
                  <div className="up-skeleton up-skeleton-action-btn"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="up-container">
      {/* HEADER */}
      <div className="up-header">
        <button onClick={() => navigate(-1)} className="up-back-btn">
          <ArrowLeft size={18} /> Rudi
        </button>
        <div className="up-header-title">
          <h2>Hariri Bidhaa</h2>
          <p>ID: {productId}</p>
        </div>
        <button onClick={handleUpdateInfo} disabled={saving} className="up-save-btn">
          {saving ? <Loader2 className="up-spinner" size={18} /> : "Hifadhi Zote"}
        </button>
      </div>

      <div className="up-content">
        {/* PICHA ZA BIDHAA */}
        <div className="up-card">
          <h3><Camera size={16} /> Picha za Bidhaa</h3>
          <div className="up-media-section">
            {/* Main Cover */}
            <div className="up-main-img-wrapper">
              <label className="up-main-img-label">Picha Kuu (Cover)</label>
              <div className="up-main-img">
                <img
                  src={product?.cover_image_url || "https://via.placeholder.com/400x400?text=No+Image"}
                  alt="Main"
                />
                <label className="up-edit-label">
                  <Camera size={28} />
                  <span>Badilisha Picha</span>
                  <input type="file" hidden onChange={(e) => handleFileUpload(e, "cover")} accept="image/*" />
                </label>
              </div>
            </div>

            {/* Gallery */}
            <div className="up-gallery-wrapper">
              <label className="up-gallery-label">Picha za Nyongeza (Gallery)</label>
              <div className="up-gallery-grid">
                {gallery.map((m) => (
                  <div key={m.id} className="up-gallery-item">
                    <img src={m.media_url} alt="Gallery" />
                    <button onClick={() => deleteMedia(m.id)} className="up-del-btn">
                      <X size={12} />
                    </button>
                  </div>
                ))}
                {gallery.length < 5 && (
                  <label className="up-add-box">
                    {uploading ? <Loader2 className="up-spinner" /> : <Plus />}
                    <input type="file" hidden onChange={(e) => handleFileUpload(e, "gallery")} accept="image/*" />
                  </label>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* MAELEZO YA BIDHAA */}
        <div className="up-card">
          <h3>Maelezo ya Bidhaa</h3>
          <div className="up-form">
            {/* Kategoria */}
            <div className="up-form-row">
              <div className="up-input-group">
                <label>Kategoria Ndogo (Sub-category)</label>
                <select
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
                <label>Aina Maalum (Leaf Category)</label>
                <select
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
                  <p className="up-warning">Hakuna aina maalum kwa kategoria hii.</p>
                )}
              </div>
            </div>

            <div className="up-input-group">
              <label>Jina la Bidhaa</label>
              <input
                value={product?.name || ""}
                onChange={(e) => setProduct({...product, name: e.target.value})}
                placeholder="Mf: iPhone 15 Pro Max"
              />
            </div>

            <div className="up-form-row">
              <div className="up-input-group">
                <label>Bei ya Ofa (TZS)</label>
                <input
                  type="number"
                  value={product?.original_price || ""}
                  onChange={(e) => setProduct({...product, original_price: e.target.value})}
                />
              </div>
              <div className="up-input-group">
                <label>Bei ya Zamani</label>
                <input
                  type="number"
                  value={product?.price || ""}
                  onChange={(e) => setProduct({...product, price: e.target.value})}
                />
              </div>
            </div>

            <div className="up-input-group">
              <label>Stock (Idadi Iliyopo)</label>
              <input
                type="number"
                value={product?.stock_quantity || ""}
                onChange={(e) => setProduct({...product, stock_quantity: e.target.value})}
              />
            </div>

            <div className="up-input-group">
              <label>Maelezo Kamili</label>
              <textarea
                rows="5"
                value={product?.description || ""}
                onChange={(e) => setProduct({...product, description: e.target.value})}
                placeholder="Andika sifa za bidhaa..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* ========== SEHEMU YA VARIATIONS ========== */}
      <div className="up-card up-variations-card">
        <div className="up-variations-header">
          <h3><Palette size={16} /> Rangi na Ukubwa (Variations)</h3>
          <button
            onClick={() => { resetVariationForm(); setShowVariationForm(true); }}
            className="up-add-variation-btn"
          >
            <Plus size={14} /> Ongeza Variation
          </button>
        </div>

        {variations.length === 0 ? (
          <p className="up-empty-text">Hakuna variations bado. Bonyeza "Ongeza Variation" kuweka rangi na ukubwa.</p>
        ) : (
          <div className="up-variations-list">
            {variations.map((v) => (
              <div key={v.id} className="up-variation-item">
                <div className="up-variation-info">
                  {v.color_image_url ? (
                    <img src={v.color_image_url} alt={v.color_name} className="up-variation-image" />
                  ) : (
                    <div className="up-variation-noimg">No img</div>
                  )}
                  <div>
                    <p className="up-variation-name">{v.color_name || "N/A"}</p>
                    <p className="up-variation-details">Ukubwa: {v.size_value || "N/A"} | Stock: {v.stock_quantity} | Bei: TZS {v.price}</p>
                  </div>
                </div>
                <div className="up-variation-actions">
                  <button onClick={() => openEditVariation(v)} className="up-edit-variation-btn">
                    <Edit3 size={16} />
                  </button>
                  <button onClick={() => handleDeleteVariation(v.id)} className="up-delete-variation-btn">
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
        <div className="up-modal-overlay">
          <div className="up-modal">
            <div className="up-modal-header">
              <h3>{editingVariationId ? "Hariri Variation" : "Ongeza Variation"}</h3>
              <button onClick={resetVariationForm} className="up-modal-close">
                <X size={20} />
              </button>
            </div>

            <div className="up-modal-body">
              <div className="up-input-group">
                <label>Jina la Rangi</label>
                <input
                  value={variationForm.color_name}
                  onChange={(e) => setVariationForm({ ...variationForm, color_name: e.target.value })}
                  placeholder="Mf: Red, Blue, White"
                />
              </div>
              <div className="up-input-group">
                <label>Ukubwa (Size)</label>
                <input
                  value={variationForm.size_value}
                  onChange={(e) => setVariationForm({ ...variationForm, size_value: e.target.value })}
                  placeholder="Mf: M, L, XL, 42, N/A"
                />
              </div>
              <div className="up-form-row">
                <div className="up-input-group">
                  <label>Stock</label>
                  <input
                    type="number"
                    value={variationForm.stock_quantity}
                    onChange={(e) => setVariationForm({ ...variationForm, stock_quantity: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="up-input-group">
                  <label>Bei (TZS)</label>
                  <input
                    type="number"
                    value={variationForm.price}
                    onChange={(e) => setVariationForm({ ...variationForm, price: e.target.value })}
                  />
                </div>
              </div>

              <div className="up-input-group">
                <label>Sifa za Ziada (JSON)</label>
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
                />
              </div>

              <div className="up-input-group">
                <label>Picha ya Rangi</label>
                <div className="up-image-upload">
                  {variationForm.color_image_preview ? (
                    <img src={variationForm.color_image_preview} alt="Color" className="up-image-preview" />
                  ) : (
                    <div className="up-image-placeholder">No img</div>
                  )}
                  <label className="up-image-upload-btn">
                    Chagua Picha
                    <input type="file" hidden onChange={handleVariationImageChange} accept="image/*" />
                  </label>
                </div>
              </div>

              <div className="up-modal-actions">
                <button onClick={handleVariationSubmit} className="up-modal-submit">
                  {editingVariationId ? "Sasisha" : "Hifadhi"}
                </button>
                <button onClick={resetVariationForm} className="up-modal-cancel">
                  Ghairi
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