import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../Auth/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext); // Sử dụng AuthContext
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Xử lý click bên ngoài dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

        {user ? (
          <div id="profile" className="dropdown" ref={dropdownRef}>
            <button
              className="dropdown-toggle"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <img
                id="avatar"
                src={user.avatar || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'}
                alt="Avatar"
              />
              <span id="nickname">{user.username}</span>
            </button>
            <ul className={`dropdown-menu ${showDropdown ? 'show' : ''}`}>
              <li><Link className="dropdown-item" to="/profile">Thông tin cá nhân</Link></li>
              {/* Hiển thị mục "Truy cập trang quản trị" nếu role là admin hoặc teacher */}
              {(user.role === 'admin' || user.role === 'teacher') && (
                <li><Link className="dropdown-item" to="/admin">Truy cập trang quản trị</Link></li>
              )}
              <li><hr className="dropdown-divider" /></li>
              <li><Link className="dropdown-item" to="#" onClick={logout}>Đăng xuất</Link></li>
            </ul>
          </div>
        ) : (
          <div className="auth-buttons" id="auth-buttons">
            <Link to="/login" className="btn btn-outline-primary btn-sm">Đăng nhập</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Đăng ký</Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;