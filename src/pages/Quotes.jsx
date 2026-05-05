import { useState } from "react";
import * as LucideIcons from "lucide-react";

export default function Quotes() {
  const [formData, setFormData] = useState({ 
    product: "", 
    quantity: "", 
    name: "", 
    phone: "",
    email: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Ombi lako limetumwa! Tutakujibu ndani ya saa 24.");
    setFormData({ product: "", quantity: "", name: "", phone: "", email: "" });
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '20px' }}>
        <LucideIcons.FileText size={28} style={{ color: '#ff6a00', marginRight: '10px' }} />
        Maombi ya Invoice (Quote)
      </h1>
      <p style={{ fontSize: '16px', color: '#666', marginBottom: '30px' }}>
        Omba bei ya jumla au invoice kwa bidhaa unayotaka
      </p>

      <form onSubmit={handleSubmit} style={{ backgroundColor: '#f9fafb', padding: '30px', borderRadius: '12px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Bidhaa Unayotaka *</label>
          <input 
            type="text" 
            required
            placeholder="Mfano: Simu, Nguo, Vifaa vya ujenzi..."
            value={formData.product}
            onChange={(e) => setFormData({...formData, product: e.target.value})}
            style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Idadi / Kiasi *</label>
          <input 
            type="number" 
            required
            placeholder="Mfano: 50, 100, 500"
            value={formData.quantity}
            onChange={(e) => setFormData({...formData, quantity: e.target.value})}
            style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Jina Lako *</label>
          <input 
            type="text" 
            required
            placeholder="Jina kamili"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Namba ya Simu *</label>
          <input 
            type="tel" 
            required
            placeholder="07XX XXX XXX"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Barua Pepe</label>
          <input 
            type="email" 
            placeholder="email@example.com"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}
          />
        </div>
        
        <button 
          type="submit" 
          style={{ 
            backgroundColor: '#ff6a00', 
            color: 'white', 
            padding: '12px 24px', 
            border: 'none', 
            borderRadius: '8px', 
            cursor: 'pointer', 
            width: '100%', 
            fontWeight: '600',
            fontSize: '16px'
          }}
        >
          Tuma Ombi la Invoice
        </button>
      </form>
    </div>
  );
}