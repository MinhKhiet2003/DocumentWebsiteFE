import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../Auth/AuthContext';
import logo from '../../assets/Hachieve.png';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Đóng dropdown profile nếu click bên ngoài
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      
      // Đóng menu mobile nếu click bên ngoài
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        if (!event.target.closest('.hamburger')) {
          setIsMenuOpen(false);
        }
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header>
      <div className="logo-menu-toggle-container" >
        <div className="logo-container">
          <Link to="/">
            <img src={logo} alt="Logo" />
          </Link>
        </div>
        <div className="menu-toggle-container">
          <button className={`hamburger ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu} aria-label="Menu">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
      <nav className={isMenuOpen ? 'open' : ''}>
        <Link
          to="/home"
          className={location.pathname.startsWith('/home') ? 'active' : ''}
          onClick={() => setIsMenuOpen(false)}
        >
          Giới thiệu
        </Link>
        <Link
          to="/resources"
          className={location.pathname.startsWith('/resources') ? 'active' : ''}
          onClick={() => setIsMenuOpen(false)}
        >
          Tài liệu tham khảo
        </Link>
        <Link
          to="/news"
          className={location.pathname.startsWith('/news') ? 'active' : ''}
          onClick={() => setIsMenuOpen(false)}
        >
          Tin tức & Sự kiện
        </Link>
        <Link
          to="/members"
          className={location.pathname.startsWith('/members') ? 'active' : ''}
          onClick={() => setIsMenuOpen(false)}
        >
          Thành viên & Đội ngũ
        </Link>

        {user ? (
          <div id="profile" className="dropdown" ref={dropdownRef}>
            <button
              className="dropdown-toggle"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <img
                id="avatar"
                src={
                  user.avatar ||
                  'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
                }
                alt="Avatar"
              />
              <span id="nickname">{user.username}</span>
            </button>
            <ul className={`dropdown-menu ${showDropdown ? 'show' : ''}`}>
              <li>
                <Link
                  className="dropdown-item"
                  to="/profile"
                  onClick={() => setShowDropdown(false)}
                >
                  Thông tin cá nhân
                </Link>
              </li>
              {(user.role === 'admin' || user.role === 'teacher') && (
                <li>
                  <Link
                    className="dropdown-item"
                    to="/admin"
                    onClick={() => setShowDropdown(false)}
                  >
                    Truy cập trang quản trị
                  </Link>
                </li>
              )}
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <Link
                  className="dropdown-item"
                  to="#"
                  onClick={() => {
                    logout();
                    setShowDropdown(false);
                  }}
                >
                  Đăng xuất
                </Link>
              </li>
            </ul>
          </div>
        ) : (
          <div className="auth-buttons" id="auth-buttons">
            <Link to="/login" className="btn btn-outline-primary btn-sm">
              Đăng nhập
            </Link>
            <Link to="/register" className="btn btn-primary btn-sm">
              Đăng ký
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;