import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import './Resource.css';
import StarRating from '../../components/StarRating/StarRating';
import { AuthContext } from '../../Auth/AuthContext';
import { toast, ToastContainer } from 'react-toastify';

const Resource = () => {
  const { user } = useContext(AuthContext);
  const [categories, setCategories] = useState([
    {
      name: "Kế hoạch bài dạy",
      path: "/resources/lesson-plans",
      items: [],
    },
    {
      name: "Game",
      path: "/resources/games",
      items: [],
    },
    {
      name: "Video thí nghiệm",
      path: "/resources/experiment-videos",
      items: [],
    }
  ]);

  useEffect(() => {
    const fetchRandomData = async () => {
      try {
        const docResponse = await fetch('https://hachieve.runasp.net/api/Document/random');
        const documents = await docResponse.json();
        
        const gameResponse = await fetch('https://hachieve.runasp.net/api/Game/random');
        const games = await gameResponse.json();
        
        const videoResponse = await fetch('https://hachieve.runasp.net/api/Video/random');
        const videos = await videoResponse.json();

        setCategories(prev => [
          {
            ...prev[0],
            items: documents.map(doc => ({
              id: doc.id || doc.Id,
              title: doc.title,
              description: doc.description || "Không có mô tả",
              author: `Tác giả: ${doc.uploadedByUsername}`,
              date: doc.createdAt || "Không xác định",
              commentCount: doc.commentCount || 0,
              averageRating: doc.averageRating || 0,
            }))
          },
          {
            ...prev[1],
            items: games.map(game => ({
              id: game.Id || game.id,
              title: game.title,
              description: game.description || "Không có mô tả",
              author: `Tác giả: ${game.uploadedByUsername}`,
              date: game.createdAt || "Không xác định",
              commentCount: game.commentCount || 0,
              averageRating: game.averageRating || 0,
            }))
          },
          {
            ...prev[2],
            items: videos.map(video => ({
              id: video.video_id || video.Id,
              title: video.title,
              description: video.description || "Không có mô tả",
              author: `Tác giả: ${video.uploadedByUsername}`,
              date: video.created_at || "Không xác định",
              commentCount: video.commentCount || 0,
              averageRating: video.averageRating || 0,
            }))
          },
        ]);
      } catch (error) {
        toast.error('Lỗi khi lấy dữ liệu: ' + error.message);
      }
    };

    fetchRandomData();
  }, []);

  return (
    <div className="flex-wrap">
      <Sidebar />
      <div className="Resource-container">
        {categories.map((category, index) => (
          <div key={index} className="category-section">
            <div className="category-header">
              <h2>{category.name}</h2>
              <Link to={category.path} className="view-all-link">
                Xem tất cả 
              </Link>
            </div>

            <div className="cards-grid">
              {category.items.map((item) => (
                <Link
                  to={`${category.path}/${item.id}`}
                  key={item.id}
                  className="card-link"
                >
                  <div className="card">
                    <div className="card-image">
                      <img
                        src="https://hoctot.hocmai.vn/wp-content/uploads/2020/07/on-tap-hoa-hoc.png"
                        alt="Placeholder"
                      />
                    </div>
                    <div className="card-content">
                      <h3>{item.title}</h3>
                      <p className="text-muted">{item.description || "Không có mô tả"}</p>
                      <p className="card-author">{item.author}</p>
                      <div className="card-footer">
                        <StarRating 
                          averageRating={item.averageRating || 0} 
                          starSize="0.9rem"
                          className="card-rating"
                        />
                        <span>{item.commentCount} phản hồi</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Resource;