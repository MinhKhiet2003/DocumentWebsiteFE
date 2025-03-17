import React from 'react';
import { Link } from 'react-router-dom'; // Thay useNavigate bằng Link
import Sidebar from '../../components/Sidebar/Sidebar';
import './Resource.css';
import Tabs from '../../components/Tabs/Tabs';
import Pagination from '../../components/Pagination/Pagination';

const Resource = () => {
  const categories = [
    {
      name: "Kế hoạch bài dạy",
      path: "/lesson-plans", // Đường dẫn tương ứng
      items: [
        {
          title: "Lớp 8. Luyện tập chung công trừ phản thức",
          author: "Tác giả: Trần Kim Thanh",
        },
        {
          title: "Hóa học 9 - KHTN: Bài 19: Rượu etylic, axit axetic và chất hữu cơ",
          author: "Tác giả: Đàm Thị Ánh Điệp",
        },
        {
          title: "Bài 48. Luyện tập: Rượu etylic, axit axetic và chất hữu cơ",
          author: "Tác giả: Đàm Thị Ánh Điệp",
        },
      ],
    },
    {
      name: "Game",
      path: "/games", // Đường dẫn tương ứng
      items: [
        {
          title: "Lớp 8. Luyện tập chung công trừ phản thức",
          author: "Tác giả: Nguyễn Văn A",
        },
        {
          title: "Hóa học 9 - KHTN: Bài 19: Rượu etylic, axit axetic và chất hữu cơ",
          author: "Tác giả: Nguyễn Văn B",
        },
        {
          title: "Bài 48. Luyện tập: Rượu etylic, axit axetic và chất hữu cơ",
          author: "Tác giả: Nguyễn Văn C",
        },
      ],
    },
    {
      name: "Video thử nghiệm",
      path: "/experiment-videos", // Đường dẫn tương ứng
      items: [
        {
          title: "Lớp 8. Luyện tập chung công trừ phản thức",
          author: "Tác giả: Lê Thị D",
        },
        {
          title: "Hóa học 9 - KHTN: Bài 19: Rượu etylic, axit axetic và chất hữu cơ",
          author: "Tác giả: Phạm Văn E",
        },
        {
          title: "Bài 48. Luyện tập: Rượu etylic, axit axetic và chất hữu cơ",
          author: "Tác giả: Trần Thị F",
        },
      ],
    },
    {
      name: "Bài tập",
      path: "/exercises", // Đường dẫn tương ứng
      items: [
        {
          title: "Lớp 8. Luyện tập chung công trừ phản thức",
          author: "Tác giả: Đoàn Văn G",
        },
        {
          title: "Hóa học 9 - KHTN: Bài 19: Rượu etylic, axit axetic và chất hữu cơ",
          author: "Tác giả: Hoàng Thị H",
        },
        {
          title: "Bài 48. Luyện tập: Rượu etylic, axit axetic và chất hữu cơ",
          author: "Tác giả: Trịnh Văn I",
        },
      ],
    },
  ];

  return (
    <div className="flex-wrap">
      <Sidebar />
      <div className="Resource-container">
        <Tabs />
        {categories.map((category, index) => (
          <div key={index} className="category-section">
            <div className="category-header">
              <h2>{category.name}</h2>
              {/* Sử dụng Link thay vì thẻ <a> */}
              <Link to={category.path} className="view-all-link">
                Xem tất cả &gt;
              </Link>
            </div>

            <div className="cards-grid">
              {category.items.map((item, idx) => (
                <div key={idx} className="card">
                  <div className="card-image">
                    <img
                      src="https://via.placeholder.com/150"
                      alt="Placeholder"
                    />
                  </div>
                  <div className="card-content">
                    <h3>{item.title}</h3>
                    <p>{item.author}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        <Pagination />
      </div>
    </div>
  );
};

export default Resource;