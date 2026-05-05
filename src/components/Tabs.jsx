import React from "react";

export default function Tabs({ activeTab, setActiveTab }) {
  const tabs = ["AI Mode", "Products", "Manufacturers", "Worldwide"];

  return (
    <div className="tabs-container">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`tab-button ${activeTab === tab ? "active" : ""}`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}