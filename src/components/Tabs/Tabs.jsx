import React, { useState } from "react";
import "./Tabs.css";

const Tabs = () => {
  const [activeTab, setActiveTab] = useState("Lớp 6");

  return (
    <div className="tabs-container">
      {["Lớp 6", "Lớp 7", "Lớp 8", "Lớp 9", "Lớp 10", "Lớp 11", "Lớp 12"].map((tab) => (
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
};

export default Tabs;
