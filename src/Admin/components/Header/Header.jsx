import React from "react";
import "./Header.css";
const Header = () => {
  return (
    <div className="header--admin">
      <div className="header-left">
        <span className="menu-icon--admin">&#9776;</span>
        <h2>Welcome, Admin!</h2>
      </div>
      <div className="header-right">
        <span className="notification-icon">🔔</span>
        <span className="user-avatar">👤</span>
      </div>
    </div>
  );
};

export default Header;