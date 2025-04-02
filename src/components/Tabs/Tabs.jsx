import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Tabs.css";

const classTabs = [
  { name: "Lớp 6", id: 6 },
  { name: "Lớp 7", id: 7 },
  { name: "Lớp 8", id: 8 },
  { name: "Lớp 9", id: 9 },
  { name: "Lớp 10", id: 10 },
  { name: "Lớp 11", id: 11 },
  { name: "Lớp 12", id: 12 }
];

const Tabs = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const classId = searchParams.get('classId');

  const handleTabClick = (tab) => {
    if (tab) {
      navigate(`?classId=${tab.id}`);
    } else {
      navigate(""); 
    }
  };

  return (
    <div className="tabs-container">
      <button
        onClick={() => handleTabClick(null)}
        className={`tab-button ${!classId ? "active" : ""}`}
      >
        Tất cả
      </button>
      {classTabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleTabClick(tab)}
          className={`tab-button ${classId == tab.id ? "active" : ""}`}
        >
          {tab.name}
        </button>
      ))}
    </div>
  );
};

export default Tabs;