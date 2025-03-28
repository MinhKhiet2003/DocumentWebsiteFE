import React, { useState } from "react";
import { Link } from "react-router-dom";  
import "./Header.css";

const Header = ({ user, toggleSidebar }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const handleAvatarClick = () => {
    setDropdownOpen(!isDropdownOpen); 
  };

  return (
    <div className="header--admin">
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
