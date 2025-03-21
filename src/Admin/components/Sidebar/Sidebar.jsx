import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  // Danh sách menu với các mục con
  const menuItems = [
    {
      title: "Thống kê",
      subItems: [],
      path: "/admin",
    },
    {
      title: "Quản lý người dùng",
      subItems: [],
      path: "/admin/user-management",
    },
    {
      title: "Quản lý tài liệu",
      subItems: [
        { title: "Kế hoạch bài dạy", path: "/admin/lesson-plans" },
        { title: "Game", path: "/admin/games" },
        { title: "Video thí nghiệm", path: "/admin/experiment-videos" },
      ],
    },
    {
      title: "Quản lý bài tập",
      subItems: [],
      path: "/admin/exercise-management",
    },
  ];

  // State lưu index của mục đang được mở (dropdown)
  const [expanded, setExpanded] = useState(null);

  // Hàm toggle mở/đóng menu
  const toggleMenu = (index) => {
    setExpanded(expanded === index ? null : index);
  };

  return (
    <div className="sidebar--admin">
      <div className="sidebar-header--admin">
        <h2>SciPlay</h2>
      </div>
      <ul className="sidebar-menu--admin">
        {menuItems.map((item, index) => (
          <li key={index} className="menu-item--admin">
            <div className="menu-title" onClick={() => toggleMenu(index)}>
              {item.subItems.length > 0 ? (
                item.title
              ) : (
                <Link to={item.path}>{item.title}</Link>
              )}
            </div>
            {item.subItems.length > 0 && (
              <ul className={`submenu ${expanded === index ? "open" : ""}`}>
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