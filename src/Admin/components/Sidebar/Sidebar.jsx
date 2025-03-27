import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../Auth/AuthContext"; 
import "./Sidebar.css";

const Sidebar = () => {
  const { user } = useContext(AuthContext); 
  const [expandedIndex, setExpandedIndex] = useState(null);

  const menuItems = [
    { title: "Thống kê", path: "/admin", subItems: [] },
    {
      title: "Quản lý người dùng",
      path: "/admin/user-management",
      subItems: [],
      requiredRole: "admin",
    },
    {
      title: "Quản lý danh mục",
      path: "/admin/categories",
      subItems: [],
    },
    {
      title: "Quản lý tài liệu",
      subItems: [
        { title: "Kế hoạch bài dạy", path: "/admin/lesson-plans" },
        { title: "Game", path: "/admin/games" },
        { title: "Video thí nghiệm", path: "/admin/experiment-videos" },
      ],
    },
    { title: "Quản lý bài tập", path: "/admin/exercise-management", subItems: [] },
  ];

  const toggleMenu = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="sidebar--admin">
      <div className="sidebar-header--admin">
        <h2>SciPlay</h2>
      </div>
      <ul className="sidebar-menu--admin">
        {menuItems
          .filter((item) => !item.requiredRole || (user && user.role === item.requiredRole)) // Kiểm tra role từ context
          .map((item, index) => (
            <li key={index} className="menu-item--admin">
              <div className="menu-title" onClick={() => toggleMenu(index)}>
                {item.subItems.length > 0 ? item.title : <Link to={item.path}>{item.title}</Link>}
              </div>
              {item.subItems.length > 0 && (
                <ul className={`submenu ${expandedIndex === index ? "open" : ""}`}>
                  {item.subItems.map((subItem, subIndex) => (
                    <li key={subIndex} className="submenu-item">
                      <Link to={subItem.path}>{subItem.title}</Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
      </ul>
      <div className="sidebar-footer--admin">
        <p>&copy; SciPlay - Trường ĐHSP Hà Nội</p>
      </div>
    </div>
  );
};

export default Sidebar;
