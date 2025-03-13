import React from "react";
import "./Pagination.css";

const Pagination = () => {
  return (
    <div className="pagination-container">
      <button className="pagination-button">Trước</button>
      <button className="pagination-button active">1</button>
      <button className="pagination-button">2</button>
      <button className="pagination-button">Tiếp</button>
    </div>
  );
};

export default Pagination;
