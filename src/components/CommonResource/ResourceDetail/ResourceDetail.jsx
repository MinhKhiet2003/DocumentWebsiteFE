import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../../Auth/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import UserRating from '../../../components/StarRating/UserRating';
import 'react-toastify/dist/ReactToastify.css';
import './ResourceDetail.css';

const ResourceDetail = ({ resourceType }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isValidUrl, setIsValidUrl] = useState(true);
  const [isGoogleSlide, setIsGoogleSlide] = useState(false);
  const [slideId, setSlideId] = useState('');
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedContent, setEditedContent] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(null);

  // API endpoints based on resource type
  const apiEndpoints = {
    'chemistry-comics': {
      resource: `https://hachieve.runasp.net/api/Comic/${id}`,
      comments: `https://hachieve.runasp.net/api/Comic/${id}/comments`,
      ratingType: 'comic'
    },
    'games': {
      resource: `https://hachieve.runasp.net/api/Game/${id}`,
      comments: `https://hachieve.runasp.net/api/comment?gameId=${id}`,
      ratingType: 'game'
    },
    'lesson-plans': {
      resource: `https://hachieve.runasp.net/api/Document/${id}`,
      comments: `https://hachieve.runasp.net/api/comment?documentId=${id}`,
      ratingType: 'document'
    },
    'experiment-videos': {
      resource: `https://hachieve.runasp.net/api/Video/${id}`,
      comments: `https://hachieve.runasp.net/api/comment?videoId=${id}`,
      ratingType: 'video'
    }
  };

  useEffect(() => {
    const fetchResourceAndComments = async () => {
      try {
        setLoading(true);
        const endpoints = apiEndpoints[resourceType];

        const [resourceResponse, commentsResponse] = await Promise.all([
          fetch(endpoints.resource),
          fetch(endpoints.comments),
        ]);

        if (!resourceResponse.ok || !commentsResponse.ok) {
          throw new Error('Không thể tải dữ liệu');
        }

        const resourceData = await resourceResponse.json();
        const commentsData = await commentsResponse.json();

        setResource(resourceData);
        setComments(commentsData);

        // URL validation based on resource type
        const url = resourceData.comic_url || resourceData.gameUrl || resourceData.file_path || resourceData.video_url;
        if (url) {
          if (resourceType === 'chemistry-comics') {
            const { isValid, isSlide, id: slideId } = checkGoogleSlideUrl(url);
            setIsValidUrl(isValid);
            setIsGoogleSlide(isSlide);
            setSlideId(slideId);
          } else if (resourceType === 'experiment-videos') {
            const isValid = validateYouTubeUrl(url);
            setIsValidUrl(isValid);
          } else if (resourceType === 'lesson-plans') {
            const isValid = validateGoogleDocsUrl(url);
            setIsValidUrl(isValid);
          } else {
            const isValid = validateGameUrl(url);
            setIsValidUrl(isValid);
          }

          if (!isValidUrl) {
            toast.error('Đường dẫn không hợp lệ');
          }
        }
      } catch (err) {
        toast.error(err.message || 'Đã xảy ra lỗi khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchResourceAndComments();
  }, [id, resourceType]);

  // URL validation functions
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

  const validateGoogleDocsUrl = (url) => {
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname !== 'docs.google.com') return false;
      const pathParts = urlObj.pathname.split('/');
      if (pathParts.length < 4) return false;
      return true;
    } catch {
      return false;
    }
  };

  const validateGameUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Helper functions
  const getEmbedUrl = (url) => {
    if (!url) return '';

    if (resourceType === 'experiment-videos') {
      if (url.includes('/embed/')) return url;
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      const videoId = (match && match[2].length === 11) ? match[2] : null;
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    } else if (resourceType === 'lesson-plans') {
      try {
        const urlObj = new URL(url);
        const pathParts = urlObj.pathname.split('/');
        const docId = pathParts[3];
        return `https://docs.google.com/document/d/${docId}/preview`;
      } catch {
        return '';
      }
    } else if (resourceType === 'chemistry-comics' && isGoogleSlide) {
      return `https://docs.google.com/presentation/d/${slideId}/embed?start=true&loop=true&delayms=3000`;
    }
    return url;
  };

  const getDocId = (url) => {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/');
      return pathParts[3];
    } catch {
      return '';
    }
  };

  const isImageUrl = (url) => {
    return /\.(jpeg|jpg|gif|png|webp)$/.test(url.toLowerCase());
  };

  // Event handlers
  const handleGoBack = () => {
    navigate(location.state?.from || `/resources/${resourceType}`);
  };

  const handleOpenInNewWindow = (e) => {
    if (!user) {
      e.preventDefault();
      toast.error('Vui lòng đăng nhập để mở trong cửa sổ mới', {
        autoClose: 3000,
        onClose: () => navigate('/login')
      });
      return;
    }
    if (!isValidUrl) {
      e.preventDefault();
      toast.error('Không thể mở do đường dẫn không hợp lệ');
    }
  };

  const handleDownloadPDF = (e) => {
    if (!user) {
      e.preventDefault();
      toast.error('Vui lòng đăng nhập để tải xuống PDF', {
        autoClose: 3000,
        onClose: () => navigate('/login')
      });
      return;
    }
    if (!isValidUrl || !isGoogleSlide) {
      e.preventDefault();
      toast.error('Không thể tải xuống do đường dẫn không hợp lệ');
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Vui lòng đăng nhập để gửi bình luận', {
        autoClose: 3000,
        onClose: () => navigate('/login')
      });
      return;
    }
    if (!newComment.trim()) {
      toast.error('Vui lòng nhập nội dung bình luận');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const endpoints = apiEndpoints[resourceType];

      const requestBody = {
        content: newComment,
        userId: user.id
      };

      if (resourceType === 'chemistry-comics') {
        requestBody.comicId = parseInt(id);
      } else if (resourceType === 'games') {
        requestBody.gameId = parseInt(id);
      } else if (resourceType === 'lesson-plans') {
        requestBody.documentId = parseInt(id);
      } else if (resourceType === 'experiment-videos') {
        requestBody.videoId = parseInt(id);
      }

      const response = await fetch('https://hachieve.runasp.net/api/comment', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
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
      setNewComment('');
      toast.success('Bình luận đã được gửi');
    } catch (err) {
      toast.error(err.message || 'Đã xảy ra lỗi khi gửi bình luận');
    }
  };

  const handleEditComment = (comment) => {
    if (!user) {
      toast.error('Vui lòng đăng nhập để sửa bình luận', {
        autoClose: 3000,
        onClose: () => navigate('/login')
      });
      return;
    }
    setEditingCommentId(comment.comment_id);
    setEditedContent(comment.content);
    setDropdownOpen(null);
  };

  const handleUpdateComment = async (commentId) => {
    if (!user) {
      toast.error('Vui lòng đăng nhập để cập nhật bình luận', {
        autoClose: 3000,
        onClose: () => navigate('/login')
      });
      return;
    }
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
    if (!user) {
      toast.error('Vui lòng đăng nhập để xóa bình luận', {
        autoClose: 3000,
        onClose: () => navigate('/login')
      });
      return;
    }
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
    if (!user) {
      toast.error('Vui lòng đăng nhập để thực hiện hành động này', {
        autoClose: 3000,
        onClose: () => navigate('/login')
      });
      return;
    }
    setDropdownOpen(dropdownOpen === commentId ? null : commentId);
  };

  const handleRatingClick = (e) => {
    if (!user) {
      e.preventDefault();
      toast.error('Vui lòng đăng nhập để đánh giá', {
        autoClose: 3000,
        onClose: () => navigate('/login')
      });
      return;
    }
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (!resource) return <p>Không tìm thấy tài nguyên</p>;

  const resourceUrl = resource.comic_url || resource.gameUrl || resource.file_path || resource.video_url;
  const renderDescription = (description) => {
    if (!description) return null;
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = description.split(urlRegex);
    return parts.map((part, index) => {
      if (urlRegex.test(part)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="description-link"
          >
            {part}
          </a>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="resource-detail">
      <div className="resource-title">
        <h1>{resource.title}</h1>
        <button onClick={handleGoBack} className="back-button">← Quay lại</button>
      </div>

      <div className="resource-meta">
        <p><strong>Tác giả:</strong> {resource.username || resource.uploadedByUsername || 'Không xác định'}</p>
        {resource.classify && <p><strong>Phân loại:</strong> {resource.classify}</p>}
      </div>

      <div className="resource-rating" onClick={handleRatingClick}>
        <UserRating
          userId={user?.id}
          {...{[apiEndpoints[resourceType].ratingType + 'Id']: parseInt(id)}}
          initialUserRating={resource.userRating || 0}
          initialAverageRating={resource.averageRating || 0}
        />
      </div>

      {resource.description && (
        <div className="resource-description">
          <h2>Mô tả</h2>
          <p>{renderDescription(resource.description)}</p>
        </div>
      )}

      {resource.imageUrl && (
        <div className="resource-image">
          <img src={resource.imageUrl} alt={resource.title} />
        </div>
      )}

      {resourceUrl && (
        <div className="resource-content">
          <h2>Nội dung</h2>
          {isValidUrl ? (
            <>
              <div className="resource-embed-container">
                {resourceType === 'chemistry-comics' && isGoogleSlide ? (
                  <iframe
                    src={getEmbedUrl(resourceUrl)}
                    className="resource-slide-embed"
                    title={resource.title}
                    allowFullScreen
                  />
                ) : resourceType === 'chemistry-comics' && isImageUrl(resourceUrl) ? (
                  <img
                    src={resourceUrl}
                    alt={resource.title}
                    className="resource-image"
                  />
                ) : resourceType === 'experiment-videos' ? (
                  <iframe
                    src={getEmbedUrl(resourceUrl)}
                    className="resource-embed"
                    title={resource.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <iframe
                    src={getEmbedUrl(resourceUrl)}
                    className="resource-embed"
                    title={resource.title}
                    allowFullScreen
                  />
                )}
              </div>
              <div className="resource-actions">
                <a
                  href={resourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="external-link"
                  onClick={handleOpenInNewWindow}
                >
                  {resourceType === 'experiment-videos' ? 'Mở trên YouTube' : 'Mở trong cửa sổ mới'}
                </a>
                {(resourceType === 'chemistry-comics' && isGoogleSlide) && (
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
                {resourceType === 'lesson-plans' && (
                  <a
                    href={`https://docs.google.com/document/d/${getDocId(resourceUrl)}/export?format=pdf`}
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
            <div className="resource-error">
              <p>Tài nguyên không khả dụng, vui lòng phản ánh lại với giáo viên!</p>
            </div>
          )}
        </div>
      )}

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
                    {user && comment.user_id === user.id && (
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

export default ResourceDetail;