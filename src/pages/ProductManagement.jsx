// ProductManagement.jsx
import { useNavigate } from "react-router-dom";

const ProductManagement = ({ session }) => {
  const navigate = useNavigate();

  const handleAddProduct = async () => {
    // KAMA HAJA-LOGIN (Alibaba Style)
    if (!session) {
      alert("Samahani! Lazima uingie kwenye akaunti yako ili kuongeza bidhaa.");
      navigate("/login");
      return;
    }

    // KAMA AMELOGIN - AI INAFANYA KAZI HAPA
    // ... kodi yako ya ku-save bidhaa Supabase
  };

  return (
    <div>
      <h1>Product Management</h1>
      <button onClick={handleAddProduct}>+ Ongeza Bidhaa Mpya</button>
      
      {!session && (
        <p style={{color: 'orange'}}>⚠️ Upo kwenye hali ya mgeni. Login ili kuhifadhi data.</p>
      )}
    </div>
  );
};

export default ProductManagement;