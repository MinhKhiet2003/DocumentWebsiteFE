import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes } from 'react-router-dom';
import './Navbar.css';
const Navbar = () => {
  return (
    <header>
      <div>
        <h1>SciPlay</h1>
      </div>
      <nav>
        <Link to="/home">Giới thiệu</Link>
        <Link to="/resources">Tài nguyên</Link>
        <Link to="/news">Tin tức & Sự kiện</Link>
        <Link to="/members">Thành viên & Đội ngũ</Link>
        <div className="auth-buttons" id="auth-buttons">
          <Link to="/login"  className="btn btn-outline-primary btn-sm">Đăng nhập</Link>
          <Link to="/register" className="btn btn-primary btn-sm">Đăng ký</Link>
        </div>
        {/* <div id="profile" className="dropdown d-none">
          <button className="btn bnt-light dropdown-toggle" type="button" id="profileDropdown" data-bs-toggle="dropdown" aria-expanded="false">
            <img id="avatar" src="assets/images/default-avatar.png" alt="Avatar" className="rounded-circle" style={{ width: '30px', height: '30px', objectFit: 'cover', marginRight: '5px' }} />
            <span id="nickname">Nickname</span>
          </button>
          <ul className="dropdown-menu" aria-labelledby="profileDropdown">
            <li><Link className="dropdown-item" to="#">Thông tin cá nhân</Link></li>
            <li><Link className="dropdown-item" to="#">Truy cập trang quản tri</Link></li>
            <li><hr className="dropdown-divider" /></li>
            <li><Link className="dropdown-item" to="#" onClick={() => logout()}>Đăng xuất</Link></li>
          </ul>
        </div> */}
      </nav>
    </header>
    
  );
};

export default Navbar;