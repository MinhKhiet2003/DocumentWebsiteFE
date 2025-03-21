import React from 'react';
import { useParams } from 'react-router-dom';
import './ExperimentVideoDetail.css';

const ExperimentVideoDetail = () => {
  const { id } = useParams(); // Lấy ID từ URL

  // Giả sử bạn có dữ liệu chi tiết
  const video = {
    id: 1,
    title: "Video thí nghiệm 1",
    author: "Tác giả: Trần Kim Thanh",
    content: "Nội dung chi tiết của video...",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // URL video (ví dụ)
  };

  return (
    <div className="video-detail-container">
      <h1>{video.title}</h1>
      <p>{video.author}</p>
      <div className="video-wrapper">
        <iframe
          src={video.videoUrl}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
      <p>{video.content}</p>
    </div>
  );
};

export default ExperimentVideoDetail;