import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./NotFound.css";

const NotFound = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="notfound-container"
    >
      <div className="notfound-content">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
          className="error-code"
        >
          404
          <i className="fas fa-frown"></i>
        </motion.div>
        
        <h2 className="error-title">Oops! Trang không tồn tại</h2>
        
        <p className="error-message">
          Trang bạn đang tìm kiếm có thể đã bị xóa, đổi tên hoặc tạm thời không khả dụng.
        </p>
        
        <div className="action-buttons">
          <Link
            to="/"
            className="home-button"
          >
            <i className="fas fa-home"></i> Trang chủ
          </Link>
          
          <a
            href="https://www.facebook.com/minhkhiet2003"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-button"
          >
            <i className="fas fa-headset"></i> Hỗ trợ
          </a>
        </div>
        
        <div className="search-box">
          <input type="text" placeholder="Tìm kiếm..." />
          <button><i className="fas fa-search"></i></button>
        </div>
      </div>
    </motion.div>
  );
};

export default NotFound;