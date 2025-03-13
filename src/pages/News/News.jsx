import React, { useState } from 'react';
import './News.css';
// Dữ liệu mẫu (giả định lấy từ trang web)
const newsData = [
    {
      title: 'Hội thảo khoa học quốc tế về Hóa học',
      description:
        'Khoa Hóa học tổ chức hội thảo quốc tế với sự tham gia của các nhà khoa học đầu ngành. Chủ đề tập trung vào các ứng dụng mới của vật liệu nano trong y học.',
      date: '2024-05-15',
      image: 'https://picsum.photos/200/150?random=1', // Ảnh demo
    },
    {
      title: 'Sinh viên đạt giải thưởng nghiên cứu',
      description:
        'Sinh viên khoa Hóa đạt giải nhất cuộc thi nghiên cứu khoa học cấp trường với đề tài về tổng hợp các hợp chất hữu cơ mới.',
      date: '2024-05-10',
    },
    {
      title: 'Công bố kết quả nghiên cứu trên tạp chí quốc tế',
      description:
        'Nhóm nghiên cứu của khoa công bố bài báo trên tạp chí SCI về lĩnh vực xúc tác hóa học và năng lượng tái tạo.',
      date: '2024-05-01',
      image: 'https://picsum.photos/200/150?random=2', // Ảnh demo
    },
    {
      title: 'Chương trình trao đổi sinh viên với Đại học ABC',
      description:
        'Khoa Hóa học hợp tác với Đại học ABC (Mỹ) để triển khai chương trình trao đổi sinh viên trong học kỳ mùa thu năm 2024.',
      date: '2024-04-28',
      image: 'https://picsum.photos/200/150?random=3',
    },
    {
      title: 'Tọa đàm về ứng dụng Trí tuệ nhân tạo trong nghiên cứu Hóa học',
      description:
        'Khoa Hóa học tổ chức buổi tọa đàm với sự tham gia của các chuyên gia về trí tuệ nhân tạo để thảo luận về các ứng dụng mới nhất trong lĩnh vực nghiên cứu hóa học.',
      date: '2024-04-20',
    },
    {
      title: 'Khánh thành phòng thí nghiệm trọng điểm',
      description:
        'Khoa Hóa học khánh thành và đưa vào sử dụng phòng thí nghiệm trọng điểm với các trang thiết bị hiện đại, phục vụ cho công tác nghiên cứu và đào tạo.',
      date: '2024-04-10',
      image: 'https://picsum.photos/200/150?random=4',
    },
    // Thêm các tin tức khác vào đây
  ];

const News = () => {
  const [newsList, setNewsList] = useState(newsData);

  return (
    <div className="news-container">
      <h2>Tin tức và Sự kiện về Nghiên cứu Khoa học</h2>
      <ul className="news-list">
        {newsList.map((news, index) => (
          <li key={index} className="news-item">
            {news.image && (
              <img
                src={news.image}
                alt={news.title}
                className="news-image"
              />
            )}
            <div className="news-content">
              <h3 className="news-title">{news.title}</h3>
              <p className="news-description">{news.description}</p>
              <p className="news-date">
                <strong>Ngày đăng:</strong> {news.date}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default News;