import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../../../Auth/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ChemistryComicsDetail.css';

const ChemistryComicsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const [comic, setComic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isValidUrl, setIsValidUrl] = useState(true);
  const [isGoogleSlide, setIsGoogleSlide] = useState(false);
  const [slideId, setSlideId] = useState('');
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedContent, setEditedContent] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(null);

  useEffect(() => {
    const fetchComicAndComments = async () => {
      try {
        if (!user) {
          navigate('/login');
          return;
        }

        const token = localStorage.getItem('token');
        const [comicResponse, commentsResponse] = await Promise.all([
          fetch(`https://hachieve.runasp.net/api/Comic/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` },
          }),
          fetch(`https://hachieve.runasp.net/api/Comic/${id}/comments`, {
            headers: { 'Authorization': `Bearer ${token}` },
          }),
        ]);

        if (!comicResponse.ok || !commentsResponse.ok) {
          if (comicResponse.status === 401 || commentsResponse.status === 401) {
            localStorage.removeItem('token');
            navigate('/login');
            return;
          }
          throw new Error('Không thể tải dữ liệu');
        }

        const comicData = await comicResponse.json();
        const commentsData = await commentsResponse.json();

        setComic(comicData);
        setComments(commentsData);

        if (comicData.comic_url) {
          const { isValid, isSlide, id: slideId } = checkGoogleSlideUrl(comicData.comic_url);
          setIsValidUrl(isValid);
          setIsGoogleSlide(isSlide);
          setSlideId(slideId);

          if (!isValid) {
            toast.error('Đường dẫn truyện tranh không hợp lệ');
          }
        }
      } catch (err) {
        toast.error(err.message || 'Đã xảy ra lỗi khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchComicAndComments();
  }, [id, user, navigate]);

  const checkGoogleSlideUrl = (url) => {
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname !== 'docs.google.com') return { isValid: true, isSlide: false, id: '' };

      const pathParts = urlObj.pathname.split('/');
      if (pathParts[1] === 'presentation' && pathParts[2] === 'd' && pathParts.length >= 4) {
        return {
          isValid: true,
          isSlide: true,
          id: pathParts[3],
        };
      }
      return { isValid: true, isSlide: false, id: '' };
    } catch {
      return { isValid: false, isSlide: false, id: '' };
    }
  };

  const handleGoBack = () => {
    navigate(location.state?.from || '/resources/chemistry-comics');
  };

  const handleOpenInNewWindow = (e) => {
    if (!isValidUrl) {
      e.preventDefault();
      toast.error('Không thể mở truyện tranh do đường dẫn không hợp lệ');
    }
  };

  const handleDownloadPDF = (e) => {
    if (!isValidUrl || !isGoogleSlide) {
      e.preventDefault();
      toast.error('Không thể tải xuống do đường dẫn không hợp lệ');
    }
  };

  const isImageUrl = (url) => {
    return /\.(jpeg|jpg|gif|png|webp)$/.test(url.toLowerCase());
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
          comicId: parseInt(id),
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
  if (!comic) return <p>Không tìm thấy truyện tranh</p>;

  return (
    <div className="comic-detail">
      <div className="comic-title">
        <h1>{comic.title}</h1>
        <button onClick={handleGoBack} className="back-button">← Quay lại</button>
      </div>

      <div className="comic-meta">
        <p><strong>Tác giả:</strong> {comic.username || 'Không xác định'}</p>
        <p><strong>Ngày tạo:</strong> {new Date(comic.createdAt).toLocaleDateString()}</p>
        <p><strong>Cập nhật lần cuối:</strong> {new Date(comic.updatedAt).toLocaleDateString()}</p>
        {comic.categoryName && <p><strong>Chủ đề:</strong> {comic.categoryName}</p>}
      </div>

      {comic.description && (
        <div className="comic-description">
          <h2>Mô tả</h2>
          <p>{comic.description}</p>
        </div>
      )}

      {comic.comic_url && (
        <div className="comic-content">
          <h2>Nội dung</h2>
          {isValidUrl ? (
            <>
              <div className="comic-embed-container">
                {isGoogleSlide ? (
                  <iframe
                    src={`https://docs.google.com/presentation/d/${slideId}/embed?start=true&loop=true&delayms=3000`}
                    className="comic-slide-embed"
                    title={comic.title}
                    allowFullScreen
                  />
                ) : isImageUrl(comic.comic_url) ? (
                  <img
                    src={comic.comic_url}
                    alt={comic.title}
                    className="comic-image"
                  />
                ) : (
                  <iframe
                    src={comic.comic_url}
                    className="comic-embed"
                    title={comic.title}
                    allowFullScreen
                  />
                )}
              </div>
              <div className="comic-actions">
                <a
                  href={comic.comic_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="external-link"
                  onClick={handleOpenInNewWindow}
                >
                  Mở trong cửa sổ mới
                </a>
                {isGoogleSlide && (
                  <a
                    href={`https://docs.google.com/presentation/d/${slideId}/export/pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="download-link"
                    onClick={handleDownloadPDF}
                  >
                    Tải xuống PDF
                  </a>
                )}
              </div>
            </>
          ) : (
            <div className="comic-error">
              <p>Truyện tranh không khả dụng, vui lòng phản ánh lại với giáo viên!</p>
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

export default ChemistryComicsDetail;