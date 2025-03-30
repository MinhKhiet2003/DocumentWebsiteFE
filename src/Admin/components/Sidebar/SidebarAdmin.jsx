import React, { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../../Auth/AuthContext";
import "./SidebarAdmin.css";

const SidebarAdmin = () => {
  const { user } = useContext(AuthContext);
  const [expandedItems, setExpandedItems] = useState({});
  const location = useLocation();

  const hasPermission = (requiredRole) => {
    if (!requiredRole) return true;
    return user?.role === requiredRole || user?.role === 'admin';
  };

  const menuItems = [
    { 
      title: "Thống kê", 
      path: "/admin/dashboard", 
      icon: "📊",
      exact: true 
    },
    {
      title: "Quản lý người dùng",
      path: "/admin/user-management",
      icon: "👥",
      requiredRole: "admin"
    },
    {
      title: "Quản lý danh mục",
      path: "/admin/categories",
      icon: "🏷️"
    },
    {
      title: "Quản lý tài liệu",
      icon: "📚",
      subItems: [
        { 
          title: "Kế hoạch bài dạy", 
          path: "/admin/lesson-plans",
          requiredRole: "teacher" 
        },
        { 
          title: "Game", 
          path: "/admin/games",
          requiredRole: "teacher" 
        },
        { 
          title: "Video thí nghiệm", 
          path: "/admin/experiment-videos",
          requiredRole: "teacher" 
        },
      ]
    },
    { 
      title: "Quản lý bài tập",
      icon: "📝",
      subItems: [
        { 
          title: "Hóa học đời sống", 
          path: "/admin/chemistry-of-life",
          requiredRole: "teacher" 
        },
        { 
          title: "Truyện tranh hóa học", 
          path: "/admin/chemistry-comics",
          requiredRole: "teacher" 
        },
      ]
    },
  ];

  const toggleSubMenu = (index) => {
    setExpandedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const isActive = (path, exact = false) => {
    return exact 
      ? location.pathname === path
      : location.pathname.startsWith(path);
  };

  return (
    <div className="admin-sidebar">
      <div className="admin-sidebar-header">
        <h2>SciPlay</h2>
        <p className="admin-user-role-badge">
          {user?.role === 'admin' ? 'Quản trị viên' : 
          user?.role === 'teacher' ? 'Giáo viên' : 
          'Khách'}
        </p>
      </div>
      
      <ul className="admin-sidebar-menu">
        {menuItems.filter(item => hasPermission(item.requiredRole)).map((item, index) => (
          <li 
            key={index} 
            className={`admin-menu-item ${!item.path && item.subItems ? 'has-submenu' : ''} ${isActive(item.path, item.exact) ? "active" : ""}`}
          >
            {item.subItems ? (
              <>
                <div 
                  className="admin-menu-title" 
                  onClick={() => toggleSubMenu(index)}
                >
                  <span className="admin-menu-icon">{item.icon}</span>
                  <span className="admin-menu-text">{item.title}</span>
                  <span className={`admin-arrow ${expandedItems[index] ? "open" : ""}`}>▼</span>
                </div>
                
                <div className={`admin-submenu-container ${expandedItems[index] ? "open" : ""}`}>
                  <ul className="admin-submenu">
                    {item.subItems.filter(subItem => hasPermission(subItem.requiredRole)).map((subItem, subIndex) => (
                      <li 
                        key={subIndex} 
                        className={`admin-submenu-item ${isActive(subItem.path) ? "active" : ""}`}
                      >
                        <Link to={subItem.path}>
                          <span className="admin-submenu-text">{subItem.title}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <Link to={item.path} className="admin-menu-title">
                <span className="admin-menu-icon">{item.icon}</span>
                <span className="admin-menu-text">{item.title}</span>
              </Link>
            )}
          </li>
        ))}
      </ul>

      <div className="admin-sidebar-footer">
        <p>Phiên bản 1.0.0</p>
        <p>&copy; SciPlay - Trường ĐHSP Hà Nội</p>
      </div>
    </div>
  );
};


export default SidebarAdmin;