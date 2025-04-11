import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../../Auth/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import UserRating from '../../../../components/StarRating/UserRating';
import 'react-toastify/dist/ReactToastify.css';
import './GameDetail.css';

const GameDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isValidUrl, setIsValidUrl] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedContent, setEditedContent] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(null);

  useEffect(() => {
    const fetchGameAndComments = async () => {
      try {
        if (!user) {
          navigate('/login');
          return;
        }

        const token = localStorage.getItem('token');
        const [gameResponse, commentsResponse] = await Promise.all([
          fetch(`https://hachieve.runasp.net/api/Game/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` },
          }),
          fetch(`https://hachieve.runasp.net/api/comment?gameId=${id}`, {
            headers: { 'Authorization': `Bearer ${token}` },
          }),
        ]);

        if (!gameResponse.ok || !commentsResponse.ok) {
          if (gameResponse.status === 401 || commentsResponse.status === 401) {
            localStorage.removeItem('token');
            navigate('/login');
            return;
          }
          throw new Error('Không thể tải dữ liệu');
        }

        const gameData = await gameResponse.json();
        const commentsData = await commentsResponse.json();

        setGame(gameData);
        setComments(commentsData);

        if (gameData.gameUrl) {
          const isValid = validateGameUrl(gameData.gameUrl);
          setIsValidUrl(isValid);
          if (!isValid) {
            toast.error('Đường dẫn game không hợp lệ');
          }
        }
      } catch (err) {
        toast.error(err.message || 'Đã xảy ra lỗi khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchGameAndComments();
  }, [id, user, navigate]);

  const handleGoBack = () => {
    navigate(`/resources/games${location.search}`);
  };

  const validateGameUrl = (url) => {
    try {
      const urlObj = new URL(url);
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

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      toast.error('Vui lòng nhập nội dung bình luận');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://hachieve.runasp.net/api/comment', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newComment,
          userId: user.id,
          gameId: parseInt(id),
        }),
      });

      if (!response.ok) {
        throw new Error('Không thể gửi bình luận');
      }

      const addedComment = await response.json();
      const updatedComment = {
        ...addedComment,
        user: {
          user_id: user.id,
          username: user.username || 'Người dùng', 
        },
        createdAt: new Date().toISOString(),
      };
      setComments([...comments, updatedComment]);
      toast.success('Bình luận đã được gửi');
    } catch (err) {
      toast.error(err.message || 'Đã xảy ra lỗi khi gửi bình luận');
    }
  };

  const handleEditComment = (comment) => {
    setEditingCommentId(comment.comment_id);
    setEditedContent(comment.content);
    setDropdownOpen(null);
  };

  const handleUpdateComment = async (commentId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://hachieve.runasp.net/api/comment/${commentId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: editedContent,
          userId: user.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Không thể cập nhật bình luận');
      }

      const updatedComment = await response.json();
      setComments(comments.map(c => (c.comment_id === commentId ? updatedComment : c)));
      setEditingCommentId(null);
      setEditedContent('');
      toast.success('Bình luận đã được cập nhật');
    } catch (err) {
      toast.error(err.message || 'Đã xảy ra lỗi khi cập nhật bình luận');
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://hachieve.runasp.net/api/comment/${commentId}?userId=${user.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Không thể xóa bình luận');
      }

      setComments(comments.filter(c => c.comment_id !== commentId));
      toast.success('Bình luận đã được xóa');
    } catch (err) {
      toast.error(err.message || 'Đã xảy ra lỗi khi xóa bình luận');
    }
  };

  const toggleDropdown = (commentId) => {
    setDropdownOpen(dropdownOpen === commentId ? null : commentId);
  };

  if (!user) return null;
  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (!game) return <p>Không tìm thấy game</p>;

  return (
    <div className="game-detail">
      <div className='game-title'>
        <h1>{game.title}</h1>
        <button onClick={handleGoBack} className="back-button">← Quay lại</button>
      </div>
      
      <div className="game-meta">
        <p><strong>Tác giả:</strong> {game.uploadedByUsername || "Không xác định"}</p>
        <p><strong>Phân loại:</strong> {game.classify || "Không xác định"}</p>
        <p><strong>Ngày tạo:</strong> {new Date(game.createdAt).toLocaleDateString()}</p>
        <p><strong>Cập nhật lần cuối:</strong> {new Date(game.updatedAt).toLocaleDateString()}</p>
      </div>
      <div className="game-rating">
        <UserRating
          userId={user?.id}
          gameId={parseInt(id)}
          initialUserRating={game.userRating || 0}
          initialAverageRating={game.averageRating || 0}
        />
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

      {/* Comments Section */}
      <div className="comments-section">
        <h2>Bình luận</h2>
        <div className="comments-list">
          {comments.length > 0 ? (
            comments.map(comment => (
              <div key={comment.comment_id} className="comment-item">
                <div className="comment-header">
                  <span className="comment-author">{comment.user?.username || 'Người dùng'}</span>
                  <div className="comment-meta">
                    <span className="comment-date">
                      {new Date(comment.createdAt).toLocaleString()}
                    </span>
                    {comment.user_id === user.id && (
                      <div className="comment-actions">
                        <button
                          className="more-options"
                          onClick={() => toggleDropdown(comment.comment_id)}
                        >
                          ⋮
                        </button>
                        {dropdownOpen === comment.comment_id && (
                          <div className="dropdown-menu">
                            <button onClick={() => handleEditComment(comment)}>Sửa</button>
                            <button onClick={() => handleDeleteComment(comment.comment_id)}>Xóa</button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                {editingCommentId === comment.comment_id ? (
                  <div className="edit-comment">
                    <textarea
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                    />
                    <div className="edit-actions">
                      <button onClick={() => handleUpdateComment(comment.comment_id)}>Lưu</button>
                      <button onClick={() => setEditingCommentId(null)}>Hủy</button>
                    </div>
                  </div>
                ) : (
                  <p className="comment-content">{comment.content}</p>
                )}
              </div>
            ))
          ) : (
            <p>Chưa có bình luận nào.</p>
          )}
        </div>

        <form className="comment-form" onSubmit={handleCommentSubmit}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Viết bình luận của bạn..."
          />
          <button type="submit">Gửi</button>
        </form>
      </div>

      <ToastContainer />
    </div>
  );
};

export default GameDetail;