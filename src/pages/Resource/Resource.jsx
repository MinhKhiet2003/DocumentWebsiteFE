import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import './Resource.css';
import Tabs from '../../components/Tabs/Tabs';
import Pagination from '../../components/Pagination/Pagination';

const Resource = () => {
  const categories = [
    {
      name: "Kế hoạch bài dạy",
      path: "/lesson-plans",
      items: [
        {
          id: 1,
          title: "Lớp 8. Luyện tập chung công trừ phản thức",
          author: "Tác giả: Trần Kim Thanh",
        },
        {
          id: 2,
          title: " Bài 19: Rượu etylic, axit axetic và chất hữu cơ",
          author: "Tác giả: Đàm Thị Ánh Điệp",
        },
        {
          id: 3,
          title: " Bài 19: Rượu etylic, axit axetic và chất hữu cơ",
          author: "Tác giả: Đàm Thị Ánh Điệp",
        }
      ],
    },
    {
      name: "Game",
      path: "/games",
      items: [
        {
          id: 1,
          title: "Game giáo dục 1",
          author: "Tác giả: Nguyễn Văn A",
        },
        {
          id: 2,
          title: "Game giải trí 1",
          author: "Tác giả: Nguyễn Văn B",
        },
        {
          id: 3,
          title: "Game giải trí 2",
          author: "Tác giả: Nguyễn Văn B",
        }
      ],
    },
    {
      name: "Video thử nghiệm",
      path: "/experiment-videos",
      items: [
        {
          id: 1,
          title: "Video thí nghiệm 1",
          author: "Tác giả: Lê Thị D",
        },
        {
          id: 2,
          title: "Video thí nghiệm 2",
          author: "Tác giả: Phạm Văn E",
        },
        {
          id: 3,
          title: "Video thí nghiệm 3",
          author: "Tác giả: Phạm Văn E",
        }
      ],
    },
    {
      name: "Bài tập",
      path: "/exercises",
      items: [
        {
          id: 1,
          title: "Bài tập về nhà",
          author: "Tác giả: Đoàn Văn G",
        },
        {
          id: 2,
          title: "Bài tập nhóm",
          author: "Tác giả: Hoàng Thị H",
        },
        {
          id: 3,
          title: "Bài tập nhóm",
          author: "Tác giả: Hoàng Thị H",
        }
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
              <Link to={category.path} className="view-all-link">
                Xem tất cả &gt;
              </Link>
            </div>

            <div className="cards-grid">
              {category.items.map((item) => (
                <Link
                  to={`${category.path}/${item.id}`} // Đường dẫn đến trang chi tiết
                  key={item.id}
                  className="card-link"
                >
                  <div className="card">
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
                </Link>
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