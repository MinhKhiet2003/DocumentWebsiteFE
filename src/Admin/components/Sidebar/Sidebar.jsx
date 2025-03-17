import React, { useState } from "react";
import "./Sidebar.css";

const Sidebar = () => {
  // Danh sách menu với các mục con
  const menuItems = [
    {
      title: "Thống kê",
      subItems: [],
    },
    {
      title: "Quản lý người dùng",
      subItems: [],
    },
    {
      title: "Quản lý tài liệu",
      subItems: ["Kế hoạch bài dạy", "Game", "Video thí nghiệm"],
    },
    {
      title: "Quản lý bài tập",
      subItems: [],
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
              {item.title}
            </div>
            {item.subItems.length > 0 && (
              <ul className={`submenu ${expanded === index ? "open" : ""}`}>
                {item.subItems.map((subItem, subIndex) => (
                  <li key={subIndex} className="submenu-item">
                    {subItem}
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