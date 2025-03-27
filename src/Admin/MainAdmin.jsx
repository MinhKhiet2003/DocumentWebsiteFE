import React, { useContext, useEffect, useState } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header/Header";
import MainContent from "./pages/MainContent/MainContent";
import { AuthContext } from "../Auth/AuthContext";
import "./styles.css";

const MainAdmin = () => {
  const { user } = useContext(AuthContext);
  const [isSidebarVisible, setSidebarVisible] = useState(true); 

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'teacher')) {
      window.location.href = '/';
    }
  }, [user]);

  if (!user || (user.role !== 'admin' && user.role !== 'teacher')) {
    return null; 
  }

  return (
    <div className="admin-dashboard">
      {isSidebarVisible && <Sidebar user={user} />} 
      <div className={`content--admin ${!isSidebarVisible ? "content-full-width" : ""}`}>
        <Header user={user} toggleSidebar={toggleSidebar} /> 
        <MainContent />
      </div>
    </div>
  );
};

export default MainAdmin;