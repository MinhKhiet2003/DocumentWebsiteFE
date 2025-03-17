import React from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header/Header";
import MainContent from "./pages/MainContent/MainContent";
import "./styles.css";

const MainAdmin = () => {
  return (
    <div className="admin-dashboard">
      <Sidebar />
      <div className="content--admin">
        <Header />
        <MainContent />
      </div>
    </div>
  );
};

export default MainAdmin;