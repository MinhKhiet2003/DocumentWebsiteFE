import React from "react";
import "./MainContent.css";
const MainContent = () => {
  return (
    <div className="main-content--admin">
      <h3>Dashboard Overview</h3>
      <div className="cards--admin">
        <div className="card--admin">
          <h4>Total Users</h4>
          <p>1,234</p>
        </div>
        <div className="card--admin">
          <h4>Total Products</h4>
          <p>567</p>
        </div>
        <div className="card--admin">
          <h4>Total Sales</h4>
          <p>$89,000</p>
        </div>
      </div>
    </div>
  );
};

export default MainContent;