import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../../Auth/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ExperimentVideoDetail.css';

const ExperimentVideoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isValidUrl, setIsValidUrl] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedContent, setEditedContent] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(null);

  useEffect(() => {
    const fetchVideoAndComments = async () => {
      try {
        if (!user) {
          navigate('/login');
          return;
        }

        const token = localStorage.getItem('token');
        const [videoResponse, commentsResponse] = await Promise.all([
          fetch(`https://hachieve.runasp.net/api/Video/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` },
          }),
          fetch(`https://hachieve.runasp.net/api/comment?videoId=${id}`, {
            headers: { 'Authorization': `Bearer ${token}` },
          }),
        ]);

        if (!videoResponse.ok || !commentsResponse.ok) {
          if (videoResponse.status === 401 || commentsResponse.status === 401) {
            localStorage.removeItem('token');
            navigate('/login');
            return;
          }
          throw new Error('Không thể tải dữ liệu');
        }

        const videoData = await videoResponse.json();
        const commentsData = await commentsResponse.json();

        setVideo(videoData);
        setComments(commentsData);

        if (videoData.video_url) {
          const isValid = validateYouTubeUrl(videoData.video_url);
          setIsValidUrl(isValid);
          if (!isValid) {
            toast.error('Đường dẫn video không hợp lệ');
          }
        }
      } catch (err) {
        toast.error(err.message || 'Đã xảy ra lỗi khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchVideoAndComments();
  }, [id, user, navigate]);

  const validateYouTubeUrl = (url) => {
    try {
      const urlObj = new URL(url);
      const validDomains = ['youtube.com', 'youtu.be', 'www.youtube.com'];
      if (!validDomains.includes(urlObj.hostname.replace('www.', ''))) {
        return false;
      }
      if (url.includes('/embed/')) {
        return true;
      }
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      return (match && match[2].length === 11);
    } catch {
      return false;
    }
  };

  const handleGoBack = () => {
    navigate(`/resources/experiment-videos${location.search}`);
  };

  const getEmbedUrl = (url) => {
    if (!url) return '';
    try {
      if (url.includes('/embed/')) {
        return url;
      }
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      const videoId = (match && match[2].length === 11) ? match[2] : null;
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
      return url;
    } catch {
      return '';
    }
  };

  const handleOpenInYouTube = (e) => {
    if (!isValidUrl) {
      e.preventDefault();
      toast.error('Không thể mở video do đường dẫn không hợp lệ');
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
          videoId: parseInt(id),
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
  if (!video) return <p>Không tìm thấy video</p>;

  return (
    <div className="video-detail">
      <div className='video-title'>
        <h1>{video.title}</h1>
        <button onClick={handleGoBack} className="back-button">← Quay lại</button>
      </div>
      
      <div className="video-meta">
        <p><strong>Tác giả:</strong> {video.uploadedByUsername || "Không xác định"}</p>
        <p><strong>Ngày tạo:</strong> {new Date(video.created_at).toLocaleDateString()}</p>
        <p><strong>Cập nhật lần cuối:</strong> {new Date(video.updated_at).toLocaleDateString()}</p>
      </div>

      {video.description && (
        <div className="video-description">
          <h2>Mô tả</h2>
          <p>{video.description}</p>
        </div>
      )}

      {video.video_url && (
        <div className="video-content">
          <h2>Nội dung video</h2>
          
          {isValidUrl ? (
            <>
              <div className="video-embed-container">
                <iframe
                  src={getEmbedUrl(video.video_url)}
                  className="video-embed"
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="video-actions">
                <a 
                  href={video.video_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="external-link"
                  onClick={handleOpenInYouTube}
                >
                  Mở trên YouTube
                </a>
              </div>
            </>
          ) : (
            <div className="video-error">
              <p>Video không khả dụng, vui lòng phản ánh lại với giáo viên !</p>
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

export default ExperimentVideoDetail;