import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  // Danh sách menu với các mục con
  const menuItems = [
    {
      title: "Kế hoạch bài dạy",
      subItems: ["Chương trình học", "Lịch dạy", "Tài liệu tham khảo"]
    },
    {
      title: "Game",
      subItems: ["Game giáo dục", "Game giải trí"]
    },
    {
      title: "Video thí nghiệm",
      subItems: ["Video 1", "Video 2", "Video 3"]
    },
    {
      title: "Bài tập",
      subItems: ["Bài tập về nhà", "Bài tập nhóm"]
    },
  ];

  // State lưu index của mục đang được mở (dropdown)
  const [expanded, setExpanded] = useState(null);

  // Hàm toggle mở/đóng menu
  const toggleMenu = (index) => {
    setExpanded(expanded === index ? null : index);
  };

  return (
    <div className="sidebar">
      <aside>
        <input type="text" className="form-control" placeholder="Search" />
        <ul className="list-group">
          {menuItems.map((item, index) => (
            <li className="list-group-item" key={index}>
              <div className="menu-item" onClick={() => toggleMenu(index)}>
                {item.title}
              </div>
              <ul className={`sub-menu ${expanded === index ? 'open' : ''}`}>
                {item.subItems && item.subItems.map((subItem, subIndex) => (
                  <li className="sub-menu-item" key={subIndex}>
                    {subItem}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </aside>
      <div className="sidebar-footer">
        <p>&copy; SciPlay - Trường ĐHSP Hà Nội</p>
      </div>
    </div>
  );
};

export default Sidebar;
