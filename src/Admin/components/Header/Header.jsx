import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";  
import "./Header.css";

const Header = ({ user, toggleSidebar, isSidebarVisible }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  
  const navigate = useNavigate();

  const handleAvatarClick = () => {
    setDropdownOpen(!isDropdownOpen); 
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    localStorage.removeItem("user");
    
    navigate("/login");
    setDropdownOpen(false);
  };

  return (
    <div className={`header--admin ${isSidebarVisible ? "sidebar-visible" : ""}`}>
      <div className="header-left">
        <span className="menu-icon--admin" onClick={toggleSidebar}>
          &#9776;
        </span>
        <h2>Welcome, {user?.username || "Admin"}!</h2>
      </div>
      <div className="header-right">
        <span className="notification-icon">🔔</span>
        <div className="user-avatar" onClick={handleAvatarClick}>
          👤
          {isDropdownOpen && (
            <div className="dropdown-menu">
              <Link to="/" onClick={() => setDropdownOpen(false)}>Go to Home</Link>
              <button onClick={handleLogout} className="logout-button">Logout</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;