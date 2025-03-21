import React from 'react';
import { useParams } from 'react-router-dom';

const LessonPlanDetail = () => {
  const { id } = useParams(); // Lấy ID từ URL

  // Giả sử bạn có dữ liệu chi tiết
  const lessonPlan = {
    id: 1,
    title: "Lớp 8. Luyện tập chung công trừ phản thức",
    author: "Tác giả: Trần Kim Thanh",
    content: "Nội dung chi tiết của kế hoạch bài dạy...",
  };

  return (
    <div>
      <h1>{lessonPlan.title}</h1>
      <p>{lessonPlan.author}</p>
      <p>{lessonPlan.content}</p>
    </div>
  );
};

export default LessonPlanDetail;