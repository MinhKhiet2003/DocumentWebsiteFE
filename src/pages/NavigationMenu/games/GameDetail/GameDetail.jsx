import React from 'react';
import { useParams } from 'react-router-dom';

const GameDetail = () => {
  const { id } = useParams(); // Lấy ID từ URL

  // Giả sử bạn có dữ liệu chi tiết
  const game = {
    id: 1,
    title: "Game giáo dục 1",
    author: "Tác giả: Nguyễn Văn A",
    content: "Nội dung chi tiết của game...",
  };

  return (
    <div>
      <h1>{game.title}</h1>
      <p>{game.author}</p>
      <p>{game.content}</p>
    </div>
  );
};

export default GameDetail;