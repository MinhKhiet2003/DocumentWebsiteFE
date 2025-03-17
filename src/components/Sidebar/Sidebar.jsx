import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  // Danh sách menu với các mục con
  const menuItems = [
    {
      title: "Kế hoạch bài dạy",
      path: "/lesson-plans",
      subItems: [
        // { title: "Chương trình học", path: "/curriculum" },
        // { title: "Lịch dạy", path: "/schedule" },
        // { title: "Tài liệu tham khảo", path: "/references" },
      ],
    },
    {
      title: "Game",
      path: "/games",
      subItems: [
        // { title: "Game giáo dục", path: "/educational-games" },
        // { title: "Game giải trí", path: "/entertainment-games" },
      ],
    },
    {
      title: "Video thí nghiệm",
      path: "/experiment-videos",
      subItems: [
        // { title: "Video 1", path: "/video-1" },
        // { title: "Video 2", path: "/video-2" },
        // { title: "Video 3", path: "/video-3" },
      ],
    },
    {
      title: "Bài tập",
      path: "/exercises",
      subItems: [
        // { title: "Bài tập về nhà", path: "/homework" },
        // { title: "Bài tập nhóm", path: "/group-work" },
      ],
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
              {/* Link cho mục menu chính */}
              <Link to={item.path} className="menu-item" onClick={() => toggleMenu(index)}>
                {item.title}
              </Link>
              {/* Submenu */}
              <ul className={`sub-menu ${expanded === index ? 'open' : ''}`}>
                {item.subItems &&
                  item.subItems.map((subItem, subIndex) => (
                    <li className="sub-menu-item" key={subIndex}>
                      {/* Link cho mục submenu */}
                      <Link to={subItem.path}>{subItem.title}</Link>
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