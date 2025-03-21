import React, { useState, useEffect, useRef } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes
} from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState({
    username: '',
    avatar: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
    role: '', 
  });
  const [showDropdown, setShowDropdown] = useState(false); 
  const dropdownRef = useRef(null); // Ref để xử lý click bên ngoài dropdown

  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch('http://localhost:5168/api/User/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Không thể lấy thông tin profile');
      }

      const data = await response.json();
      setUserInfo({
        username: data.nickname,
        avatar: data.avatar || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
        role: data.role, 
      });
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Lỗi khi lấy thông tin profile:', error);
    }
  };

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

  // Kiểm tra trạng thái đăng nhập và lấy thông tin profile khi component được tải
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchProfile();
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('avatar');
    setIsLoggedIn(false);
    setUserInfo({
      username: '',
      avatar: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
      role: '', 
    });
    window.location.href = '/';
  };

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

        {isLoggedIn ? (
          <div id="profile" className="dropdown" ref={dropdownRef}>
            <button
              className="dropdown-toggle"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <img
                id="avatar"
                src={userInfo.avatar}
                alt="Avatar"
              />
              <span id="nickname">{userInfo.username}</span>
            </button>
            <ul className={`dropdown-menu ${showDropdown ? 'show' : ''}`}>
              <li><Link className="dropdown-item" to="/profile">Thông tin cá nhân</Link></li>
              {/* Hiển thị mục "Truy cập trang quản trị" nếu role là admin hoặc teacher */}
              {(userInfo.role === 'admin' || userInfo.role === 'teacher') && (
                <li><Link className="dropdown-item" to="/admin">Truy cập trang quản trị</Link></li>
              )}
              <li><hr className="dropdown-divider" /></li>
              <li><Link className="dropdown-item" to="#" onClick={handleLogout}>Đăng xuất</Link></li>
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