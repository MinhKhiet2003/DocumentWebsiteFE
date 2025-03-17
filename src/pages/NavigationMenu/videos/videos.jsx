import React from 'react';
import Sidebar from '../../../components/Sidebar/Sidebar';

const Videos = () => {
  const videos = [
    {
      title: "Video thí nghiệm 1",
      author: "Tác giả: Trần Kim Thanh",
    },
    {
      title: "Video thí nghiệm 2",
      author: "Tác giả: Đàm Thị Ánh Điệp",
    },
    {
      title: "Video thí nghiệm 3",
      author: "Tác giả: Nguyễn Văn A",
    },
    {
      title: "Video thí nghiệm 4",
      author: "Tác giả: Phạm Văn B",
    },
    {
      title: "Video thí nghiệm 1",
      author: "Tác giả: Trần Kim Thanh",
    },
    {
      title: "Video thí nghiệm 2",
      author: "Tác giả: Đàm Thị Ánh Điệp",
    },
    {
      title: "Video thí nghiệm 3",
      author: "Tác giả: Nguyễn Văn A",
    },
    {
      title: "Video thí nghiệm 4",
      author: "Tác giả: Phạm Văn B",
    },
    {
      title: "Video thí nghiệm 1",
      author: "Tác giả: Trần Kim Thanh",
    },
    {
      title: "Video thí nghiệm 2",
      author: "Tác giả: Đàm Thị Ánh Điệp",
    },
    {
      title: "Video thí nghiệm 3",
      author: "Tác giả: Nguyễn Văn A",
    },
    {
      title: "Video thí nghiệm 4",
      author: "Tác giả: Phạm Văn B",
    },
    {
      title: "Video thí nghiệm 1",
      author: "Tác giả: Trần Kim Thanh",
    },
    {
      title: "Video thí nghiệm 2",
      author: "Tác giả: Đàm Thị Ánh Điệp",
    },
    {
      title: "Video thí nghiệm 3",
      author: "Tác giả: Nguyễn Văn A",
    },
    {
      title: "Video thí nghiệm 4",
      author: "Tác giả: Phạm Văn B",
    },
  ];

  return (
    <div className="flex-wrap">
        <Sidebar />
    <div className="Resource-container">
      <h1>Videos</h1>
      <div className="cards-grid">
        {videos.map((video, index) => (
          <div key={index} className="card">
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
        ))}
      </div>
    </div>
    </div>
  );
};

export default Videos;