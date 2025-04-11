import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../../../../components/Sidebar/Sidebar';
import UserRating from '../../../../components/StarRating/UserRating';
import { AuthContext } from '../../../../Auth/AuthContext';
import './LessonPlanDetail.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LessonPlanDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isValidUrl, setIsValidUrl] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedContent, setEditedContent] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(null);

  useEffect(() => {
    const fetchDocumentAndComments = async () => {
      try {
        if (!user) {
          navigate('/login');
          return;
        }

        const token = localStorage.getItem('token');
        const [documentResponse, commentsResponse] = await Promise.all([
          fetch(`https://hachieve.runasp.net/api/Document/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` },
          }),
          fetch(`https://hachieve.runasp.net/api/comment?documentId=${id}`, {
            headers: { 'Authorization': `Bearer ${token}` },
          }),
        ]);

        if (!documentResponse.ok || !commentsResponse.ok) {
          if (documentResponse.status === 401 || commentsResponse.status === 401) {
            localStorage.removeItem('token');
            navigate('/login');
            return;
          }
          throw new Error('Không thể tải dữ liệu');
        }

        const documentData = await documentResponse.json();
        const commentsData = await commentsResponse.json();

        setDocument(documentData);
        setComments(commentsData);

        if (documentData.file_path) {
          const isValid = validateGoogleDocsUrl(documentData.file_path);
          setIsValidUrl(isValid);
          if (!isValid) {
            toast.error('Đường dẫn tài liệu không hợp lệ');
          }
        }
      } catch (err) {
        toast.error(err.message || 'Đã xảy ra lỗi khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchDocumentAndComments();
  }, [id, user, navigate]);

  const handleGoBack = () => {
    navigate(`/resources/lesson-plans${location.search}`);
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

  const handleOpenInNewWindow = (e) => {
    if (!isValidUrl) {
      e.preventDefault();
      toast.error('Không thể mở tài liệu do đường dẫn không hợp lệ');
    }
  };

  const handleDownloadPDF = (e) => {
    if (!isValidUrl) {
      e.preventDefault();
      toast.error('Không thể tải xuống do đường dẫn không hợp lệ');
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
          documentId: parseInt(id),
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
      setNewComment('');
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
  if (!document) return <p>Không tìm thấy tài liệu</p>;

  return (
    <div className="document-detail">
      <div className="document-title">
        <h1>{document.title}</h1>
        <button onClick={handleGoBack}>← Quay lại</button>
      </div>

      <div className="document-meta">
        <p><strong>Tác giả:</strong> {document.uploadedByUsername || "Không xác định"}</p>
        <p><strong>Ngày tạo:</strong> {new Date(document.createdAt).toLocaleDateString()}</p>
        <p><strong>Cập nhật lần cuối:</strong> {new Date(document.updatedAt).toLocaleDateString()}</p>
      </div>

      {/* Thêm UserRating vào đây */}
      <div className="document-rating">
        <UserRating
          userId={user?.id}
          documentId={parseInt(id)}
          initialUserRating={document.userRating || 0}
          initialAverageRating={document.averageRating || 0}
        />
      </div>

      {document.description && (
        <div className="document-description">
          <h2>Mô tả</h2>
          <p>{document.description}</p>
        </div>
      )}

      {document.file_path && (
        <div className="document-content">
          <h2>Nội dung</h2>
          {isValidUrl ? (
            <>
              <div className="document-embed-container">
                <iframe
                  src={getEmbedUrl(document.file_path)}
                  className="document-embed"
                  title={document.title}
                  allowFullScreen
                />
              </div>
              <div className="document-actions">
                <a
                  href={document.file_path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="external-link"
                  onClick={handleOpenInNewWindow}
                >
                  Mở trong cửa sổ mới
                </a>
                <a
                  href={`https://docs.google.com/document/d/${getDocId(document.file_path)}/export?format=pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="download-link"
                  onClick={handleDownloadPDF}
                >
                  Tải xuống PDF
                </a>
              </div>
            </>
          ) : (
            <div className="document-error">
              <p>Tài liệu không khả dụng, vui lòng phản ánh lại với giáo viên!</p>
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

  function getEmbedUrl(url) {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/');
      const docId = pathParts[3];
      return `https://docs.google.com/document/d/${docId}/preview`;
    } catch {
      return '';
    }
  }

  function getDocId(url) {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/');
      return pathParts[3];
    } catch {
      return '';
    }
  }
};

export default LessonPlanDetail;