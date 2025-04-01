import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import './Resource.css';
// import Pagination from '../../components/Pagination/Pagination';
import { AuthContext } from '../../Auth/AuthContext';
import { toast, ToastContainer } from 'react-toastify';

const Resource = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
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
      name: "Video thử nghiệm",
      path: "/resources/experiment-videos",
      items: [],
    }
  ]);

  useEffect(() => {
    const fetchRandomData = async () => {
      try {
        const docResponse = await fetch('http://localhost:5168/api/Document/random');
        const documents = await docResponse.json();
        
        const gameResponse = await fetch('http://localhost:5168/api/Game/random');
        const games = await gameResponse.json();
        
        const videoResponse = await fetch('http://localhost:5168/api/Video/random');
        const videos = await videoResponse.json();

        setCategories(prev => [
          {
            ...prev[0],
            items: documents.map(doc => ({
              id: doc.id || doc.Id,
              title: doc.title,
              author: `Tác giả: ${doc.uploadedByUsername}`,
            }))
          },
          {
            ...prev[1],
            items: games.map(game => ({
              id: game.Id || game.id,
              title: game.title,
              author: `Tác giả: ${game.uploadedByUsername}`,
            }))
          },
          {
            ...prev[2],
            items: videos.map(video => ({
              id: video.video_id || video.Id,
              title: video.title,
              author: `Tác giả: ${video.uploadedByUsername}`,
            }))
          },
        ]);
      } catch (error) {
        toast.error('Lỗi khi lấy dữ liệu :', error);
      }
    };

    fetchRandomData();
  }, []);

  const handleCardClick = (e, path) => {
    if (!user) {
      e.preventDefault();
      navigate('/login'); 
    }
  };

  return (
    <div className="flex-wrap">
      <Sidebar />
      <div className="Resource-container">
        {categories.map((category, index) => (
          <div key={index} className="category-section">
            <div className="category-header">
              <h2>{category.name}</h2>
              <Link 
                to={category.path} 
                className="view-all-link"
                onClick={(e) => !user && handleCardClick(e, category.path)}
              >
                Xem tất cả &gt;
              </Link>
            </div>

            <div className="cards-grid">
              {category.items.map((item) => (
                  <Link
                    to={`${category.path}/${item.id}`}
                    key={item.id}
                    className="card-link"
                    onClick={(e) => !user && handleCardClick(e, `${category.path}/${item.id}`)}
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
                      <p>{item.author}</p>
                      <div className="card-footer">
                        <p className="text-yellow-500">⭐⭐⭐⭐⭐</p>
                        <p>5 phản hồi</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
        {/* <Pagination /> */}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Resource;