import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../../../components/Sidebar/Sidebar';
import { AuthContext } from '../../../../Auth/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import './GameDetail.css'; 

const GameDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isValidUrl, setIsValidUrl] = useState(true);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        if (!user) {
          navigate('/login');
          return;
        }

        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5168/api/Game/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('token');
            navigate('/login');
            return;
          }
          throw new Error('Không thể tải thông tin game');
        }

        const data = await response.json();
        setGame(data);
        
        // Kiểm tra URL game (nếu có)
        if (data.gameUrl) {
          const isValid = validateGameUrl(data.gameUrl);
          setIsValidUrl(isValid);
          if (!isValid) {
            toast.error('Đường dẫn game không hợp lệ');
          }
        }
      } catch (err) {
        toast.error(err.message || 'Đã xảy ra lỗi khi tải game');
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [id, user, navigate]);
  const handleGoBack = () => {
    navigate(`/resources/games${location.search}`);
  };
  const validateGameUrl = (url) => {
    try {
      const urlObj = new URL(url);
      // Thêm các điều kiện kiểm tra URL game tùy theo yêu cầu
      return true;
    } catch {
      return false;
    }
  };

  const handlePlayGame = (e) => {
    if (!isValidUrl) {
      e.preventDefault();
      toast.error('Không thể mở game do đường dẫn không hợp lệ');
    }
  };

  if (!user) return null;

  if (loading) return (
        <p>Đang tải game...</p>
  );

  if (!game) return (
        <p>Không tìm thấy game</p>
  );

  return (
    <div className="game-detail">
      <div className='game-title'>
          <h1>{game.title}</h1>
          <button onClick={handleGoBack} className="back-button">← Quay lại</button>
        </div>
      
      <div className="game-meta">
        <p><strong>Tác giả:</strong> {game.uploadedByUsername || "Không xác định"}</p>
        <p><strong>Ngày tạo:</strong> {new Date(game.createdAt).toLocaleDateString()}</p>
        <p><strong>Cập nhật lần cuối:</strong> {new Date(game.updatedAt).toLocaleDateString()}</p>
      </div>

      {game.description && (
        <div className="game-description">
          <h2>Mô tả</h2>
          <p>{game.description}</p>
        </div>
      )}

      {game.imageUrl && (
        <div className="game-image">
          <img src={game.imageUrl} alt={game.title} />
        </div>
      )}

      {game.gameUrl && (
        <div className="game-content">
          <h2>Chơi game</h2>
          
          {isValidUrl ? (
            <>
              <div className="game-embed-container">
                <iframe
                  src={game.gameUrl}
                  className="game-embed"
                  title={game.title}
                  allowFullScreen
                />
              </div>
              <div className="game-actions">
                <a 
                  href={game.gameUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="play-link"
                  onClick={handlePlayGame}
                >
                  Mở trong cửa sổ mới
                </a>
              </div>
            </>
          ) : (
            <div className="game-error">
              <p>Game không khả dụng, vui lòng phản ánh lại với giáo viên !</p>
            </div>
          )}
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default GameDetail;