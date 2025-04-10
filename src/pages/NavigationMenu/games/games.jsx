import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../../../components/Sidebar/Sidebar';
import { AuthContext } from '../../../Auth/AuthContext';
import Tabs from '../../../components/Tabs/Tabs';
import './games.css';
  const Games = () => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentCategory, setCurrentCategory] = useState(null);
    const [classifyFilter, setClassifyFilter] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
      const fetchData = async () => {
        try {
          const token = localStorage.getItem('token');
          
          if (!user) {
            navigate('/login');
            return;
          }

          setLoading(true);
          setError(null);

          const queryParams = new URLSearchParams(location.search);
          const categoryId = queryParams.get('categoryId');
          const searchQuery = queryParams.get('search');
          const classId = queryParams.get('classId');

          let apiUrl = 'https://hachieve.runasp.net/api/Game/search';

          // Tạo query params cho API
          const apiParams = new URLSearchParams();
          if (searchQuery) apiParams.set('name', searchQuery);
          if (categoryId) apiParams.set('categoryId', categoryId);
          if (classId) apiParams.set('classId', classId);
          if (classifyFilter) apiParams.set('classify', classifyFilter);

          apiUrl += `?${apiParams.toString()}`;

          if (categoryId) {
            const categoryResponse = await fetch(`https://hachieve.runasp.net/api/Categories/${categoryId}`, {
              headers: { 'Authorization': `Bearer ${token}` },
            });

            if (categoryResponse.ok) {
              const categoryData = await categoryResponse.json();
              setCurrentCategory(categoryData);
            }
          } else {
            setCurrentCategory(null);
          }

          // Lấy danh sách game
          const response = await fetch(apiUrl, {
            headers: { 'Authorization': `Bearer ${token}` },
          });

          if (!response.ok) {
            if (response.status === 401) {
              localStorage.removeItem('token');
              navigate('/login');
              return;
            }
            throw new Error(response.status === 404 ? 'Không tìm thấy game nào' : 'Lỗi khi tải dữ liệu game');
          }

          const data = await response.json();
          setGames(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, [user, navigate, location.search,classifyFilter]);

    const handleCardClick = (e, gameId) => {
      if (!user) {
        e.preventDefault();
        navigate('/login');
      }
    };
    const handleClassifyChange = (e) => {
      setClassifyFilter(e.target.value);
    };
    if (loading) {
      return (
        <div className="flex-wrap">
          <Sidebar />
          <div className="Resource-container">
            <Tabs />
            <h1>Games{currentCategory && `: ${currentCategory.name}`}</h1>
            <div className="d-flex justify-content-center my-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Đang tải...</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex-wrap">
          <Sidebar />
          <div className="Resource-container">
            <Tabs />
            <h1>Games{currentCategory && `: ${currentCategory.name}`}</h1>
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
            <button 
              className="btn btn-primary mt-3"
              onClick={() => window.location.reload()}
            >
              Thử lại
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex-wrap">
        <Sidebar />
        <div className="Resource-container">
          <Tabs />
            <div className="game-header">
              <h1>Games{currentCategory && `: ${currentCategory.name}`}</h1>
              <select
                className="form-select"
                value={classifyFilter}
                onChange={handleClassifyChange}
              >
                <option value="">Tất cả</option>
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
              </select>
            </div>
          {games.length === 0 ? (
            <div className="alert alert-info mt-3" role="alert">
              Không có game nào được tìm thấy.
            </div>
          ) : (
            <div className="cards-grid">
              {games.map((game) => (
                <Link
                  to={`/resources/games/${game.id}`}
                  key={game.id}
                  className="card-link"
                  onClick={(e) => handleCardClick(e, game.id)}
                >
                  <div className="card">
                    <div className="card-image">
                      <img
                        src={game.imageUrl || "https://hoctot.hocmai.vn/wp-content/uploads/2020/07/on-tap-hoa-hoc.png"}
                        alt={game.title}
                      />
                    </div>
                    <div className="card-content">
                      <h3>{game.title}</h3>
                      <p className="text-muted">{game.description || "Không có mô tả"}</p>
                      <p><small>Phân loại: {game.classify || "Không xác định"}</small></p>
                      <p><small>Tác giả: {game.uploadedByUsername || "Không xác định"}</small></p>
                      <p><small>Ngày tạo: {new Date(game.createdAt).toLocaleDateString()}</small></p>
                      <div className="card-footer">
                        <span className="text-warning">⭐⭐⭐⭐⭐</span>
                        <span className="ms-2">{game.commentCount} phản hồi</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  export default Games;