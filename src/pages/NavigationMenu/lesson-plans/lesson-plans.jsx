import React from 'react';
import '../../Resource/Resource.css';
import Sidebar from '../../../components/Sidebar/Sidebar';
const LessonPlans = () => {
  const lessonPlans = [
    {
      title: "Kế hoạch bài dạy 1",
      author: "Tác giả: Trần Kim Thanh",
    },
    {
      title: "Kế hoạch bài dạy 2",
      author: "Tác giả: Đàm Thị Ánh Điệp",
    },
    {
      title: "Kế hoạch bài dạy 3",
      author: "Tác giả: Nguyễn Văn A",
    },
    {
      title: "Kế hoạch bài dạy 4",
      author: "Tác giả: Phạm Văn B",
    },
    {
      title: "Kế hoạch bài dạy 1",
      author: "Tác giả: Trần Kim Thanh",
    },
    {
      title: "Kế hoạch bài dạy 2",
      author: "Tác giả: Đàm Thị Ánh Điệp",
    },
    {
      title: "Kế hoạch bài dạy 3",
      author: "Tác giả: Nguyễn Văn A",
    },
    {
      title: "Kế hoạch bài dạy 4",
      author: "Tác giả: Phạm Văn B",
    },{
      title: "Kế hoạch bài dạy 1",
      author: "Tác giả: Trần Kim Thanh",
    },
    {
      title: "Kế hoạch bài dạy 2",
      author: "Tác giả: Đàm Thị Ánh Điệp",
    },
    {
      title: "Kế hoạch bài dạy 3",
      author: "Tác giả: Nguyễn Văn A",
    },
    {
      title: "Kế hoạch bài dạy 4",
      author: "Tác giả: Phạm Văn B",
    },
  ];

  return (
    <div className="flex-wrap">
        <Sidebar />
    <div className="Resource-container">
      <h1>Kế hoạch bài dạy</h1>
      <div className="cards-grid">
        {lessonPlans.map((lesson, index) => (
          <div key={index} className="card">
            <div className="card-image">
              <img
                src="https://via.placeholder.com/150"
                alt="Placeholder"
              />
            </div>
            <div className="card-content">
              <h3>{lesson.title}</h3>
              <p>{lesson.author}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default LessonPlans;