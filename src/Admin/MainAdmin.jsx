import React from "react";
import { Outlet } from "react-router-dom";
import SidebarAdmin from "./components/Sidebar/SidebarAdmin";
import Header from "./components/Header/Header";
import { AuthContext } from "../Auth/AuthContext";
import "./styles.css";

const MainAdmin = () => {
  const [isSidebarVisible, setSidebarVisible] = React.useState(true);
  const { user } = React.useContext(AuthContext);

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const canAccess = (requiredRole) => {
    return user?.role === 'admin' || user?.role === requiredRole;
  };

  return (
    <div className="admin-dashboard">
      {isSidebarVisible && (
        <SidebarAdmin 
          user={user} 
          canAccess={canAccess} 
        />
      )}
      <div className={`content--admin ${!isSidebarVisible ? "content-full-width" : ""}`}>
      <Header 
        user={user} 
        toggleSidebar={toggleSidebar} 
        isSidebarVisible={isSidebarVisible} 
      />
      <div className={`main-content--admin ${!isSidebarVisible ? "main-content--admin-full-width" : ""}`}>
        <Outlet />
      </div>
      </div>
    </div>
  );
};

export default MainAdmin;