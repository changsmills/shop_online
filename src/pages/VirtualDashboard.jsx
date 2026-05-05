// SupplierRegistration.jsx

import { useState } from "react";
import "../SupplierRegistration.css";

export default function SupplierRegistration() {
  const [role, setRole] = useState("supplier");

  return (
    <div className="hub-container min-h-screen">
      <div className="glow-1"></div>
      <div className="glow-2"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* HEADER */}
        <div className="text-center mb-12 animate-fadeIn">
          <h1 className="hub-main-title">
            VIRTUAL <span className={role === 'supplier' ? 'text-blue-glow' : 'text-orange-glow'}>HUB</span> SERVICE
          </h1>
          <p className="hub-subtitle">Elite B2B Networking & Linkage Portal</p>
        </div>

        {/* MODERN TOGGLE - Fixed Z-Index & Click Handling */}
        <div className="flex justify-center mb-12">
          <div className="toggle-wrapper">
            <button 
              type="button" // Muhimu: Kuzuia form submission
              onClick={() => setRole("supplier")}
              className={`nav-btn ${role === 'supplier' ? 'active-supplier' : ''}`}
            >
              🏢 Supplier Portal
            </button>
            <button 
              type="button" 
              onClick={() => setRole("merchant")}
              className={`nav-btn ${role === 'merchant' ? 'active-merchant' : ''}`}
            >
              🔗 Merchant Linkage
            </button>
          </div>
        </div>

        {/* MAIN FORM CARD */}
        <div className={`hub-card animate-slideUp ${role === 'supplier' ? 'border-blue' : 'border-orange'}`}>
          <div className="card-header">
             <h2 className="card-title">
               {role === 'supplier' ? 'Sajili Chanzo cha Bidhaa' : 'Ombi la Kuunganishwa'}
             </h2>
             <p className="card-desc">
               {role === 'supplier' 
                ? 'Anza kutoa bidhaa zako kwa mawakala waaminifu duniani kote.' 
                : 'Chagua kampuni unayotaka kufanya nayo kazi na ufungue duka lako.'}
             </p>
          </div>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {role === "supplier" ? (
              <>
                <div className="input-box">
                  <label className="input-label-blue">Company Legal Name</label>
                  <input type="text" placeholder="Mf: Bongo Tech Solutions" className="modern-input" />
                </div>
                <div className="input-box">
                  <label className="input-label-blue">Business TIN Number</label>
                  <input type="text" placeholder="123-456-789" className="modern-input" />
                </div>
                <div className="input-box">
                  <label className="input-label-blue">Specialization</label>
                  <select className="modern-input">
                    <option>Electronics & Tech Gadgets</option>
                    <option>Fashion & Apparel</option>
                  </select>
                </div>
                <div className="input-box">
                  <label className="input-label-blue">Agent Commission (%)</label>
                  <input type="number" placeholder="Mf: 10" className="modern-input" />
                </div>
                <div className="md:col-span-2">
                  <label className="input-label-blue">Agreement Terms</label>
                  <textarea rows="3" placeholder="Elezea makubaliano..." className="modern-input"></textarea>
                </div>
                <button type="button" className="submit-btn-blue md:col-span-2">
                  Sajili Kampuni Rasmi ⚡
                </button>
              </>
            ) : (
              <>
                <div className="input-box">
                  <label className="input-label-orange">Chagua Supplier</label>
                  <select className="modern-input">
                    <option>Bongo Tech Solutions</option>
                    <option>Smart Electronics Hub</option>
                  </select>
                </div>
                <div className="input-box">
                  <label className="input-label-orange">Niche ya Duka Lako</label>
                  <input type="text" placeholder="Mf: iPhone Specialist" className="modern-input" />
                </div>
                <div className="md:col-span-2">
                  <label className="input-label-orange">Pakia Risiti ya Dhamana</label>
                  <div className="upload-area">
                    <span className="upload-icon">📄</span>
                    <p>Bonyeza kupakia risiti (PDF/JPG)</p>
                  </div>
                </div>
                <div className="md:col-span-2 checkbox-container">
                  <input type="checkbox" id="terms" className="custom-check" />
                  <label htmlFor="terms">Nimekubali vigezo vya ushirikiano.</label>
                </div>
                <button type="button" className="submit-btn-orange md:col-span-2">
                  Anzisha Muunganisho (Link) 🔗
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}