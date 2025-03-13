import React from "react";
import { Link } from "react-router-dom";
import "./NotFound.css";
const NotFound = () => {
  return (
    <div className="notfound-container">
      <div className="">
        <h1 className="text-6xl font-bold text-red-500">
          404 <i className="fas fa-frown"></i>
        </h1>
        <p className="text-xl text-gray-600 mt-4">Trang bạn đang tìm kiếm không tồn tại !</p>
        <Link to="https://www.facebook.com/minhkhiet2003" className="text-blue-500 hover:underline">
          Liên hệ admin
        </Link>
        <p></p>
        <Link
          to="/"
          className="mt-16 px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600"
        >
          Quay lại Trang chủ
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
