import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../Auth/AuthContext';
import logo from '../../assets/Hachieve.png';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext); 
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  
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
      <Link to="/"><img src={logo} alt="Logo" /></Link>
      </div>
      <nav>
        <Link to="/home" className={location.pathname.startsWith('/home') ? 'active' : ''}>Giới thiệu</Link>
        <Link to="/resources" className={location.pathname.startsWith('/resources') ? 'active' : ''}>Tài nguyên</Link>
        <Link to="/news" className={location.pathname.startsWith('/news') ? 'active' : ''}>Tin tức & Sự kiện</Link>
        <Link to="/members" className={location.pathname.startsWith('/members') ? 'active' : ''}>Thành viên & Đội ngũ</Link>

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