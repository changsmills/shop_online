import { useState } from "react";
import "../MegaMenu.css"; 

const categories = [
  { id: 1, name: "Apparel & Accessories", icon: "👕", items: ["Hoodies", "Tracksuits", "Jackets", "T-shirts", "Pants"] },
  { id: 2, name: "Consumer Electronics", icon: "🎧", items: ["Smart Watches", "Phones", "Laptops", "Cameras", "Audio"] },
  { id: 3, name: "Home & Garden", icon: "🏠", items: ["Furniture", "Kitchenware", "Decor", "Tools", "Pets"] }
];

export default function MegaMenu() {
  const [active, setActive] = useState(categories[0]);

  return (
    <div className="mega-dropdown-wrapper">
      {/* SIDEBAR YA KUSHOTO */}
      <div className="mega-sidebar">
        {categories.map((cat) => (
          <div 
            key={cat.id}
            onMouseEnter={() => setActive(cat)}
            className={`mega-sidebar-link ${active.id === cat.id ? 'is-active' : ''}`}
          >
            <span className="cat-info">{cat.icon} {cat.name}</span>
            <span className="cat-arrow">›</span>
          </div>
        ))}
      </div>

      {/* MAUDHUI YA KULIA */}
      <div className="mega-main-content">
        <h3 className="mega-content-header">Suggested for you: {active.name}</h3>
        <div className="mega-items-grid">
          {active.items.map((item, i) => (
            <div key={i} className="mega-grid-card">
              <div className="mega-card-icon">
                 <span>📦</span>
              </div>
              <p className="mega-card-text">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}