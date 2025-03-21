import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../../components/Sidebar/Sidebar';
import Pagination from '../../../components/Pagination/Pagination';

const Videos = () => {
  const videos = [
    {
      id: 1,
      title: "Video thí nghiệm 1",
      author: "Tác giả: Trần Kim Thanh",
    },
    {
      id: 2,
      title: "Video thí nghiệm 2",
      author: "Tác giả: Đàm Thị Ánh Điệp",
    },
    {
      id: 3,
      title: "Video thí nghiệm 3",
      author: "Tác giả: Nguyễn Văn A",
    },
    {
      id: 4,
      title: "Video thí nghiệm 4",
      author: "Tác giả: Phạm Văn B",
    },
    {
      id: 1,
      title: "Video thí nghiệm 1",
      author: "Tác giả: Trần Kim Thanh",
    },
    {
      id: 2,
      title: "Video thí nghiệm 2",
      author: "Tác giả: Đàm Thị Ánh Điệp",
    },
    {
      id: 3,
      title: "Video thí nghiệm 3",
      author: "Tác giả: Nguyễn Văn A",
    },
    {
      id: 4,
      title: "Video thí nghiệm 4",
      author: "Tác giả: Phạm Văn B",
    },
  ];

  // State cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Số lượng video hiển thị trên mỗi trang

  // Tính toán video hiển thị trên trang hiện tại
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentVideos = videos.slice(indexOfFirstItem, indexOfLastItem);

  // Hàm xử lý khi chuyển trang
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="flex-wrap">
      <Sidebar />
      <div className="Resource-container">
        <h1>Videos</h1>
        <div className="cards-grid">
          {currentVideos.map((video) => (
            <Link
              to={`/experiment-videos/${video.id}`} // Chuyển hướng đến trang chi tiết
              key={video.id}
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
                  <h3>{video.title}</h3>
                  <p>{video.author}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
        {/* Phân trang */}
        <Pagination
          totalItems={videos.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default Videos;