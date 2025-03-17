import React from 'react';
import Sidebar from '../../../components/Sidebar/Sidebar';

const Games = () => {
  const games = [
    {
      title: "Game giáo dục 1",
      author: "Tác giả: Trần Kim Thanh",
    },
    {
      title: "Game giáo dục 2",
      author: "Tác giả: Đàm Thị Ánh Điệp",
    },
    {
      title: "Game giải trí 1",
      author: "Tác giả: Nguyễn Văn A",
    },
    {
      title: "Game giải trí 2",
      author: "Tác giả: Phạm Văn B",
    },
    {
      title: "Game giáo dục 1",
      author: "Tác giả: Trần Kim Thanh",
    },
    {
      title: "Game giáo dục 2",
      author: "Tác giả: Đàm Thị Ánh Điệp",
    },
    {
      title: "Game giải trí 1",
      author: "Tác giả: Nguyễn Văn A",
    },
    {
      title: "Game giải trí 2",
      author: "Tác giả: Phạm Văn B",
    },
    {
      title: "Game giáo dục 1",
      author: "Tác giả: Trần Kim Thanh",
    },
    {
      title: "Game giáo dục 2",
      author: "Tác giả: Đàm Thị Ánh Điệp",
    },
    {
      title: "Game giải trí 1",
      author: "Tác giả: Nguyễn Văn A",
    },
    {
      title: "Game giải trí 2",
      author: "Tác giả: Phạm Văn B",
    },
    {
      title: "Game giáo dục 1",
      author: "Tác giả: Trần Kim Thanh",
    },
    {
      title: "Game giáo dục 2",
      author: "Tác giả: Đàm Thị Ánh Điệp",
    },
    {
      title: "Game giải trí 1",
      author: "Tác giả: Nguyễn Văn A",
    },
    {
      title: "Game giải trí 2",
      author: "Tác giả: Phạm Văn B",
    },
  ];

  return (
    <div className="flex-wrap">
        <Sidebar />
    <div className="Resource-container">
      <h1>Games</h1>
      <div className="cards-grid">
        {games.map((game, index) => (
          <div key={index} className="card">
            <div className="card-image">
              <img
                src="https://via.placeholder.com/150"
                alt="Placeholder"
              />
            </div>
            <div className="card-content">
              <h3>{game.title}</h3>
              <p>{game.author}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default Games;